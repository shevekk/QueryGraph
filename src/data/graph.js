if (typeof QueryGraph.Data == 'undefined') {
  QueryGraph.Data = {};
}


/**
 * Class for menage display of the graph
 */
QueryGraph.Data.Graph = class Graph
{
  constructor()
  {
    /**
     * @property {QueryGraph.Data.Node[]}                  nodes                        Array of nodes 
     * @property {QueryGraph.Data.Edge[]}                  edges                        Array of edges
     * @property {vis.DataSet}                        visNodes                     VisNetwork nodes datas 
     * @property {vis.DataSet}                        visEdges                     VisNetwork nodes edges 
     * @property {vis.Network}                        network                      The vis network
     * @property {Number}                             selectedNode                 Id of the selected node
     * @property {Number}                             selectedEdge                 Id of the selected edge
     * @property {QueryGraph.Data.GraphAction}            action                       Actual selected action
     * @property {QueryGraph.UI.UIManager}               uiManager                    UI Manager
     */
    this.nodes = [];
    this.edges = [];

    this.visNodes;
    this.visEdges;

    this.network;

    this.selectedNode;
    this.selectedEdge;

    this.action;

    this.uiManager;
    this.params = new QueryGraph.Data.Params();
  }

  /**
   * Init the graph
   * @param {QueryGraph.UI.UIManager}                  uiManager                    UI Manager
   */
  init(uiManager)
  {
    let me = this;

    me.uiManager = uiManager;

    me.initNetwork();

    me.menageTopBouttonEvent();
  }

  /**
   * Init the network
   */
  initNetwork()
  {
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

    this.menageGraphEvents();

    this.params = new QueryGraph.Data.Params();
  }

  /* 
   * Menage actions of buttons 
   */
  menageTopBouttonEvent()
  {
    let me = this;

    /* Action of add a node */
    $("#"+QueryGraph.UI.TopUI.ADD_NODE_BUTTON_HTML_ID).click(function() 
    {
      QueryGraph.UI.TopUI.highlight(QueryGraph.UI.TopUI.ADD_NODE_BUTTON_HTML_ID, true);
      QueryGraph.UI.TopUI.highlight(QueryGraph.UI.TopUI.ADD_EDGE_BUTTON_HTML_ID, false);
      $("#graph").css("cursor", "crosshair");

      me.action = QueryGraph.Data.GraphAction.ADD_NODE;
    });

    /* Action of add a edge */
    $("#"+QueryGraph.UI.TopUI.ADD_EDGE_BUTTON_HTML_ID).click(function() 
    {
      QueryGraph.UI.TopUI.highlight(QueryGraph.UI.TopUI.ADD_NODE_BUTTON_HTML_ID, false);
      QueryGraph.UI.TopUI.highlight(QueryGraph.UI.TopUI.ADD_EDGE_BUTTON_HTML_ID, true);
      $("#graph").css("cursor", "crosshair");

      me.action = QueryGraph.Data.GraphAction.ADD_EDGE;
    });

    /* Action of delete the selection */
    $("#"+QueryGraph.UI.TopUI.DELETE_BUTTON_HTML_ID).click(function() 
    {
      if(me.selectedNode || me.selectedEdge)
      {
        me.deleteSelectedElements();
      }
      else
      {
        alert("Action impossible : aucun élément sélectionné");
      }
    });

    /* Action of reverse selected edge */
    $("#"+QueryGraph.UI.TopUI.REVERT_EDGE_BUTTON_HTML_ID).click(function() 
    {
      if(me.selectedEdge)
      {
        if(me.selectedEdge.nodeEnd.type != QueryGraph.Data.NodeType.FILTER)
        {
          me.selectedEdge.reverse(me);
        }
        else
        {
          alert("Action impossible : impossible d'inverser le sens pour les noeuds de type Filtre");
        }
      }
      else
      {
        alert("Action impossible : aucun lien sélectionné");
      }
    });

    /* Cancel the current action */
    $("#"+QueryGraph.UI.TopUI.CANCEL_ACTION_BUTTON_HTML_ID).click(function() 
    {
      QueryGraph.UI.TopUI.highlight(QueryGraph.UI.TopUI.ADD_NODE_BUTTON_HTML_ID, false);
      QueryGraph.UI.TopUI.highlight(QueryGraph.UI.TopUI.ADD_EDGE_BUTTON_HTML_ID, false);
      $("#graph").css("cursor", "auto");

      me.action = null;
    });

    /* Create a new Query */
    $("#"+QueryGraph.UI.TopUI.NEW_QUERY_ACTION_BUTTON_HTML_ID).click(function() 
    {
      if (confirm(QueryGraph.Dictionary.Dictionary.get("CONFIRM_NEW_QUERY")))
      {
        me.clearGraph();

        me.action = null;
      }
    });

    /* Action of delete the selection from key action */
    $(document).keydown(function( event ) 
    {
      if(event.key == "Delete")
      {
        me.deleteSelectedElements();
      }
    });
  }

  /*  
   * Menage event in the graph
   */
  menageGraphEvents()
  {
    let me = this;

    me.network.on("click", function(data)
    {
      me.uiManager.save(false);
      let edgeCreated = false;
      let nodeCreated = false;

      // Action of add edge
      if(me.action == QueryGraph.Data.GraphAction.ADD_EDGE)
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
              let newEdge = null;

              if(me.selectedNode.type != QueryGraph.Data.NodeType.FILTER || endNode.type == QueryGraph.Data.NodeType.FILTER)
              {
                newEdge = me.addEdge(me.selectedNode.id, data.nodes[0], me.selectedNode, endNode);
              }
              else
              {
                // If start node tpye is FILTER, reverses the direction and set type to FIXED
                newEdge = me.addEdge(data.nodes[0], me.selectedNode.id, endNode, me.selectedNode, null, QueryGraph.Data.EdgeType.FIXED);
              }

              me.selectedEdge = newEdge;
              me.network.selectEdges([newEdge.id]);
              me.uiManager.selectEdge(me.selectedEdge);
              me.selectedNode = null;
             
              edgeCreated = true;
            }
            
            me.action = null;

            $("#graph").css("cursor", "auto");  
            QueryGraph.UI.TopUI.highlight(QueryGraph.UI.TopUI.ADD_EDGE_BUTTON_HTML_ID, false);      
          }
        }
        else
        {
          alert("Création de lien : Veuillez sélectionner un noeud");
        }
      }
      // Action of add node
      else if(me.action == QueryGraph.Data.GraphAction.ADD_NODE)
      {
        let newNode = me.addNode(data.pointer.canvas.x, data.pointer.canvas.y);

        $("#graph").css("cursor", "auto");
        QueryGraph.UI.TopUI.highlight(QueryGraph.UI.TopUI.ADD_NODE_BUTTON_HTML_ID, false);

        me.action = null;

        me.selectedNode = newNode;
        me.network.selectNodes([newNode.id]);
        me.uiManager.selectNode(me.selectedNode);
        me.selectedEdge = null;
        
        nodeCreated = true;
      }

      // Select node if is not creation
      if(!edgeCreated && !nodeCreated)
      {
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
      }
    });
  }

  /**
   * Add a new node
   * @param {String}                   x                The X node position
   * @param {String}                   y                The Y node position
   * @param {Number}                   id               Id of the node (optional)
   * @return {QueryGraph.Data.Node}                     The new Node
   */
  addNode(x, y, id)
  {
    // Get free id
    if(!id)
    {
      id = 1;
    }
    if(this.nodes.length > 0)
    {
      id = this.nodes[this.nodes.length - 1].id + 1;
    }
    
    // Create the node
    let newNode = new QueryGraph.Data.Node(id);

    this.visNodes.add([newNode.createVisNode(x, y)]);

    //newNode.setType(QueryGraph.Data.NodeType.ELEMENT, this);

    this.nodes.push(newNode);

    return newNode;
  }

  /**
   * Add a new edge
   * @param {Number}                          idNodeStart          Id of the start node
   * @param {Number}                          idNodeEnd            Id of the end node
   * @param {QueryGraph.Data.Node}            nodeStart            Start node
   * @param {QueryGraph.Data.Node}            nodeEnd              End node
   * @param {Number}                          id                   Id of the edge (optional)
   * @param {QueryGraph.Data.EdgeType}        type                 Type of the edges (optional)
   * @return {QueryGraph.Data.Edge}                                The new Edge
   */
  addEdge(idNodeStart, idNodeEnd, nodeStart, nodeEnd, id, type)
  {
    let newEdge = new QueryGraph.Data.Edge(idNodeStart, idNodeEnd, nodeStart, nodeEnd);

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

    if(type)
    {
      newEdge.setType(type, this);
    }
    else
    {
      newEdge.setType(QueryGraph.Data.EdgeType.VARIABLE, this);
    }

    return newEdge;
  }

  /**
   * Get a node from id
   * @param {Number}               id          Id of the node
   * @return {QueryGraph.Data.Node}                 The node
   */
  getNode(id)
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
  }

  /**
   * Get a edge from id
   * @param {Number}               id          Id of the edge
   * @return {QueryGraph.Data.Edge}                 The edge
   */
  getEdges(id)
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
  }

  /**
   * Delete a node
   * @param {Number}            nodeId          Id of the node
   */
  deleteNode(nodeId)
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
  }

  /**
   * Delete a edge
   * @param {Number}            edgeId          Id of the edge
   */
  deleteEdge(edgeId)
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
  }

  /**
   * Export the graph to a json object
   * @return {String}                      Json string export
   */
  toJson()
  {
    var me = this;
    
    var data = {};
    data["nodes"] = [];
    data["edges"] = [];
    data["params"] = me.params.toJson();

    for(let i = 0; i < me.nodes.length; i++)
    {
      data["nodes"].push({});
      data["nodes"][i]["type"] = me.nodes[i].type;
      data["nodes"][i]["id"] = me.nodes[i].id;
      data["nodes"][i]["elementInfos"] = me.nodes[i].elementInfos;
      data["nodes"][i]["dataInfos"] = me.nodes[i].dataInfos;
      data["nodes"][i]["filterInfos"] = me.nodes[i].filterInfos;
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
  fromJson(data)
  {
    var me = this;
    
    me.clearGraph();

    for(let i = 0; i < data["nodes"].length; i++)
    {
      me.addNode(0, 0, data["nodes"][i]["id"]);

      //me.nodes[i].id = data["nodes"][i]["id"];
      me.nodes[i].setType(data["nodes"][i]["type"], me);
      me.nodes[i].elementInfos = data["nodes"][i]["elementInfos"];
      me.nodes[i].dataInfos = data["nodes"][i]["dataInfos"];

      if(data["nodes"][i]["filterInfos"] != undefined)
      {
        me.nodes[i].filterInfos = data["nodes"][i]["filterInfos"];
      }

      
      if(me.nodes[i].type == QueryGraph.Data.NodeType.ELEMENT)
      {
        me.visNodes.update({id: me.nodes[i].id, label: me.nodes[i].elementInfos.name});
      }
      else if(me.nodes[i].type == QueryGraph.Data.NodeType.DATA)
      {
        me.visNodes.update({id: me.nodes[i].id, label: me.nodes[i].dataInfos.label});
      }
      else if(me.nodes[i].type == QueryGraph.Data.NodeType.FILTER)
      {
        me.visNodes.update({id: me.nodes[i].id, label: me.nodes[i].filterInfos.operator + " " + me.nodes[i].filterInfos.value});
      }

    }
    for(let i = 0; i < data["edges"].length; i++)
    {
      let idNodeStart = data["edges"][i]["idNodeStart"];
      let idNodeEnd = data["edges"][i]["idNodeEnd"];
      let nodeStart = me.getNode(idNodeStart);
      let nodeEnd = me.getNode(idNodeEnd);

      me.addEdge(idNodeStart, idNodeEnd, nodeStart, nodeEnd, data["edges"][i]["id"]);

      me.edges[i].setType(data["edges"][i]["type"], me);
      me.edges[i].setInformations(data["edges"][i]["label"], data["edges"][i]["uri"], data["edges"][i]["name"], data["edges"][i]["optional"], me);
    }

    if(data["params"])
    {
      me.params.fromJson(data["params"]);
    }

    me.uiManager.unSelect();
  }

  /**
   * Clear graph nodes and edges
   */
  clearGraph()
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

    me.network.destroy();
    me.initNetwork();
    me.uiManager.unSelect();

    me.nodes = [];
    me.edges = [];
  }

  /**
   * Delete selected elements (nodes and edges)
   */
  deleteSelectedElements()
  {
    var me = this;

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
  }
}


/**
 * @property {String}                  addNode                    Action of add a node
 * @property {String}                  addEdge                    Action of add a edge
 */
QueryGraph.Data.GraphAction = {
  ADD_NODE : "addNode",
  ADD_EDGE : "addEdge"
};

