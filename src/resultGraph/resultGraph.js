if (typeof QueryGraph == 'undefined') {
  QueryGraph = {};
}

if (typeof QueryGraph.ResultGraph == 'undefined') {
  QueryGraph.ResultGraph = {};
}

/**
 * Class for display graph from query result data
 * @param {Object}                     graphJson                    Graph informations
 * @param {Object[]}                   dataJson                     Data result information
 */
QueryGraph.ResultGraph.ResultGraph = function(graphJson, dataJson)
{
  this.baseGraph = JSON.parse(graphJson);
  this.data = JSON.parse(dataJson);
};

/**
 * @property {vis.DataSet}                        visNodes                     VisNetwork nodes datas 
 * @property {vis.DataSet}                        visEdges                     VisNetwork nodes edges 
 * @property {vis.Network}                        network                      The vis network
 * @property {Object}                             baseGraph                    Graph informations
 * @property {Object[]}                           data                         Data result information
 */
QueryGraph.ResultGraph.ResultGraph.prototype.visNodes;
QueryGraph.ResultGraph.ResultGraph.prototype.visEdges;
QueryGraph.ResultGraph.ResultGraph.prototype.network;
QueryGraph.ResultGraph.ResultGraph.prototype.baseGraph;
QueryGraph.ResultGraph.ResultGraph.prototype.data;

/**
 * Create a graph from data
 */
QueryGraph.ResultGraph.ResultGraph.prototype.draw = function()
{
  var me = this;

  if(me.data.length >= 500)
  {
    alert("La création du graphe va être longue car il y a " + me.data.length + " ligne de résultats.");
  }

  me.visNodes = new vis.DataSet([]);
  me.visEdges = new vis.DataSet([]);

  // Create nodes
  var nodeNumber = 0;
  for(let i = 0; i < this.baseGraph.nodes.length; i++)
  {
    if(this.baseGraph.nodes[i].type == QueryGraph.Node.Type.DATA)
    {
      nodeNumber ++;
      me.addNode(nodeNumber, this.baseGraph.nodes[i].type, this.baseGraph.nodes[i].label, this.baseGraph.nodes[i].id, -1);
    }
    else if(this.baseGraph.nodes[i].type == QueryGraph.Node.Type.ELEMENT)    
    {
      for(let j = 0; j < this.data.length; j++)
      {
        if(this.data[j].var == this.baseGraph.nodes[i].name)
        {
          nodeNumber ++;

          var label = this.data[j].value;
          if(this.data[j].label != "")
          {
            label = this.data[j].label;
          }

          me.addNode(nodeNumber, this.baseGraph.nodes[i].type, label, this.baseGraph.nodes[i].id, this.data[j].lineNumber, this.data[j].value);
        }
      }
    }
  }

  // Create edges
  for(let i = 0; i < this.baseGraph.edges.length; i++)
  {
    /*
    if(this.baseGraph.edges[i].typeNodeStart == QueryGraph.Node.Type.ELEMENT && this.baseGraph.edges[i].typeNodeEnd == QueryGraph.Node.Type.ELEMENT)
    {
      me.edgesCreationBetweenNodesElements(this.baseGraph.edges[i], );
    }
    else
    {
      me.edgesCreation(this.baseGraph.edges[i]);
    }
    */
    me.edgesCreation(this.baseGraph.edges[i]);
  }

  // Init graph 
  let container = document.getElementById('graph');
  let data = {
    nodes: me.visNodes,
    edges: me.visEdges
  };
  let options = {
    physics : {
      enabled: true,
      stabilization: false,
      barnesHut : {}
    },
    edges:
    {
      label : "test"
    }
  };

  me.network = new vis.Network(container, data, options);

  // Reinit labels
  var ids = me.visEdges.getIds();
  for(let i = 0; i < ids.length; i++)
  {
    me.visEdges.update({id: ids[i], label: me.visEdges.get(ids[i]).label});
  }
};

QueryGraph.ResultGraph.ResultGraph.prototype.edgesCreation = function(baseGraphEdge)
{
  var me = this;

  let startNodes = me.visNodes.get({
    filter: function (item) {
      return item.baseId == baseGraphEdge.idNodeStart;
    }
  });

  for(let i = 0; i < startNodes.length; i++)
  {
    let endNodesIds = [];
    for(let j = 0; j < startNodes[i].lineNumbers.length; j++)
    {
      let endNodes = me.visNodes.get({
        filter: function (item) {
          return (item.uri != startNodes[i].uri && item.lineNumbers.includes(startNodes[i].lineNumbers[j]) || item.lineNumbers != -1 || startNodes[i].lineNumbers != -1) && item.baseId == baseGraphEdge.idNodeEnd;
        }
      });

      for(let k = 0; k < endNodes.length; k++)
      {
        if(!endNodesIds.includes(endNodes[k].id))
        {
          var label = me.getEdgeLabel(baseGraphEdge, startNodes[i], endNodes[k]);

          if(label)
          {
            endNodesIds.push(endNodes[k].id);
            me.addEdge(startNodes[i].id, endNodes[k].id, baseGraphEdge.type, label);
          }
        }
      }
    }
  }
};


/**
 * Create edges between two nodes elements : Create edges for element in same data line
 * @param {Object}                     baseGraphEdge                    Edge graph object
 */
 /*
QueryGraph.ResultGraph.ResultGraph.prototype.edgesCreationBetweenNodesElements = function(baseGraphEdge)
{ 
  var me = this;

  let startNodes = me.visNodes.get({
    filter: function (item) {
      return item.baseId == baseGraphEdge.idNodeStart;
    }
  });

  for(let i = 0; i < startNodes.length; i++)
  {
    let endNodesIds = [];
    for(let j = 0; j < startNodes[i].lineNumbers.length; j++)
    {
      let endNodes = me.visNodes.get({
        filter: function (item) {
          return item.uri != startNodes[i].uri && item.lineNumbers.includes(startNodes[i].lineNumbers[j]);
        }
      });

      for(let k = 0; k < endNodes.length; k++)
      {
        if(!endNodesIds.includes(endNodes[k].id))
        {
          endNodesIds.push(endNodes[k].id);
          me.addEdge(startNodes[i].id, endNodes[k].id, baseGraphEdge.type, me.getEdgeLabel(baseGraphEdge, startNodes[i], endNodes[k]));
        }
      }
    }
  }
};
*/
/**
 * Create edges between for a data node and an element node : Create edge between all data
 * @param {Object}                     baseGraphEdge                    Edge graph object
 */
 /*
QueryGraph.ResultGraph.ResultGraph.prototype.edgesCreation = function(baseGraphEdge)
{ 
  var me = this;

  let startNodes = this.visNodes.get({
    filter: function (item) {
      return item.baseId == baseGraphEdge.idNodeStart;
    }
  });

  let endNodes = this.visNodes.get({
    filter: function (item) {
      return item.baseId == baseGraphEdge.idNodeEnd;
    }
  });

  for(let i = 0; i < startNodes.length; i++)
  {
    for(let j = 0; j < endNodes.length; j++)
    {
      if(baseGraphEdge.optional)
      {

      }
      me.addEdge(startNodes[i].id, endNodes[j].id, baseGraphEdge.type, me.getEdgeLabel(baseGraphEdge, startNodes[i], endNodes[j]));
    }
  }
};
*/
/**
 * Get the edges label, if variable get the data line value
 * @param {Object}                     baseGraphEdge                    Edge graph object
 * @param {Object}                     startNode                        VisNode Object
 * @param {Object}                     endNode                          VisNode Object
 */
QueryGraph.ResultGraph.ResultGraph.prototype.getEdgeLabel = function(baseGraphEdge, startNode, endNode)
{
  var me = this;

 let label = "";

  if(baseGraphEdge.type == QueryGraph.Edge.Type.VARIABLE)
  {
    let numLine = -1;
    if(startNode.type == QueryGraph.Node.Type.ELEMENT)
    {
      numLine = startNode.lineNumbers[0];
    }
    else if(endNode.type == QueryGraph.Node.Type.ELEMENT)
    {
      numLine = endNode.lineNumbers[0];
    }

    for(let j = 0; j < me.data.length; j++)
    {
      if(me.data[j].var == baseGraphEdge.name && me.data[j].lineNumber == numLine)
      {
        if(me.data[j].label)
        {
          label = me.data[j].label;
        }
        else
        {
          label = me.data[j].value;
        }
      }
    }
  }
  else if(baseGraphEdge.type == QueryGraph.Edge.Type.FIXED)
  {
    label = baseGraphEdge.label;
  }

  return label;
};

/**
 * Add a new node, if node with is URI already exist, update lines Numbers
 * @param {Number}                       id                      Number of the node
 * @param {QueryGraph.Node.Type}         type                    Type of the node 
 * @param {String}                       label                   Label of the node
 * @param {String}                       baseId                  Id of the base graph matching the node
 * @param {Number}                       lineNumber              The line number
 * @param {String}                       uri                     URI of the node
 */ 
QueryGraph.ResultGraph.ResultGraph.prototype.addNode = function(id, type, label, baseId, lineNumber, uri)
{
  var items = this.visNodes.get({
    filter: function (item) {
      return item.uri == uri;
    }
  });

  if(uri == null || items.length == 0)
  {
    let node = {
      id: id,
      label: label,
      size : 10,
      shape: "dot",
      baseId: baseId,
      uri: uri,
      type: type,
      lineNumbers: [lineNumber],
      color: {
        border: "#000000",
      }
    };
    this.visNodes.add(node);

    if(type == QueryGraph.Node.Type.DATA)
    {
      this.visNodes.update({id, color: { background : "#e99290", border : "#ba4e4b" }, shape: "dot", size: 15, shape: "diamond", borderWidth: 2, font: { strokeWidth: 2, strokeColor: "#e99290" }});
    }
    else if(type == QueryGraph.Node.Type.ELEMENT)
    {
      this.visNodes.update({id, color: { background : "#a9d1db", border : "#418597" }, size: 11, shape: "dot", borderWidth: 2, font: { strokeWidth: 2, strokeColor: "#a9d1db" }});
    }
  }
  else
  {
    let lineNumbers = items[0].lineNumbers;
    lineNumbers.push(lineNumber);

    id = items[0].id;

    this.visNodes.update({id, lineNumbers : lineNumbers});
  }
};

/**
 * Add a new edge between two nodes
 * @param {Number}                       idNodeStart               Id of the start node
 * @param {Number}                       idNodeEnd                 Id of the end node
 * @param {QueryGraph.Edge.Type}         type                      Type of the edge 
 * @param {String}                       label                     Label of the edge
 */ 
QueryGraph.ResultGraph.ResultGraph.prototype.addEdge = function(idNodeStart, idNodeEnd, type, label)
{ 
  let id = "";
  let number = 0;
  do
  {
    number ++;
    id = idNodeStart + "_" +  idNodeEnd + "_" + number;

    var edgeWithSameId = this.visEdges.get({
      filter: function (item) {
        return item.id == id;
      }
    });
  } while(edgeWithSameId.length > 0);

  let edge = {
    id: id,
    from: idNodeStart,
    to: idNodeEnd,
    arrows : "to",
    label: label,
    color: {
      color: "#ff0000"
    }
  };

  this.visEdges.add(edge);

  if(type == QueryGraph.Edge.Type.VARIABLE)
  {
    this.visEdges.update({id: id, color: { color : "#8499c9" }, dashes: [5, 5], width : 3, font: { strokeWidth: 2, strokeColor: "#acbde3" }});
  }
  else if(type == QueryGraph.Edge.Type.FIXED)
  {
    this.visEdges.update({id: id, color: { color : "#84c994" }, dashes: [1], width : 3, font: { strokeWidth: 2, strokeColor: "#b1e3bd" }});
  }
}