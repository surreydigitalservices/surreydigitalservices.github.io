---
layout: post
title:  "QGIS Rooftop Aspect Analysis"
date:   2016-03-03 09:00:00
category: DSM
tags: QGIS, GDAL, GRASS, DSM, lidar,
author: Robert Spiers
---

This post shows how we have used lidar data to calculate the aspect and estimate the south facing area of a rooftop.

### Requirements
* [QGIS](http://www.qgis.org/) - used to process the data.
* [PostGIS](http://postgis.net/) database - to store the procuct and run some queries on it.
* Lidar data or other asc DSM - you can view coverage and download free lidar tiles from the UK's Environment Agency [here](http://environment.data.gov.uk/ds/survey/index.jsp#/survey).
* Building polygon data. We used Ordnance Survey's [MasterMap](https://www.ordnancesurvey.co.uk/business-and-government/products/mastermap-products.html) for this.

### Desired Product

First a preview of what we can produce:

In red is the South facing aspect area of a rooftop. In blue are buildings we are interested in analysing.

![image of product](/images/Roof-aspect-analysis/roof-aspect-product.png){: .img-responsive }

### Workflow Outline

1. Process lidar dsm.asc into aspect rasters
1. Reclassify aspect rasters to simplify values
1. Polygonize the aspect rasters
1. Load into PostGIS (filter out unwanted classes on import)
1. Clip out features not within target building polygons
1. Select features within the target building polygons, includes area sizes
1. Calculate percentage of rooftop which is south facing

### Workflow Screenshots

1. #### Process lidar dsm.asc into aspect rasters

	Using the QGIS Toolbox: GDAL → Aspect (run in batch for multiple asc files)
	
	Source asc file:
	
	![image of asc input](/images/Roof-aspect-analysis/roof-aspect-dsm-asc.png){: .img-responsive }
	
	Output tif file:
	
	![image of output tif](/images/Roof-aspect-analysis/roof-aspect-dsm-aspect.png){: .img-responsive }

1. #### Reclassify aspect rasters to simplify values
	
	QGIS Toolbox: Grass → Raster → Classify

	This reclassification is done to set the pixel value to 1 if the aspect is between 135-225 degrees from North and 0 if it is not. Reclassifying helps speed up later processes and reduce file sizes.

	![image of reclassified tif](/images/Roof-aspect-analysis/roof-aspect-dsm-aspect-reclassified.png){: .img-responsive }
	
1. #### Polygonize the aspect rasters
	
	QGIS Toolbox: GDAL → Conversion → Polygonize (raster to vector)

	This process converts rasters to vector data. We need to query the data later to calculate surface areas so converting the data to vector is useful here.

	![image of polygonize](/images/Roof-aspect-analysis/roof-aspect-dsm-aspect-reclassified-polygonized.png){: .img-responsive }
	
1. #### Load into PostGIS (filter out unwanted classes on import)
	
	Importing the data to a PostGIS database allows us to run queries later on to calculate area sizes and intersections. When running the import a filter can be set to exclude features with certain values. In the below example features with a value of 0 were excluded from the import. 

	This leaves us with a vector layer of all South facing areas.

	![image of polygonized tif](/images/Roof-aspect-analysis/roof-aspect-postgis-vector.png){: .img-responsive }
	
1. #### Clip out features not within target building polygons
	
	The aspect layer is clipped to our building layer so that the surface area estimates only include the building extent. 

	![image of postgis vector](/images/Roof-aspect-analysis/roof-aspect-postgis-vector-clipped.png){: .img-responsive }
	
1. #### Select features within the target building polygons, includes area sizes

	We also needed to split the features where they cross building polygons. We then calculated the gross surface area of the south facing aspect shapes. The PostGIS functions ```st_intersection``` and ```st_area``` were used here.

1. #### Calculate percentage of rooftop which is south facing
	We then calculated the proportion of the building which we estimate as South facing.

### Product

Everything filtered, clipped and queried...

![image of product](/images/Roof-aspect-analysis/roof-aspect-product.png){: .img-responsive }
	
### Credit
- Aerial imagery and lidar: © Bluesky Internation Limited
- Building polygons:  © Ordnance Survey 2016. Lic No. 100019625.
