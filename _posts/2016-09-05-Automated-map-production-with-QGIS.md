---
layout: post
title:  "Automated map production with QGIS"
date:   2016-09-05 09:00:00
category: Python
tags: Python, QGIS
author: Robert Spiers
---

### Purpose
I needed to create create standardised PDF maps on a regular basis. For this I usually use a template set up in QGIS then export PDFs using the atlas feature. However... I found this can be entirely automated so you don't even need to open the QGIS program to export the product. This can be used to automate map production as a scheduled job or batch produce maps when new data is available.

### How it works
Using python the QGIS libraries can be imported and executed. This process can be triggered in windows using a batch file which runs the python script. There's some [guidance for linux](http://docs.qgis.org/testing/en/docs/pyqgis_developer_cookbook/intro.html#running-custom-applications) too in the super useful qgis cookbook.

I modified the [python script from Tim Sutton](http://kartoza.com/how-to-create-a-qgis-pdf-report-with-a-few-lines-of-python/) to be specific to my qpt template. I also added a way to specify coords to focus the map canvas on and apply a filter to a layer. Layers which are added to the `.qgs` project will be exported in the PDF. 

I thought this was worth saving and sharing so the files are available [here](https://github.com/rjspiers/qgis-standalone-map-export) with an explanation of how to get these example files working on windows in the readme.

### Example uses
- Use [psycopg2](https://pypi.python.org/pypi/psycopg2) to check for new data to export to PDF.
- Add more layers to the `.qgs` file or load and style the directly in the script. They will be printed to the PDF. 
- Modify the script to accept variables and make a map requester with FME
