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
      me.execQuery(false);
    });

    $("#"+QueryGraph.Main.EXEC_QUERY_GRAPH_HTML_ID).click(function() 
    {
      me.execQuery(true);
    });
  });
};

/**
 * Exec a query
 * @param {Boolean}                  isGraph                    True if is a graph representation
 */
QueryGraph.Main.prototype.execQuery = function(isGraph)
{
  let me = this;

  if(QueryGraph.CheckDataValidity.Check(me.graph))
  {
    me.resultView.queryProgress();

    me.queryManager.exec(me.graph, function(data, selectVars, errorReponseText)
    {
      if(data != null)
      {
        if(isGraph)
        {
          me.resultView.sendDataToGraph(me.graph, data, selectVars);
          me.resultView.displayResults(data, selectVars);
        }
        else
        {
          me.resultView.displayResults(data, selectVars);
        }
      }
      else
      {
        me.resultView.queryFail(errorReponseText);
      }
    });
  }
};

/**
 * @property {String}             EXEC_QUERY_HTML_ID                HTML ID for button to execute a query
 * @property {String}             EXEC_QUERY_GRAPH_HTML_ID          HTML ID for button to execute a query with graph representation
 */
QueryGraph.Main.EXEC_QUERY_HTML_ID = "execQuery";
QueryGraph.Main.EXEC_QUERY_GRAPH_HTML_ID = "execQueryGraph";

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
