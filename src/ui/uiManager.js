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
     * @property {QueryGraph.UI.UIElement}                 uiElement             Element draw in ui (QueryGraph.UI.UINode  or QueryGraph.UI.UIEdge)
     * @property {QueryGraph.Data.Graph}                     graph                 The graph manager
     * @property {JQuery Element}                       html                  JQuery element of the UI
     * @property {QueryGraph.Query.DataCollector}             dataCollector         The data collector
     */
    this.uiElement;
    this.graph;
    this.html = $("#ui");
    this.dataCollector;
  }

  /**
   * @property {String}             OK_BUTTON_HTML_ID                HTML ID for OK Button 
   */
  static OK_BUTTON_HTML_ID = "ok";


  /**
   * Init the UI Manager
   * @param {QueryGraph.Data.Graph}            graph                  The graphe manager
   */
  init(graph, dataCollector)
  {
    this.graph = graph;
    this.dataCollector = dataCollector;
  }

  /**
   * Update UI info with node informations
   * @param {QueryGraph.Data.Node}                     node                 The selected node
   */
  selectNode(node)
  {
    let me = this;

    me.uiElement = new QueryGraph.UI.UINode ();
    me.uiElement.init(me.html, node, me.dataCollector);

    $("#"+QueryGraph.UI.UIManager.OK_BUTTON_HTML_ID).click(function() 
    {
      me.save();
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
      me.save();
    });
  }

  /**
   * Save UI informations
   */
  save()
  {
    let me = this;

    if(me.uiElement instanceof QueryGraph.UI.UINode )
    {
      me.uiElement.setNodeInformations(me.graph);
    }
    else if(me.uiElement instanceof QueryGraph.UI.UIEdge)
    {
      me.uiElement.setEdgeInformations(me.graph);
    }
  }

  /**
   * Update UI with no selection (clear content)
   */
  unSelect()
  {
    this.html.html("");

    this.uiElement = null;
  }
}