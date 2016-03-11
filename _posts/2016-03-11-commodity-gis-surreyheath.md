---
layout: post
title:  "Commodity GIS"
date:   2016-03-11 15:00:00
category: GIS
tags: GIS
author: James Rutter
---

Commodity GIS
-------------

…..so at Surrey Heath, we (the GIS team...all two of us) find ourselves in the nice position of knowing a bit about data and how to handle it. By handle it I mean how to obtain it, how to transform or do something with it and how to put it somewhere else or publish it.

Dabbling with data has led us into new business areas. Who knew the GIS team would provide an automated workflow to publish their Council’s expenditure details? Fact...GIS is not just about playing amateur cartographers in front of burgeoning ESRI software anymore. The ‘I’ in GIS is taking centre stage because increasingly our knowledge is being used to turn data into information, and frequently that information might have no geospatial component (albeit nice if it does).

During the last few years we have been moving away from the traditional GI vendor single platform scenario and incorporating a decent blend of open source and proprietary software (we gave up Oracle and moved to PostGIS nearly ten years ago). Incidentally, we do not expect a ‘free ride’ from open source and have contributed to funding core development and plugin development for Qgis. As my friend Steven Feldman oft quotes:- 


----------


>“You get what you pay for. Everyone else gets what you pay for. You get what everyone else pays for.” 


----------


However there is another change occurring. ‘Digital’ is a word interpreted differently by different people. Personally I like this interpretation…

>“Digital government is using modern tools and technologies to seize the digital opportunity and fundamentally change how government serves both its internal and external customers — building a 21st century platform to better serve citizens.”

‘Digital’ is about using technology to facilitate service design and doing government better. I think this is why many authorities have been slow to adjust because they are shackled to the traditional ‘boxes and pipes’ mentality proffered by ICT departments struggling to keep servers alive, finance systems running and meeting ever burdensome Public Sector Network security compliance requirements. Many authorities have not yet realised that ‘Digital’ is distinct from, but should be supported by ICT and technology.

So what’s all this got to do with GIS and data? Well we are now thinking more strategically about how we do things and several key tenets are emerging.

 - Small pieces loosely connected. Don’t think software….think building
   capability that can be reused many times.
 - Maximise the use of cloud services and best of breed subscription based services. 
 - Global players provide resilience (think Amazon and Salesforce here). 
 - API, API and API….these let you connect stuff together. 
 - Disruptive technology is good for the local authority software market which
   traditionally has for years been ‘stitched up’ by legacy vendors.

Use of what I would call commodity cloud based services is modernising our approach to GIS at Surrey Heath so our services are increasingly being called upon to modernise service delivery and to solve problems. Want a map on a webpage...CartoDB. Want to remind taxi drivers their license needs renewing? We’re going to use FME to check the licensing database and fire off a call to Twilio cloud telephony service to send them an SMS. Want to host an RSS feed...Amazon S3 storage. Want to send an email about something? You don’t need your own email stack anymore….just make an api call to Sendgrid. These are all computing ‘commodities’ which let you build capability and can be connected together however your imagination sees fit.

To finish, let's take a look at a specific piece of capability that we’re using:- forms based data capture capability in the guise of [Fulcrum][fulcrum]. This is a subscription based cloud service which does one thing very well. Subscription fees are nice because you pay for what you use and you can scale the service up or down to suit….no long contracts to lock you in!

Fulcrum is out there on the web so authorities can share accounts and give whoever appropriate access. It can be accessed from anywhere that has web access. It can be used offline. Anyone with consumer grade kit can use it (think iPhone, Android tablets etc). Importantly there is a great api available with Fulcrum. In our case we connect FME up to what Fulcrum terms a 'Datashare' so we can automatically download all our captured data back into the building if we need to. Fulcrum lets us capture data, location, audio, photographs, signatures and barcodes.

We regard Fulcrum as a computing commodity because it's a single subscription based cloud platform which has many uses and can be connected to different things. As a starter for ten here are some actual and planned uses of Fulcrum at Surrey Heath.

 - Data capture for our grounds maintenance team to provide new GIS datasets.
 - Car parks team use it to perform monthly car park inspections.
 - Our council tax ratings inspectors are going to use it to record property details on site and photograph the property.
 - We have created an inventory system of 23,000 items for our museum. Each item will be barcoded. Museum staff will then be able to scan the barcode with their phone and it will pull up the details for that item.
 - Our drainage engineer is using Fulcrum to map gullies and headwalls along with capturing data on pipe diameters and depths etc.

Here's some of the services and software we are using to expand our capability. [Safe Software's] FME. [CartoDB]. [Fulcrum]. [Amazon RDS] (cloud PostGIS). [Amazon S3] (cloud storage). [Twilio] (cloud telephony). [SendGrid] (cloud email).

![alt text](https://s3-eu-west-1.amazonaws.com/shbcdatastore/web_image_hosting/Fulcrum_data_collection.png "iPhone")
Capturing grounds maintenance data with Fulcrum

![alt text](https://s3-eu-west-1.amazonaws.com/shbcdatastore/web_image_hosting/Fulcrum_apps.png "iPhone")
Different Fulcrum data capture apps



[fulcrum]: http://www.fulcrumapp.com
[amazon rds]:https://aws.amazon.com/rds/ 
[cartodb]:http://cartodb.com 
[safe software's]:http://www.safe.com
[amazon s3]:https://aws.amazon.com/s3/ 
[twilio]:http://www.twilio.com
[sendgrid]:http://www.sendgrid.com

> Written with [StackEdit](https://stackedit.io/).

