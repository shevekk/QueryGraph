/**
 * Class for menage display of the graph
 */
QueryGraph.Graph = function()
{
  this.nodes = [];
  this.edges = [];
};

/**
 * @property {QueryGraph.Node[]}                  nodes                        Array of nodes 
 * @property {QueryGraph.Edge[]}                  edges                        Array of edges
 * @property {vis.DataSet}                        visNodes                     VisNetwork nodes datas 
 * @property {vis.DataSet}                        visEdges                     VisNetwork nodes edges 
 * @property {vis.Network}                        network                      The vis network
 * @property {Number}                             selectedNode                 Id of the selected node
 * @property {Number}                             selectedEdge                 Id of the selected edge
 * @property {QueryGraph.Graph.Action}            action                       Actual selected action
 * @property {QueryGraph.UIManager}               uiManager                    UI Manager
 */
QueryGraph.Graph.prototype.nodes;
QueryGraph.Graph.prototype.edges;

QueryGraph.Graph.prototype.visNodes;
QueryGraph.Graph.prototype.visEdges;

QueryGraph.Graph.prototype.network;

QueryGraph.Graph.prototype.selectedNode;
QueryGraph.Graph.prototype.selectedEdge;

QueryGraph.Graph.prototype.action;

QueryGraph.Graph.prototype.uiManager;

/**
 * @property {String}                  addNode                    Action of add a node
 * @property {String}                  addEdge                    Action of add a edge
 */
QueryGraph.Graph.Action = {
  ADD_NODE : "addNode",
  ADD_EDGE : "addEdge"
};

/**
 * Init the graph
 * @param {QueryGraph.UIManager}                  uiManager                    UI Manager
 */
QueryGraph.Graph.prototype.init = function(uiManager)
{
  let me = this;

  me.uiManager = uiManager;

  let container = document.getElementById('graph');

  this.visNodes = new vis.DataSet([]);
  this.visEdges = new vis.DataSet([]);

  let data = {
    nodes: this.visNodes,
    edges: this.visEdges
  };
  let options = {
    physics : {
      enabled: true,
      solver: 'barnesHut',
      barnesHut : {
        gravitationalConstant : -2500,
        centralGravity : 0.25,
        springLength : 95,
        springConstant : 0.005
      }
    }
  };
  
  this.network = new vis.Network(container, data, options);

  me.menageTopBouttonEvent();
  me.menageGraphEvents();
};

/* 
 * Menage actions of buttons 
 */
QueryGraph.Graph.prototype.menageTopBouttonEvent = function()
{
  let me = this;

  /* Action of add a node */
  $("#addNode").click(function() 
  {
    $("#graph").css("cursor", "crosshair");

    me.action = QueryGraph.Graph.Action.ADD_NODE;
  });

  /* Action of add a edge */
  $("#addEdge").click(function() 
  {
    $("#graph").css("cursor", "crosshair");

    me.action = QueryGraph.Graph.Action.ADD_EDGE;
  });

  /* Action of delete the selection */
  $("#delete").click(function() 
  {
    if(me.selectedNode)
    {
      me.deleteNode(me.selectedNode.id);

      me.selectedNode = null;
      me.uiManager.unSelect();
    }
    else if(me.selectedEdge)
    {
      me.deleteEdge(me.selectedEdge.id);

      me.selectedEdge = null;
      me.uiManager.unSelect();
    }
    else
    {
      alert("Action impossible : aucun élément sélectionné");
    }
  });

  /* Action of delete the selection */
  $("#revertEdge").click(function() 
  {
    if(me.selectedEdge)
    {
      me.selectedEdge.reverse(me);
    }
    else
    {
      alert("Action impossible : aucun lien sélectionné");
    }
  });

  /* Cancel the current action */
  $("#cancelAction").click(function() 
  {
    $("#graph").css("cursor", "auto");

    me.action = null;
  });
};

/*  
 * Menage event in the graph
 */
QueryGraph.Graph.prototype.menageGraphEvents = function()
{
  let me = this;

  this.network.on("click", function(data)
  {
    me.uiManager.save();

    // Action of add edge
    if(me.action == QueryGraph.Graph.Action.ADD_EDGE)
    {
      if(data.nodes.length > 0)
      {
        if(me.selectedNode != null)
        {
          let endNode = me.getNode(data.nodes[0]);

          if(endNode.id == me.selectedNode.id)
          {
            alert("Impossible de liée un noeud à lui-même");
          }
          else
          {
            me.addEdge(me.selectedNode.id, data.nodes[0], me.selectedNode, endNode);
          }
          
          me.action = null;

          $("#graph").css("cursor", "auto");        
        }
      }
      else
      {
        alert("Création de lien : Veuillez sélectionner un noeud");
      }
    }
    // Action of add node
    if(me.action == QueryGraph.Graph.Action.ADD_NODE)
    {
      me.addNode(data.pointer.canvas.x, data.pointer.canvas.y);

      $("#graph").css("cursor", "auto");

      me.action = null;
    }

    if(data.nodes.length > 0)
    {
      // Select node
      me.selectedNode = me.getNode(data.nodes[0]);

      me.uiManager.selectNode(me.selectedNode);

      me.selectedEdge = null;
    }
    else if(data.edges.length > 0)
    {
      // Select edge
      me.selectedEdge = me.getEdges(data.edges[0]);

      me.uiManager.selectEdge(me.selectedEdge);

      me.selectedNode = null;
    }
    else
    {
      // Unselect all
      me.selectedNode = null;
      me.selectedEdge = null;

      me.uiManager.unSelect();
    }

  });
};

/**
 * Add a new node
 * @param {String}               x                The X node position
 * @param {String}               y                The Y node position
 */
QueryGraph.Graph.prototype.addNode = function(x, y)
{
  // Get free id
  let id = 1;
  if(this.nodes.length > 0)
  {
    id = this.nodes[this.nodes.length - 1].id + 1;
  }
  
  // Create the node
  let newNode = new QueryGraph.Node(id);

  this.visNodes.add([newNode.createVisNode(x, y)]);

  newNode.setType(QueryGraph.Node.Type.ELEMENT, this);

  this.nodes.push(newNode);
};

/**
 * Add a new edge
 * @param {Number}                  idNodeStart          Id of the start node
 * @param {Number}                  idNodeEnd            Id of the end node
 * @param {QueryGraph.Node}         nodeStart            Start node
 * @param {QueryGraph.Node}         nodeEnd              End node
 */
QueryGraph.Graph.prototype.addEdge = function(idNodeStart, idNodeEnd, nodeStart, nodeEnd, id)
{
  let newEdge = new QueryGraph.Edge(idNodeStart, idNodeEnd, nodeStart, nodeEnd);

  if(id)
  {
    newEdge.id = id;
  }
  else
  {
    newEdge.initId(this);
  }

  this.visEdges.add([newEdge.createVisEdge()]);

  this.edges.push(newEdge);

  let startNode = this.getNode(idNodeStart);
  startNode.addEdge(newEdge, false);

  let endNode = this.getNode(idNodeEnd);
  endNode.addEdge(newEdge, true);

  newEdge.setType(QueryGraph.Edge.Type.VARIABLE, this);
};

/**
 * Get a node from id
 * @param {Number}               id          Id of the node
 * @return {QueryGraph.Node}                 The node
 */
QueryGraph.Graph.prototype.getNode = function(id)
{
  let node = null;

  for(let i = 0; i < this.nodes.length; i++)
  {
    if(id == this.nodes[i].id)
    {
      node = this.nodes[i];
    }
  }

  return node;
};

/**
 * Get a edge from id
 * @param {Number}               id          Id of the edge
 * @return {QueryGraph.Edge}                 The edge
 */
QueryGraph.Graph.prototype.getEdges = function(id)
{
  let edge = null;

  for(let i = 0; i < this.edges.length; i++)
  {
    if(id == this.edges[i].id)
    {
      edge = this.edges[i];
    }
  }

  return edge;
};

/**
 * Delete a node
 * @param {Number}            nodeId          Id of the node
 */
QueryGraph.Graph.prototype.deleteNode = function(nodeId)
{
  let me = this;

  for(let i = 0; i < me.nodes.length; i++)
  {
    if(me.nodes[i].id == nodeId)
    {
      // Delete linked edges
      for(let j = 0; j < me.nodes[i].edges.length; j++)
      {
        me.deleteEdge(me.nodes[i].edges[j].id);
        j--;
      }
      for(let j = 0; j < me.nodes[i].reverseEdges.length; j++)
      {
        me.deleteEdge(me.nodes[i].reverseEdges[j].id);
        j--;
      }

      // delete node
      me.visNodes.remove(nodeId);
      me.nodes.splice(i,1);
    }
  }
};

/**
 * Delete a edge
 * @param {Number}            edgeId          Id of the edge
 */
QueryGraph.Graph.prototype.deleteEdge = function(edgeId)
{
  let me = this;

  // Remove edge
  me.visEdges.remove(edgeId);
  for(let i = 0; i < me.edges.length; i++)
  {
    if(me.edges[i].id == edgeId)
    {
      me.edges.splice(i,1);
    }
  }

  // Remove edge in the nodes data
  for(let i = 0; i < me.nodes.length; i++)
  {
    for(let j = 0; j < me.nodes[i].edges.length; j++)
    {
      if(me.nodes[i].edges[j].id == edgeId)
      {
        me.nodes[i].edges.splice(j,1);
        j--;
      }
    }

    for(let j = 0; j < me.nodes[i].reverseEdges.length; j++)
    {
      if(me.nodes[i].reverseEdges[j].id == edgeId)
      {
        me.nodes[i].reverseEdges.splice(j,1);
        j--;
      }
    }
  }
};

/**
 * Export the graph to a json object
 * @return {String}                      Json string export
 */
QueryGraph.Graph.prototype.toJson = function()
{
  var me = this;
  
  var data = {};
  data["nodes"] = [];
  data["edges"] = [];

  for(let i = 0; i < me.nodes.length; i++)
  {
    data["nodes"].push({});
    data["nodes"][i]["type"] = me.nodes[i].type;
    data["nodes"][i]["id"] = me.nodes[i].id;
    data["nodes"][i]["elementInfos"] = me.nodes[i].elementInfos;
    data["nodes"][i]["dataInfos"] = me.nodes[i].dataInfos;
  }
  for(let i = 0; i < me.edges.length; i++)
  {
    data["edges"].push({});
    data["edges"][i]["id"] = me.edges[i].id;
    data["edges"][i]["idNodeStart"] = me.edges[i].idNodeStart;
    data["edges"][i]["idNodeEnd"] = me.edges[i].idNodeEnd;
    data["edges"][i]["type"] = me.edges[i].type;
    data["edges"][i]["label"] = me.edges[i].label;
    data["edges"][i]["uri"] = me.edges[i].uri;
    data["edges"][i]["name"] = me.edges[i].name;
    data["edges"][i]["optional"] = me.edges[i].optional;
  }

  return JSON.stringify(data);
}

/**
 * Import graph data from a saved query
 * @param {Object}            data          Graph data export object
 */
QueryGraph.Graph.prototype.fromJson = function(data)
{
  var me = this;
  // 
  me.clearGraph();

  for(let i = 0; i < data["nodes"].length; i++)
  {
    me.addNode(0, 0);

    me.nodes[i].id = data["nodes"][i]["id"];
    me.nodes[i].setType(data["nodes"][i]["type"], me);
    me.nodes[i].elementInfos = data["nodes"][i]["elementInfos"];
    me.nodes[i].dataInfos = data["nodes"][i]["dataInfos"];

    if(me.nodes[i].type == QueryGraph.Node.Type.ELEMENT)
    {
      me.visNodes.update({id: me.nodes[i].id, label: me.nodes[i].elementInfos.name});
    }
    else if(me.nodes[i].type == QueryGraph.Node.Type.DATA)
    {
      me.visNodes.update({id: me.nodes[i].id, label: me.nodes[i].dataInfos.label});
    }
  }
  for(let i = 0; i < data["edges"].length; i++)
  {
    let idNodeStart = data["edges"][i]["idNodeStart"];
    let idNodeEnd = data["edges"][i]["idNodeEnd"];
    let nodeStart = me.getNode(idNodeStart);
    let nodeEnd = me.getNode(idNodeEnd);

    me.addEdge(idNodeStart, idNodeEnd, nodeStart, nodeEnd, data["edges"][i]["id"]);

    //me.edges[i].id = data["edges"][i]["id"];
    me.edges[i].setType(data["edges"][i]["type"], me);
    me.edges[i].setInformations(data["edges"][i]["label"], data["edges"][i]["uri"], data["edges"][i]["name"], data["edges"][i]["optional"], me);
  }
}

/**
 * Clear graph nodes and edges
 */
QueryGraph.Graph.prototype.clearGraph = function()
{
  var me = this;

  for(var i = 0; i < me.nodes.length; i++)
  {
    me.visNodes.remove(me.nodes[i].id);
  }
  for(var i = 0; i < me.edges.length; i++)
  {
    me.visEdges.remove(me.edges[i].id);
  }

  me.nodes = [];
  me.edges = [];
}