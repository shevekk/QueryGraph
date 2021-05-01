if (typeof QueryGraph.UI == 'undefined') {
  QueryGraph.UI = {};
}

/**
 * Class for ui manager
 */
QueryGraph.UI.UIManager = class UIManager
{
  constructor() 
  {
    /**
     * @property {QueryGraph.UI.UIElement}                   uiElement             Element draw in ui (QueryGraph.UI.UINode  or QueryGraph.UI.UIEdge)
     * @property {QueryGraph.UI.UIParams}                    uiParams              ui containing parameters of the query
     * @property {QueryGraph.Data.Graph}                     graph                 The graph manager
     * @property {JQuery Element}                            html                  JQuery element of the UI
     * @property {QueryGraph.Query.DataCollector}            dataCollector         The data collector
     */
    this.uiElement;
    this.uiParams = new QueryGraph.UI.UIParams();
    this.graph;
    this.html = $("#ui");
    this.dataCollector;
    this.queryManager;
  }

  /**
   * @property {String}             OK_BUTTON_HTML_ID                HTML ID for OK Button 
   * @property {String}             DISPLAY_ZONE_HTML_ID             HTML ID of DIV for a display zone
   */
  static OK_BUTTON_HTML_ID = "ok";
  static DISPLAY_ZONE_HTML_ID = "uiDisplayZone";


  /**
   * Init the UI Manager
   * @param {QueryGraph.Data.Graph}            graph                  The graphe manager
   */
  init(graph, dataCollector)
  {
    this.graph = graph;
    this.dataCollector = dataCollector;

    this.uiParams.init(this.html, graph);
  }

  /**
   * Update UI info with node informations
   * @param {QueryGraph.Data.Node}                     node                 The selected node
   */
  selectNode(node)
  {
    let me = this;

    me.uiElement = new QueryGraph.UI.UINode();
    me.uiElement.init(me.html, node, me.dataCollector);

    $("#"+QueryGraph.UI.UIManager.OK_BUTTON_HTML_ID).click(function() 
    {
      me.save(false);
    });
  }

  /**
   * Update UI info with edge informations
   * @param {QueryGraph.Data.Edge}                     edge                 The selected edge
   */
  selectEdge(edge)
  {
    let me = this;

    me.uiElement = new QueryGraph.UI.UIEdge();
    me.uiElement.init(me.html, edge, me.dataCollector);

    $("#"+QueryGraph.UI.UIManager.OK_BUTTON_HTML_ID).click(function() 
    {
      me.save(false);
    });
  }

  /**
   * Save UI informations
   * @param {Boolean}                     launchQuery                 True if is call before launchQuery
   */
  save(launchQuery)
  {
    let me = this;

    if(me.uiElement instanceof QueryGraph.UI.UINode)
    {
      me.uiElement.setNodeInformations(me.graph);
    }
    else if(me.uiElement instanceof QueryGraph.UI.UIEdge)
    {
      me.uiElement.setEdgeInformations(me.graph);
    }
    
    if(me.uiParams.enable)
    {
      me.uiParams.save(me.graph.params);
      me.uiParams.enable = false;
    }
  }

  /**
   * Update UI with no selection (clear content)
   */
  unSelect()
  {
    let me = this;

    this.html.html("");

    this.uiElement = null;

    this.uiParams.init(me.html, me.graph);
  }
}