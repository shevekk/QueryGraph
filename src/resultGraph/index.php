<!DOCTYPE html>
<html>
  <head>
    <title>QueryGraph - Graph Result</title>
    <link rel="icon" type="image/png" href="../img/icon.png" />
  </head>
  <body>
    <link rel="stylesheet" href="style.css" />

    <div id="graph"></div>
    <div id="contentGraph"></div>
    <div id="contentData"></div>

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js "></script>

    <script type="text/javascript" src="resultGraph.js"></script>
    <script type="text/javascript" src="../data/elementType.js"></script>
    <script type="text/javascript" src="../data/nodeType.js"></script>
    <script type="text/javascript" src="../data/edgeType.js"></script>

    <script>
      // Get data from php
      let graphJson = '<?=$_POST['graph']?>'; // That's for a string
      let dataJson = '<?=str_replace("'","\'",$_POST['data']);?>'; // That's for a string

      // Display graph
      let graph = new QueryGraph.ResultGraph.ResultGraph(graphJson, dataJson);
      graph.draw();
    </script>

  </body>
</html>
