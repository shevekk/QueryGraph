/**
 * Class for ui manager
 */
QueryGraph.UIManager = function()
{
  this.html = $("#ui");
};

/**
 * @property {QueryGraph.UIElement}                 uiElement             Element draw in ui (QueryGraph.UINode or QueryGraph.UIEdge)
 * @property {QueryGraph.Graph}                     graph                 The graph manager
 * @property {JQuery Element}                       html                  JQuery element of the UI
 * @property {QueryGraph.DataCollector}             dataCollector         The data collector
 */
QueryGraph.UIManager.prototype.uiElement;
QueryGraph.UIManager.prototype.graph;
QueryGraph.UIManager.prototype.html;
QueryGraph.UIManager.prototype.dataCollector;

/**
 * @property {String}             OK_BUTTON_HTML_ID                HTML ID for OK Button 
 */
QueryGraph.UIManager.OK_BUTTON_HTML_ID = "ok";

/**
 * Init the UI Manager
 * @param {QueryGraph.Graph}            graph                  The graphe manager
 */
QueryGraph.UIManager.prototype.init = function(graph, dataCollector)
{
  this.graph = graph;
  this.dataCollector = dataCollector;
};

/**
 * Update UI info with node informations
 * @param {QueryGraph.Node}                     node                 The selected node
 */
QueryGraph.UIManager.prototype.selectNode = function(node)
{
  let me = this;

  me.uiElement = new QueryGraph.UINode();
  me.uiElement.init(me.html, node, me.dataCollector);

  $("#"+QueryGraph.UIManager.OK_BUTTON_HTML_ID).click(function() 
  {
    me.save();
  });
};

/**
 * Update UI info with edge informations
 * @param {QueryGraph.Edge}                     edge                 The selected edge
 */
QueryGraph.UIManager.prototype.selectEdge = function(edge)
{
  let me = this;

  me.uiElement = new QueryGraph.UIEdge();
  me.uiElement.init(me.html, edge, me.dataCollector);

  $("#"+QueryGraph.UIManager.OK_BUTTON_HTML_ID).click(function() 
  {
    me.save();
  });
};

/**
 * Save UI informations
 */
QueryGraph.UIManager.prototype.save = function()
{
  let me = this;

  if(me.uiElement instanceof QueryGraph.UINode)
  {
    me.uiElement.setNodeInformations(me.graph);
  }
  else if(me.uiElement instanceof QueryGraph.UIEdge)
  {
    me.uiElement.setEdgeInformations(me.graph);
  }
};

/**
 * Update UI with no selection (clear content)
 */
QueryGraph.UIManager.prototype.unSelect = function()
{
  this.html.html("");

  this.uiElement = null;
};