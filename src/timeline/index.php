<!DOCTYPE html>
<html>
  <head>
    <title>QueryGraph - Map</title>
    <link rel="icon" type="image/png" href="../img/icon.png" />
  </head>
  <body>
    <link rel="stylesheet" href="style.css" />

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js "></script>

    <link rel="stylesheet" href="libs/vis.min.css" />
    
    <script type="text/javascript" src="libs/vis.min.js"></script>

    <script type="text/javascript" src="timeLine.js"></script>
    <script type="text/javascript" src="../data/elementType.js"></script>
    <script type="text/javascript" src="../data/nodeType.js"></script>
    <script type="text/javascript" src="../data/edgeType.js"></script>

    <script type="text/javascript" src="../config/config.js"></script>

    <script type="text/javascript" src="../dictionary/dictionary.js"></script>
    
    <div id="selectDiv"></div>

    <div id="timeLine"></div>

    <div id="changePropDiv"></div>

    <script>
      // Get data from php
      let graphJson = `<?=$_POST['graph']?>`; 
      let dataJson = `<?=str_replace("'","\'",$_POST['data']);?>`; 
      let lang = '<?=$_POST['lang']?>';
      let configFileUrl = '../' + '<?=$_POST['config']?>'; 

      QueryGraph.Dictionary.Dictionary.load(lang, "../", function()
      {
        QueryGraph.Config.Config.load(configFileUrl, function()
        {
          // Display map
          let timeLine = new QueryGraph.TimeLine.TimeLine(graphJson, dataJson);
          timeLine.init();
        });
      });
    </script>
  </body>
</html>
