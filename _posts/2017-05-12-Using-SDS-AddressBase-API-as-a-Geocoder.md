---
layout: post
title:  "Using SDS AddressBase API as a Geocoder"
date:   2017-05-12 09:00:00
category: Python
tags: Python,Geocode,UPRN,AddressBase
author: Robert Spiers
---

This post shows to use Python to geocode a list of UPRNs using SDS [AddressBase API](https://surreydigitalservices.github.io/sds-addresses/) with Python.

### Query the API using Python Requests

Lookup a single UPRN - try this out in python console to see how it works:

```py
# import the requests module
import requests

# set the endpoint url to the api
url = 'https://address.digitalservices.surreyi.gov.uk/addresses'

# set the header to include authorization method and the api_key 
headers = {"Authorization":"Bearer my_secret_api_key"}

# set parameters to add to url
params = {
	"format":"all", 
	"query":"all", 
	"uprn":10007088276
}

# make the request
r = requests.get(url,params=params,headers=headers)

# view the response using requests json method
print(r.json()) # returns an unsorted list of data
```

### Dealing with the response

To sort the returned json into something more readable use the python json module:

```py
import json

# print entire json response
print(json.dumps(r.json()[0], indent=2, sort_keys=True)) 
```

The result is presented like so:
```json
{
  "country": "England",
  "createdAt": "Oct 14, 2016",
  "details": {
    "blpuCreatedAt": "Sep 3, 2007",
    "blpuUpdatedAt": "Feb 10, 2016",
    "classification": "CL06",
    "custodian": "Guildford",
    "file": "part-0120.csv",
    "isCommercial": true,
    "isElectoral": false,
    "isHigherEducational": false,
    "isPostalAddress": false,
    "isResidential": false,
    "primaryClassification": "Commercial",
    "secondaryClassification": "Leisure",
    "state": "approved",
    "usrn": "16000364"
  },
  "gssCode": "E07000209",
  "location": {
    "easting": 501423.0,
    "lat": 51.2606291,
    "long": -0.5478142,
    "northing": 152276.0
  },
  "ordering": {
    "paoText": "SUTHERLAND MEMORIAL PARK",
    "saoText": "PAVILION",
    "street": "CLAY LANE"
  },
  "postcode": "gu47ju",
  "presentation": {
    "area": "Surrey",
    "postcode": "GU4 7JU",
    "property": "Pavilion Sutherland Memorial Park",
    "street": "Clay Lane",
    "town": "Guildford"
  },
  "uprn": "10007088276"
}
```

To print a single key:value pair:
```py
# first parse the response json so we can access the keys
json_parsed = json.loads(json.dumps(r.json()))

# set keys to variables
uprn = json_parsed[0]['uprn']
easting = json_parsed[0]['location']['easting']
northing = json_parsed[0]['location']['northing']

# print the values
print(uprn, easting, northing)
# returns:
# 10007088276 501423.0 152276.0
```

### Automate Geocoding by UPRN
Here's a script ready to go which will geocode a csv list of UPRNs, adding the easting & northing values, and appending the successful results into another csv.

```py
## UPRN Geocoder Script ##

## import python library
import csv, json, requests

## Read csv of UPRNs
def import_uprn():
	with open('uprn_targets.csv') as import_csv:
		reader = csv.reader(import_csv)
		import_list = list(reader)
		uprn_targets = []
		uprn_targets.extend(import_list)
	return uprn_targets

## http GET each UPRN
def query_SDS_api(uprn):
	params = {
		"format":"all", 
		"query":"all", 
		"uprn":uprn
	}
	url = 'https://address.digitalservices.surreyi.gov.uk/addresses'
	headers = {"Authorization":"Bearer my_secret_api_key"}
	r = requests.get(url,params=params,headers=headers)
	if len(r.json()) == 0:
		print(uprn + ' not found')
	elif len(r.json()) > 0:
		parse_json_response(r)
		return r

## parse json data
def parse_json_response(r):
	json_parsed = json.loads(json.dumps(r.json()))
	uprn = json_parsed[0]['uprn']
	easting = json_parsed[0]['location']['easting']
	northing = json_parsed[0]['location']['northing']
	append_result_to_csv(uprn, easting, northing)

## append to csv
def append_result_to_csv(uprn, easting, northing):
	with open('uprn_geocoded.csv', 'a') as outcsv:
		writer = csv.writer(outcsv, delimiter=',', lineterminator='\n')
		writer.writerow([uprn, easting, northing])
		print(uprn + ' appended to csv')

## Run the geocoder
def Geocode():
	uprn_targets_tuple = import_uprn()
	uprn_targets = [i for sub in uprn_targets_tuple for i in sub]
	for uprn in uprn_targets:
		query_SDS_api(uprn)
	
Geocode()
```

To use it copy the contents into a file called `Geocoder.py` [or download from here](https://github.com/surreydigitalservices/SDS-python-geocoder/blob/master/Geocoder.py) and save this to a directory on your machine. Replace `my_secret_api_key` with your SDS AddressBase API key on line 23.

Create a csv of UPRNs called `uprn_targets.csv`. Put this in the same folder. [Example csv here](https://github.com/surreydigitalservices/SDS-python-geocoder/blob/master/uprn_targets.csv).

Open a command window in the directory which has the `Geocoder.py` and `uprn_targets.csv` file and type:

```cmd
c:\python27\python.exe Geocoder.py
```
Here you can see I used python 2.7 but the script works with python 3.5 too.

### Example Results

Results will be printed to the cmd window and a csv file `uprn_geocoded.csv` will be created and appended to in the working directory - the same one where the `Geocoder.py` is.

Here's an example of the response printed to the command window. Notice some fake UPRNs to show the report when they are not found:
```cmd
V:\Projects\sds_api>c:\python27\python.exe Geocoder.py
100061380353 appended to csv
100061380354 appended to csv
100061382605 appended to csv
100061382614 appended to csv
100061382615 appended to csv
10006138261 not found
100061382616 appended to csv
100061382617 appended to csv
10006138261 not found
100061382618 appended to csv
100061382619 appended to csv
10006138262 not found
100061382620 appended to csv
100061382621 appended to csv
```

Here's the `uprn_geocoded.csv`:
```csv
100061380353,501535.07,152651.47
100061380354,501531.29,152648.93
100061382605,501501.0,152525.0
100061382614,501467.0,152515.0
100061382615,501519.0,152498.0
100061382616,501451.53,152499.74
100061382617,501513.46,152498.45
100061382618,501449.88,152494.31
100061382619,501499.37,152493.56
100061382620,501450.46,152490.07
100061382621,501489.52,152487.36
```

### Adding Other Key:Value Pairs to the Geocoder
Add other key:value pairs from the response by modifying the `parse_json_response()` function in `Geocoder.py`. The `append_result_to_csv()` must be modified to include any new values.

Example adding postcode to the csv writer:
```py
## parse json data
def parse_json_response(r):
	json_parsed = json.loads(json.dumps(r.json()))
	uprn = json_parsed[0]['uprn']
	easting = json_parsed[0]['location']['easting']
	northing = json_parsed[0]['location']['northing']
	postcode = json_parsed[0]['postcode']
	append_result_to_csv(uprn, easting, northing, postcode)

## append to csv
def append_result_to_csv(uprn, easting, northing, postcode):
	with open('uprn_geocoded.csv', 'a') as outcsv:
		writer = csv.writer(outcsv, delimiter=',', lineterminator='\n')
		writer.writerow([uprn, easting, northing, postcode])
		print(uprn + ' appended to csv')
```

### What Next? Some ideas of how to use this
- Use the UPRN to join values extracted from the geocoding back to your data.
- Instead of writing to csv create a function to update the results back into your data. To connect python to PostGIS use [psycopg2](https://github.com/psycopg/psycopg2).
- With QGIS 2.16 you can run this script direct from the python console. The requests, json, and csv modules are installed by default. Really easy for GIS users to have a UK wide UPRN AddressBase Geocoder now.
