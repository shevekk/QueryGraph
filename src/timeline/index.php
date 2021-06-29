<!DOCTYPE html>
<html>
  <head>
    <title>QueryGraph - Map</title>
    <link rel="icon" type="image/png" href="../img/icon.png" />
  </head>
  <body>
    <link rel="stylesheet" href="style.css" />

    <script type="text/javascript" src="../../node_modules/jquery/dist/jquery.min.js "></script>

    <link rel="stylesheet" href="../../node_modules/vis-timeline/dist/vis-timeline-graph2d.min.css "/>
    
    <script type="text/javascript" src="../../node_modules/vis-timeline/dist/vis-timeline-graph2d.min.js "></script>

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
