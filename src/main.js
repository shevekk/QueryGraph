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
    me.loadManager = new QueryGraph.Data.LoadManager();
    me.saveManager = new QueryGraph.Data.SaveManager();

    me.loadManager.init(me.graph);
    me.saveManager.init(me.graph, me.loadManager);
    me.uiManager.init(me.graph, me.dataCollector);
    me.graph.init(me.uiManager);

    $("#"+QueryGraph.UI.TopUI.EXEC_QUERY_BUTTON_HTML_ID).click(function() 
    {
      me.execQuery(false);
    });

    $("#"+QueryGraph.UI.TopUI.EXEC_QUERY_GRAPH_BUTTON_HTML_ID).click(function() 
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

  me.graph.uiManager.save();

  if(QueryGraph.CheckDataValidity.Check(me.graph))
  {
    me.resultView.queryProgress();

    me.queryManager.exec(me.graph, function(data, selectVars, errorReponseText)
    {
      if(data != null)
      {
        me.getEdgesLabels(data, selectVars, function(listEdgesLabel)
        {
          if(isGraph)
          {
            me.resultView.sendDataToGraph(me.graph, data, selectVars, listEdgesLabel);
            me.resultView.displayResults(data, selectVars, listEdgesLabel);
          }
          else
          {
            me.resultView.displayResults(data, selectVars, listEdgesLabel);
          }
        });
      }
      else
      {
        me.resultView.queryFail(errorReponseText);
      }
    });
  }
};

/**
 * Get edges labels from result datas
 * @param {Array}                     data                     Data result of the query
 * @param {Object[]}                  selectVars               List of selected query
 * @param {Function}                  callback                 The callback with the list of edges Label in param
 */
QueryGraph.Main.prototype.getEdgesLabels = function(data, selectVars, callback)
{
  let me = this;

  if(QueryGraph.Config.displayLabel)
  {
    let listEdgesURI = [];
    let listEdgesLabel = {};
    for(let j = 0; j < selectVars.length; j++)
    {
      if(selectVars[j].elementType == QueryGraph.Element.TYPE.EDGE)
      {
        for(let i = 0; i < data.results.bindings.length; i++)
        {
          if(data.results.bindings[i][selectVars[j].value])
          {
            listEdgesURI.push(data.results.bindings[i][selectVars[j].value]["value"]);
          }
        }
      }
    }
    me.dataCollector.getEdgesLabels(listEdgesURI, function(newEdgesValues, edgesLabels)
    {
      for(let i = 0; i < newEdgesValues.length; i++)
      {
        listEdgesLabel[newEdgesValues[i]] = edgesLabels[i];
      }

      callback(listEdgesLabel);
    });
  }
  else
  {
    callback([]);
  }
};

/**
 * @property {QueryGraph.Graph}                    graph                  The graph manager
 * @property {QueryGraph.UIManager}                uiManager              UI Manager
 * @property {QueryGraph.QueryManager}             queryManager           The query manager
 * @property {QueryGraph.UIManager}                resultView             The result view
 * @property {QueryGraph.DataCollector}            dataCollector          The data collector
 * @property {QueryGraph.Data.LoadManager}         loadManager            Data loading manager
 * @property {QueryGraph.Data.SaveManager}         saveManager            Data save manager
 */
QueryGraph.Main.prototype.graph;
QueryGraph.Main.prototype.uiManager;
QueryGraph.Main.prototype.queryManager;
QueryGraph.Main.prototype.resultView;
QueryGraph.Main.prototype.dataCollector;
QueryGraph.Main.prototype.loadManager;
QueryGraph.Main.prototype.saveManager;
