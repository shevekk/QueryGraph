/**
 * Class for menage a node 
 * @param {Number}                  id                  Id of the node
 */
QueryGraph.Node = function(id)
{
  QueryGraph.Element.call(this);

  this.id = id;
  this.type = QueryGraph.Node.Type.ELEMENT;

  this.elementInfos = new QueryGraph.Node.ElementInfos();
  this.elementInfos.name = "Noeud" + this.id;
  this.dataInfos = new QueryGraph.Node.DataInfos();

  this.edges = [];
  this.reverseEdges = [];
};
QueryGraph.Node.prototype = Object.create(QueryGraph.Element.prototype);

/**
 * @property {QueryGraph.Node.ElementInfos}        elementInfos          Information of elements node
 * @property {QueryGraph.Node.DataInfos}           dataInfos             Information of data node
 * @property {QueryGraph.Edge[]}                   edges                 Edges of the node
 * @property {QueryGraph.Edge[]}                   reverseEdges          Reverses edges of the node
 */

QueryGraph.Node.prototype.elementInfos;
QueryGraph.Node.prototype.dataInfos;

QueryGraph.Node.prototype.edges;
QueryGraph.Node.prototype.reverseEdges;

/*
 * Types of nodes
 */
QueryGraph.Node.Type = {
  DATA : "Data",
  ELEMENT : "Element",
  FILTER : "Filter"
};

/*
 * Information of elements node
 */
QueryGraph.Node.ElementInfos = function ()
{
  this.label = ""; 
  this.uri = ""; 
  this.name = "";
  this.subclass = false;
};

/*
 * Information of data node
 */
QueryGraph.Node.DataInfos = function ()
{
  this.label = ""; 
  this.uri = ""; 
};

/**
 * Create the visnetwork node content
 * @param {String}               x                The X node position
 * @param {String}               y                The Y node position
 */
QueryGraph.Node.prototype.createVisNode = function(x, y)
{
  let node = {
    id: this.id,
    label: this.elementInfos.name,
    size : 10,
    shape: "dot",
    x : x,
    y : y,
    color: {
      border: "#000000",
    }
  };

  return node;
};

/**
 * Set the type of the node and init design from type
 * @param {QueryGraph.Node.Type}                  type                   New type of the node
 * @param {QueryGraph.Graph}                      graph                  The graphe manager
 */
QueryGraph.Node.prototype.setType = function(type, graph)
{
  this.type = type;

  // set design
  if(this.type == QueryGraph.Node.Type.DATA)
  {
    graph.visNodes.update({id: this.id, color: { background : "#e99290", border : "#ba4e4b" }, shape: "dot", size: 15, shape: "diamond", borderWidth: 2, font: { strokeWidth: 2, strokeColor: "#e99290" }});
  }
  else if(this.type == QueryGraph.Node.Type.ELEMENT)
  {
    graph.visNodes.update({id: this.id, color: { background : "#a9d1db", border : "#418597" }, size: 11, shape: "dot", borderWidth: 2, font: { strokeWidth: 2, strokeColor: "#a9d1db" }});
  }
  else if(this.type == QueryGraph.Node.Type.FILTER)
  {
    graph.visNodes.update({id: this.id, color: { background : "#0000FF" }});
  }
};

/**
 * Set elements informations
 * @param {String}                      label                  Label of element in triplestore
 * @param {String}                      uri                    URI of element in triplestore
 * @param {String}                      name                   Name of element in triplestore
 * @param {Boolean}                     subclass               True for get subclass of the element
 * @param {QueryGraph.Graph}            graph                  The graphe manager
 */
QueryGraph.Node.prototype.setElementInfos = function(label, uri, name, subclass, graph)
{
  this.elementInfos.label = label;
  this.elementInfos.uri = uri;
  this.elementInfos.name = name;
  this.elementInfos.subclass = subclass;

  graph.visNodes.update({id: this.id, label: name});
};

/**
 * Set data informations
 * @param {String}                      label                  Label of element in triplestore
 * @param {String}                      uri                    URI of element in triplestore
 * @param {QueryGraph.Graph}            graph                  The graphe manager
 */
QueryGraph.Node.prototype.setDataInfos = function(label, uri, graph)
{
  this.dataInfos.label = label;
  this.dataInfos.uri = uri;

  graph.visNodes.update({id: this.id, label: label});
};

/**
 * Add a edge to this node
 * @param {QueryGraph.Edge}             edge                     The edge
 * @param {Boolean}                     reverse                  True if the edges id reverse (end node)
 */
QueryGraph.Node.prototype.addEdge = function(edge, reverse)
{
  if(reverse)
  {
    this.reverseEdges.push(edge);
  }
  else
  {
    this.edges.push(edge);
  }
};

/**
 * Check if edges and reverse edges are optional
 * @return                          True if edges are all optional
 */
QueryGraph.Node.prototype.edgesAreAllOptional = function()
{
  let optional = true;

  if(this.edges.length == 0 && this.reverseEdges.length == 0)
  {
    optional = false;
  }

  for(let i = 0; i < this.edges.length; i++)
  {
    if(!this.edges[i].optional)
    {
      optional = false;
    }
  }
  for(let i = 0; i < this.reverseEdges.length; i++)
  {
    if(!this.reverseEdges[i].optional)
    {
      optional = false;
    }
  }

  return optional;
};