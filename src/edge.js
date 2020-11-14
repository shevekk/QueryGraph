/**
 * Class for menage a edge 
 * @param {Number}                  idNodeStart          Id of the start node
 * @param {Number}                  idNodeEnd            Id of the end node
 * @param {QueryGraph.Node}         nodeStart            Start node
 * @param {QueryGraph.Node}         nodeEnd              End node
 */
QueryGraph.Edge = function(idNodeStart, idNodeEnd, nodeStart, nodeEnd)
{
  QueryGraph.Element.call(this);

  this.idNodeStart = idNodeStart;
  this.idNodeEnd = idNodeEnd;

  this.nodeStart = nodeStart;
  this.nodeEnd = nodeEnd;

  this.type = QueryGraph.Edge.Type.VARIABLE;

  this.label = "";
  this.uri = "";
  this.name = "";
};
QueryGraph.Edge.prototype = Object.create(QueryGraph.Element.prototype);

/*
 * @property {Number}                              idNodeStart           Id of the start node
 * @property {Number}                              idNodeEnd             Id of the end node
 * @property {QueryGraph.Node}                     nodeStart             Start node
 * @property {QueryGraph.Node}                     nodeEnd               End node
 * @property {Number}                              label                 Label of the edge (for FIXED)
 * @property {Number}                              uri                   URI of the edge  (for FIXE)
 * @property {Number}                              name                  Name of the edge  (for VARIABLE)
 */
QueryGraph.Edge.prototype.idNodeStart;
QueryGraph.Edge.prototype.idNodeEnd;

QueryGraph.Edge.prototype.nodeStart;
QueryGraph.Edge.prototype.nodeEnd;

QueryGraph.Edge.prototype.label;
QueryGraph.Edge.prototype.uri;
QueryGraph.Edge.prototype.name;

/*
 * Types of nodes
 */
QueryGraph.Edge.Type = {
  VARIABLE : "Variable",
  FIXED : "Fixed"
};

/**
 * Initialise the id for first free Id in the same nodes
 * @param {QueryGraph.Graph}                      graph                  The graphe manager
 */
QueryGraph.Edge.prototype.initId = function(graph)
{
  let alrealyExist = false; 
  let num = 1;

  do 
  {
    this.id = this.idNodeStart + "_" + this.idNodeEnd + "_" + num;
    let edge = graph.getEdges(this.id);

    if(edge == null)
    {
      alrealyExist = false;
    }
    else
    {
      alrealyExist = true;
      num ++;
    }

  } while(alrealyExist);
  
  this.name = this.id;
};

/*
 * Create the visnetwork edge content
 */
QueryGraph.Edge.prototype.createVisEdge = function()
{
  let edge = {
    id: this.id,
    from: this.idNodeStart,
    to: this.idNodeEnd,
    arrows : "to",
    label: this.name,
    color: {
      color: "#ff0000"
    }
  };

  return edge;
};

/**
 * Set the type of the edge and init design from type
 * @param {QueryGraph.Edge.Type}                  type                   New type of the edge
 * @param {QueryGraph.Graph}                      graph                  The graphe manager
 */
QueryGraph.Edge.prototype.setType = function(type, graph)
{
  this.type = type;

  // set design
  if(this.type == QueryGraph.Edge.Type.VARIABLE)
  {
    graph.visEdges.update({id: this.id, color: { color : "#8499c9" }, dashes: [5, 5], width : 3, font: { strokeWidth: 2, strokeColor: "#acbde3" }});
  }
  else if(this.type == QueryGraph.Edge.Type.FIXED)
  {
    graph.visEdges.update({id: this.id, color: { color : "#84c994" }, dashes: [1], width : 3, font: { strokeWidth: 2, strokeColor: "#b1e3bd" }});
  }
};

/**
 * Set edge informations
 * @param {String}                      label                  Label of element in triplestore
 * @param {String}                      uri                    URI of element in triplestore
 * @param {String}                      name                   Name of element in triplestore
 * @param {QueryGraph.Graph}            graph                  The graphe manager
 */
QueryGraph.Edge.prototype.setInformations = function(label, uri, name, graph)
{
  if(label != "")
  {
    this.label = label;

    graph.visEdges.update({id: this.id, label: label});
  }

  if(uri != "")
  {
    this.uri = uri;
  }

  if(name != "")
  {
    this.name = name;

    graph.visEdges.update({id: this.id, label: name});
  }
};

/**
 * Reverse the direction of the edge
 * @param {QueryGraph.Graph}            graph                  The graphe manager
 */
QueryGraph.Edge.prototype.reverse = function(graph)
{
  let newIdStartNode = this.idNodeEnd;
  this.idNodeEnd = this.idNodeStart;
  this.idNodeStart = newIdStartNode;

  let newStartNode = this.nodeEnd;
  this.nodeEnd = this.nodeStart;
  this.nodeStart = newStartNode;

  graph.visEdges.update({id: this.id, from: this.idNodeStart, to: this.idNodeEnd});

  // Update edges in node
  
  for(let i = 0; i < graph.nodes.length; i++)
  {
    let changeForThisNode = false;
    for(let j = 0; j < graph.nodes[i].edges.length; j++)
    {
      if(graph.nodes[i].edges[j].id == this.id)
      {
        graph.nodes[i].reverseEdges.push(graph.nodes[i].edges[j]);
        graph.nodes[i].edges.splice(j, 1);
        changeForThisNode = true;
      }
    }

    if(!changeForThisNode)
    {
      for(let j = 0; j < graph.nodes[i].reverseEdges.length; j++)
      {
        if(graph.nodes[i].reverseEdges[j].id == this.id)
        {
          graph.nodes[i].edges.push(graph.nodes[i].reverseEdges[j]);
          graph.nodes[i].reverseEdges.splice(j, 1);
        }
      }
    }
  }
};