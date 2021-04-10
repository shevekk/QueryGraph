if (typeof QueryGraph == 'undefined') {
  QueryGraph = {};
}

/**
 * Main class 
 */
QueryGraph.Main = class Main 
{
  constructor() 
  {
    /**
     * @property {QueryGraph.Data.Graph}                 graph                  The graph manager
     * @property {QueryGraph.UI.UIManager}               uiManager              UI Manager
     * @property {QueryGraph.Query.QueryManager}         queryManager           The query manager
     * @property {QueryGraph.UI.UIManager}               resultView             The result view
     * @property {QueryGraph.Query.DataCollector}        dataCollector          The data collector
     * @property {QueryGraph.Data.LoadManager}           loadManager            Data loading manager
     * @property {QueryGraph.Data.SaveManager}           saveManager            Data save manager
     * @property {QueryGraph.UI.TopUI}                   topUi                  The Top UI Manager
     */
    this.graph;
    this.uiManager;
    this.queryManager;
    this.resultView;
    this.dataCollector;
    this.loadManager;
    this.saveManager;
  }

  /**
   * get params in the address bar
   * return {String[]}             Array of params get in address bar 
   */
  getParams()
  {
    // Get ars values of address bar
    var args = location.search.substr(1).split(/&/);
    var argsValues = [];

    for(var i =0; i < args.length; i++)
    {
      var tmp = args[i].split(/=/);
      if (tmp[0] != "") {
          argsValues[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp.slice(1).join("").replace("+", " "));
      }
    }

    return argsValues;
  }

  /**
   * Init Query Graph
   */
  init()
  {
    let me = this;

    // Get lang information
    let params = me.getParams();
    if(params["lang"] != undefined && (params["lang"] != "fr" || params["lang"] != "en"))
    {
      QueryGraph.Config.Config.setLang(params["lang"]);
    }

    // Get config parameter
    let config = QueryGraph.Config.Config.defaultConfigFileURL;
    if(params["config"] != undefined)
    {
      config = "config/" + params["config"] + ".json";
    }
    
    // Init
    QueryGraph.Config.Config.load(config, function()
    {
      QueryGraph.Dictionary.Dictionary.load(QueryGraph.Config.Config.lang, "", function()
      {
        QueryGraph.UI.TopIconsBar.init();

        me.topUi = new QueryGraph.UI.TopUI();
        me.topUi.init();

        me.uiManager = new QueryGraph.UI.UIManager();
        me.graph = new QueryGraph.Data.Graph();
        me.queryManager = new QueryGraph.Query.QueryManager();
        me.resultView = new QueryGraph.Query.ResultView();
        me.loadManager = new QueryGraph.Data.LoadManager();
        me.saveManager = new QueryGraph.Data.SaveManager();

        if(QueryGraph.Config.Config.main.tripleStore == QueryGraph.Config.TripleStoreType.WIKIDATA)
        {
          me.dataCollector = new QueryGraph.Query.DataCollectorWikidata();
        }
        else if(QueryGraph.Config.Config.main.tripleStore == QueryGraph.Config.TripleStoreType.DATA_BNF)
        {
          me.dataCollector = new QueryGraph.Query.DataCollectorBNF();
        }
        else if(QueryGraph.Config.Config.main.tripleStore == QueryGraph.Config.TripleStoreType.CIDOC_CRM)
        {
          me.dataCollector = new QueryGraph.Query.DataCollectorCidocCRM();
        }
        else
        {
          me.dataCollector = new QueryGraph.Query.DataCollector();
        }

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
    });
  }

  /**
   * Exec a query
   * @param {Boolean}                  isGraph                    True if is a graph representation
   */
  execQuery(isGraph)
  {
    let me = this;

    me.graph.uiManager.save(true);

    if(QueryGraph.Query.CheckDataValidity.check(me.graph))
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
              me.resultView.displayResults(me.graph, data, selectVars, listEdgesLabel);
            }
            else
            {
              me.resultView.displayResults(me.graph, data, selectVars, listEdgesLabel);
            }
          });
        }
        else
        {
          me.resultView.queryFail(errorReponseText);
        }
      });
    }
  }

  /**
   * Get edges labels from result datas
   * @param {Array}                     data                     Data result of the query
   * @param {Object[]}                  selectVars               List of selected query
   * @param {Function}                  callback                 The callback with the list of edges Label in param
   */
  getEdgesLabels = function(data, selectVars, callback)
  {
    let me = this;

    if(QueryGraph.Config.Config.main.tripleStore == QueryGraph.Config.TripleStoreType.WIKIDATA && QueryGraph.Config.Config.label.enable)
    {
      let listEdgesURI = [];
      let listEdgesLabel = {};
      for(let j = 0; j < selectVars.length; j++)
      {
        if(selectVars[j].elementType == QueryGraph.Data.ElementType.EDGE)
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
  }
}
