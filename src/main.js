if (typeof QueryGraph == 'undefined') {
  QueryGraph = {};
}

/**
 * Main class 
 */
QueryGraph.Main = function()
{
  let me = this;

  QueryGraph.Config.load("config.json", function()
  {
    me.uiManager = new QueryGraph.UIManager();
    me.graph = new QueryGraph.Graph();
    me.queryManager = new QueryGraph.QueryManager();
    me.resultView = new QueryGraph.ResultView();
    me.dataCollector = new QueryGraph.DataCollectorWikidata();

    me.uiManager.init(me.graph, me.dataCollector);
    me.graph.init(me.uiManager);

    $("#"+QueryGraph.Main.EXEC_QUERY_HTML_ID).click(function() 
    {
      if(QueryGraph.CheckDataValidity.Check(me.graph))
      {
        me.resultView.queryProgress();

        me.queryManager.exec(me.graph, function(data, selectVars, errorReponseText)
        {
          if(data != null)
          {
            me.resultView.init(data, selectVars);
          }
          else
          {
            me.resultView.queryFail(errorReponseText);
          }
        });
      }
    });
  });
}

/**
 * @property {String}             EXEC_QUERY_HTML_ID                HTML ID for button to execute a query
 */
QueryGraph.Main.EXEC_QUERY_HTML_ID = "execQuery";

/**
 * @property {QueryGraph.Graph}                  graph                  The graph manager
 * @property {QueryGraph.UIManager}              uiManager              UI Manager
 * @property {QueryGraph.QueryManager}           queryManager           The query manager
 * @property {QueryGraph.UIManager}              resultView             The result view
 * @property {QueryGraph.DataCollector}          dataCollector          The data collector
 */
QueryGraph.Main.prototype.graph;
QueryGraph.Main.prototype.uiManager;
QueryGraph.Main.prototype.queryManager;
QueryGraph.Main.prototype.resultView;
QueryGraph.Main.prototype.dataCollector;
