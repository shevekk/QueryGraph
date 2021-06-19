<!DOCTYPE html>
<html>
  <head>
    <title>QueryGraph - Chart</title>
    <link rel="icon" type="image/png" href="../img/icon.png" />
  </head>
  <body>
    <link rel="stylesheet" href="style.css" />

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.3.2/chart.min.js"></script>

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js "></script>

    <script type="text/javascript" src="chart.js"></script>
    <script type="text/javascript" src="../data/elementType.js"></script>
    <script type="text/javascript" src="../data/nodeType.js"></script>
    <script type="text/javascript" src="../data/edgeType.js"></script>

    <script type="text/javascript" src="../config/config.js"></script>

    <script type="text/javascript" src="../dictionary/dictionary.js"></script>
    
    <div id="selectDiv"></div> 

    <div id="nbResults"></div>
    <div id="chartDiv">
      <canvas id="chartCanvas"></canvas>
    </div>

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
          // Display chart
          let chart = new QueryGraph.Chart.Chart(graphJson, dataJson);
          chart.init();
        });
      });
    </script>
  </body>
</html>
