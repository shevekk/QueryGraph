# QueryGraph

QueryGraph is a web tool for creating queries in SPARQL from graphs.

The software allows to draw a graph composed of nodes representing a data and of links between these data, from that the software generates a SPARQL request.

The tool allows to explore the Wikidata database (english and french), but also the Bibliothèque nationale de France and Persee databases (french).

[Link to test the tool](http://dataexplorer.hd.free.fr/QueryGraph/)

## Technologies
Project is created with:
- vis-network
- font-awesome
- jquery
- vis-timeline
- chart.js
- leaflet
- leaflet.markercluster
   
## Setup
To run this project, install it locally using npm:

$ npm install
$ # to run install a http-server
$ # https://www.npmjs.com/package/http-server
$ # npm install --global http-server
$ http-server

## Configuration

Config file : src/config/config.json

Config Help : doc/Config_QueryGraph_en.pdf and doc/Config_QueryGraph_fr.pdf

![](http://dataexplorer.hd.free.fr/img/querygraph_capture_en.png)
