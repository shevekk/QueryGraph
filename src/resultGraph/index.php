<!DOCTYPE html>
<html>
  <head>
    <title>QueryGraph - Graph Result</title>
    <link rel="icon" type="image/png" href="../img/icon.png" />
  </head>
  <body>
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="../../node_modules/font-awesome/css/font-awesome.min.css" />
    
    <div id="contentDiv"><div id="contentData"></div><button id="stopForces"></button></div>
    <div id="graph"></div>

    <script type="text/javascript" src="../../node_modules/vis-network/dist/vis-network.min.js "></script>
    <script type="text/javascript" src="../../node_modules/jquery/dist/jquery.min.js "></script>

    <script type="text/javascript" src="resultGraph.js"></script>
    <script type="text/javascript" src="../data/elementType.js"></script>
    <script type="text/javascript" src="../data/nodeType.js"></script>
    <script type="text/javascript" src="../data/edgeType.js"></script>

    <script type="text/javascript" src="../config/config.js"></script>

    <script type="text/javascript" src="../dictionary/dictionary.js"></script>

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
          // Display graph
          let graph = new QueryGraph.ResultGraph.ResultGraph(graphJson, dataJson);
          graph.draw();
        });
      });

    </script>

  </body>
</html>
