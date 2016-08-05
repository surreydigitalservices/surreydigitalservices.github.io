---
layout: post
title:  "Improving your tertiary classifications with OS MasterMap and FME"
date:   2016-08-04 11:54:38
category: Ordnance Survey
tags: Ordnance Survey, FME, LLPG
author: David McDermott
---

In 2012, Northumberland County Council made a submission to GeoPlaces’ Citizen Award for their work in identifying properties. While there submission did not win, it was highly commended, and it certainly caught my eye. I was particularly interested in how they used building polygons in the OS MasterMap Topographic Layer to determine tertiary BLPU classification. This outcome is achieved in two phases. First, determine the relationship between the building polygons, then assign these polygons with a UPRN. 

Two years later, I managed to catch up with the Ryan Gilchrist, the author of the case study, to discuss how he went about achieving this goal. Ryan very kindly provided me with his slides and some SQL scripts, and I subsequently went to work translating them for use with PostGIS. The scripts Ryan provided only allowed me to complete phase one, the result of which you can see below:

```sql
--Creates a separate table containing topo building polygons greater than 25m
DROP TABLE osmm_sandbox.mmbuild_25;
CREATE TABLE osmm_sandbox.mmbuild_25 AS SELECT * FROM osmm_jan_15_loader.topographicarea WHERE descriptivegroups = 'Building' AND ST_Area(wkb_geometry) >= '25';
CREATE INDEX mmbuild_25_gix ON osmm_sandbox.mmbuild_25 USING GIST (wkb_geometry);

--Create the touches table

DROP TABLE IF EXISTS osmm_sandbox.mmbuild_25_touches;
CREATE TABLE osmm_sandbox.mmbuild_25_touches AS SELECT a.fid, count(*) AS hits 
FROM osmm_sandbox.mmbuild_25 as a, osmm_sandbox.mmbuild_25 as b
WHERE st_touches(a.wkb_geometry, b.wkb_geometry)
GROUP by a.fid;
CREATE INDEX mmbuild_25_touches_idx ON osmm_sandbox.mmbuild_25_touches(fid);

--Writes the number "hits" back into the mmbuild_25 table while also replacing NULL values with 0

ALTER TABLE osmm_sandbox.mmbuild_25 ADD COLUMN toid_hits int;
UPDATE osmm_sandbox.mmbuild_25 AS a
SET toid_hits = ( SELECT hits FROM osmm_sandbox.mmbuild_25_touches WHERE fid = a.fid );
UPDATE osmm_sandbox.mmbuild_25 AS a
SET toid_hits = 0 WHERE toid_hits IS NULL;

--Assign building type

ALTER TABLE osmm_sandbox.mmbuild_25 ADD COLUMN toid_status varchar;
UPDATE osmm_sandbox.mmbuild_25 AS a
SET toid_status = 'DET' WHERE toid_hits = 0;
UPDATE osmm_sandbox.mmbuild_25 AS a
SET toid_status = 'TER' WHERE toid_hits = 2;
UPDATE osmm_sandbox.mmbuild_25 AS a
SET toid_status = 'SEM' WHERE toid_hits = 1;
UPDATE osmm_sandbox.mmbuild_25 AS a
SET toid_status = 'END' WHERE toid_hits = 1 AND exists(SELECT 'x' FROM osmm_sandbox.mmbuild_25 as b where st_touches(a.wkb_geometry, b.wkb_geometry) and toid_hits = 2 );
```

Filtering out building polygons less than 25 sq.m excludes garages and small ancillary buildings. This is not perfect; there are infact house with smaller than 25 sq.m, but it was a good starting point. 

To my shame, I never really progressed further than this project. Other projects ended up taking priority, and there were a few conditionals that needed to be met in the gazetteer first before phase two could be implemented. 

Fast forward a year and I am now using FME for the bulk of my data processing and analysis. With the aforementioned conditionals met (thanks to FME and GeoPlace), I had the time and opportunity to complete this project.

Rather than stick with the tried and tested method mentioned above, I opted to see if I could replicate the process using FME. This had two advantages; I could combine the two phases in a single workspace, and I wouldn’t have to mess around with temp tables.

The key to successfully replicating the SQL scripts was find an adequate alternative for the touches function. Up steps the **SpatialRelator** Transformer. This determines the topological relationship between a set of features (touches, intersects, overlays) and tags them with a related count value. It also allows you to specify which attributes (fields) must differ which in this case was the TOID. 

Using a SELECT statement (see below) in a PostGIS Reader I was able to extract the required polygons and route them into both the *Requestor* and *Supplier ports* of the **SpatialRelator**. This appended the number of touches between each unique feature. Using a **TestFilter**, I split features into three ports labelled *zero touch*, *one  touch* and *two touch* as these could be automatically classified as detached, semi-detached as terraced respectively.  Features that has 3 or more touches are filtered into the *unclassified* port and set aside for a later date.

```sql
---PostGIS Reader Select Statement

SELECT * 
FROM osmm.topographicarea
WHERE descriptivegroup = ‘Building’
AND ST_Area(wkb_geometry) >= ‘25’
```
The automatic classification of buildings based on touches is a rather big assumption. In the case of building at the end of a terrace this is not entirely accurate. A building at the end of a terrace would only touch one other building and therefore be mis-classified as a semi-detached. 

To get around this little quirk, I needed to split the workflow into two streams. The first stream would route the *one touch* and *two touch* ports from the **TestFilter** into the *Requestor* and *Supplier* ports of a second **SpatialRelator** respectively. From this I could classify polygons with zero touches as semi-detached, and polygons with one touch as end terrace. The *Output* was then be routed to an **AttributeCreator**. The second stream would route the *two touch* and *zero touch* ports straight into an second **Attribute Creator**.

The **AttributeCreator** simply creates a new attribute (field) called toid_class and populates it with more relevant values using a conditional statement. In the first stream (the end terrace stream) I populated the toid_class field with ‘if touches equals zero then SEM else if touches equals one then END’. In stream two, I populated the toid_class using ‘if touches equals zero then DET else if touches equals two then TER’. As you can see below, the results of this transformation are promising. 

![](https://s3-eu-west-1.amazonaws.com/shbcdatastore/web_image_hosting/tertiary_class_sample_map.jpg)

Now that we have the building polygons populated with a classification value I needed to assign a UPRN. To achieve this I used a **SQLCreator** to read in the UPRN, Eastings, Northings, Logical Status and BLPU Classification from the BLPU table in my Aligned Assets Gazetteer. You can see the SQL statement I used below. Before passing these gazetteer records into the **PointOnAreaOverlayer** I needed to spatialise them. This was done by using the **VertexCreator** to create a point using the easting and northing, and the **CoordinateSystemSetter** to assign a EPSG. Once this was done I could pass the BLPU points into the *point* port and the building polygons into the *area* port.

```sql
---SQL Creator statement

SELECT UPRN, EASTING, NORTHING, LOGICAL_STATUS, BLPU_CLASS
FROM BLPU
WHERE LOGICAL_STATUS = ‘1’
AND BLPU_CLASS like ‘RD%
AND PARENT_UPRN IS NULL
’
```

This is not ideal as you will inevitably have instances where there is more than one point per building polygon. This might indicate flats, bedsits or something else entirely. In an effort to filter these out I only included BLPU records that didn’t have a parent UPRN. For those that pass all my where clauses, I only took features that had one to one match and routed off the rest into a separate file to look at later. 

Using this method I managed to update **88%** of my residential BLPU’s to tertiary classification in my LLPG. It also highlighted a number of errors such as points outside of the building or buildings missing from the OS MasterMap Topographic Layer. The improvements to this dateset has greatly improved its value and usefulness. It now has the potential to be used in demographic studies, business intelligence, emergency planning and more.

