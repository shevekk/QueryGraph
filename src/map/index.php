<!DOCTYPE html>
<html>
  <head>
    <title>QueryGraph - Map</title>
    <link rel="icon" type="image/png" href="../img/icon.png" />
  </head>
  <body>
    <link rel="stylesheet" href="style.css" />

    <link rel="stylesheet" href="../../node_modules/leaflet/dist/leaflet.css" crossorigin=""/>
    <script src="../../node_modules/leaflet//dist/leaflet.js" crossorigin=""></script>

    <script type="text/javascript" src="../../node_modules/jquery/dist/jquery.min.js"></script>

    <link rel="stylesheet" type="text/css" href="../../node_modules/leaflet.markercluster/dist/MarkerCluster.css" />
    <link rel="stylesheet" type="text/css" href="../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css" />

    <script src='../../node_modules/leaflet.markercluster/dist/leaflet.markercluster.js'></script>

    <script type="text/javascript" src="map.js"></script>
    <script type="text/javascript" src="../data/elementType.js"></script>
    <script type="text/javascript" src="../data/nodeType.js"></script>
    <script type="text/javascript" src="../data/edgeType.js"></script>

    <script type="text/javascript" src="../config/config.js"></script>

    <script type="text/javascript" src="../dictionary/dictionary.js"></script>
    
    <div id="selectDiv"></div>

    <div id="map"></div>

    <div id="changePropDiv"></div>

    <script>
      // Get data from php
      let graphJson = '<?=$_POST['graph']?>'; 
      let dataJson = '<?=str_replace("'","\'",$_POST['data']);?>'; 
      let lang = '<?=$_POST['lang']?>';
      let configFileUrl = '../' + '<?=$_POST['config']?>'; 

      QueryGraph.Dictionary.Dictionary.load(lang, "../", function()
      {
        QueryGraph.Config.Config.load(configFileUrl, function()
        {
          // Display map
          let map = new QueryGraph.Map.Map(graphJson, dataJson);
          map.init();
        });
      });
    </script>
  </body>
</html>
