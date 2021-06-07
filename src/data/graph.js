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
                //newEdge = me.addEdge(me.selectedNode.id, data.nodes[0], me.selectedNode, endNode);
                newEdge = me.addEdge(me.selectedNode.id, data.nodes[0]);
              }
              else
              {
                // If start node tpye is FILTER, reverses the direction and set type to FIXED
                //newEdge = me.addEdge(data.nodes[0], me.selectedNode.id, endNode, me.selectedNode, null, QueryGraph.Data.EdgeType.FIXED);
                newEdge = me.addEdge(data.nodes[0], me.selectedNode.id, null, QueryGraph.Data.EdgeType.FIXED);
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
      if(this.nodes.length > 0)
      {
        id = this.nodes[this.nodes.length - 1].id + 1;
      }
      else
      {
        id = 1;
      }
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
  addEdge(idNodeStart, idNodeEnd, id, type)
  {
    let startNode = this.getNode(idNodeStart);
    let endNode = this.getNode(idNodeEnd);

    let newEdge = new QueryGraph.Data.Edge(idNodeStart, idNodeEnd, startNode, endNode);

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

    startNode.addEdge(newEdge, false);
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

      me.nodes[i].elementInfos = data["nodes"][i]["elementInfos"];
      me.nodes[i].dataInfos = data["nodes"][i]["dataInfos"];

      if(data["nodes"][i]["filterInfos"] != undefined)
      {
        me.nodes[i].filterInfos = data["nodes"][i]["filterInfos"];
      }

      me.nodes[i].setType(data["nodes"][i]["type"], me);
    }
    for(let i = 0; i < data["edges"].length; i++)
    {
      let idNodeStart = data["edges"][i]["idNodeStart"];
      let idNodeEnd = data["edges"][i]["idNodeEnd"];
      let nodeStart = me.getNode(idNodeStart);
      let nodeEnd = me.getNode(idNodeEnd);

      me.addEdge(idNodeStart, idNodeEnd, data["edges"][i]["id"]);

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

  /*
   * Load a SPARQL query and create a graph
   * @param {String}                                   query                 The query to load
   * @param {QueryGraph.Query.QueryManager}            queryManager          The query manager
   */
  loadFromSPARQL(query, queryManager)
  {
    this.clearGraph();

    // Manage error
    let validQuery = true;
    let messageError = "";
    if(query.includes("BIND"))
    {
      validQuery = false;
      messageError = QueryGraph.Dictionary.Dictionary.get("LOAD_SPARQL_BIND_NOT_MANAGED");
    }
    else if(query.includes("UNION"))
    {
      validQuery = false;
      messageError = QueryGraph.Dictionary.Dictionary.get("LOAD_SPARQL_UNION_NOT_MANAGED");
    }
    else if(query.includes("GROUP BY"))
    {
      validQuery = false;
      messageError = QueryGraph.Dictionary.Dictionary.get("LOAD_SPARQL_GROUPBY_NOT_MANAGED");
    }

    if(validQuery)
    {
      try 
      {
        // Remove SERVICE LABEL (for wikidata)
        let querySplit = query.split("SERVICE");
        if(querySplit.length > 1)
        {
          let endCharPosition = -1;
          for(let i = 0; i < querySplit[1].length && endCharPosition == -1; i++)
          {
            if(querySplit[1][i] == "}")
            {
              endCharPosition = i;
            }
          }

          if(endCharPosition != -1)
          {
            querySplit[1] = querySplit[1].substr((endCharPosition+1), querySplit[1].length - (endCharPosition+1));
          }

          query = querySplit[0] + querySplit[1];
        }

        // Get Complete Type URI (predicate value)
        let completeTypeUri = QueryGraph.Config.Config.main.typeUri;
        if(completeTypeUri.includes(":"))
        {
          let splitTypeUri = QueryGraph.Config.Config.main.typeUri.split(":");
          completeTypeUri = QueryGraph.Config.Config.prefix[splitTypeUri[0]] + splitTypeUri[1];
        }
        if(completeTypeUri == "a")
        {
          completeTypeUri = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
        }
        else if(completeTypeUri.startsWith("<"))
        {
          completeTypeUri = completeTypeUri.substr(1, completeTypeUri.length - 2);
        }

        // 
        let elementLabel = [];

        // Add prefixe
        for (const prop in QueryGraph.Config.Config.prefix) 
        {
          query = `PREFIX ${prop}: <${QueryGraph.Config.Config.prefix[prop]}> ` + query;
        }

        let queryObj = parseSPARQLQuery(query);


        let nodesVars = [];
        let edgesVar = [];

        for(let i = 0; i < queryObj.where.length; i++)
        {
          if(queryObj.where[i].type == "bgp" || queryObj.where[i].type == "optional")
          {
            let triples = queryObj.where[i].triples;
            let optional = false;
            if(queryObj.where[i].type == "optional")
            {
              triples = queryObj.where[i].patterns[0].triples;
              optional = true;
            }

            for(let j = 0; j < triples.length; j++)
            {
              // Manage subject
              if(triples[j].subject.termType == "Variable")
              {
                if(nodesVars.filter(node => node.name.includes(triples[j].subject.value)).length == 0)
                {
                  nodesVars.push({name : triples[j].subject.value, type : QueryGraph.Data.NodeType.ELEMENT, id: nodesVars.length+1});
                }
              }
              else if(triples[j].subject.termType == "NamedNode")
              {
                nodesVars.push({name : triples[j].subject.value, type : QueryGraph.Data.NodeType.DATA, id: nodesVars.length+1});
              }

              if(nodesVars.filter(node => node.name.includes(triples[j].object.value)).length == 0)
              {
                if(triples[j].object.termType == "Variable")
                {
                  // TO DO : Gestion filter sur prop label
                  let labelProp = "";
                  let selectVarNode = nodesVars.filter(node => node.name == triples[j].subject.value)[0];
                  if(selectVarNode && selectVarNode.typeValue)
                  {
                    labelProp = this.params.getPropertyLabel(selectVarNode.typeValue);
                  }

                  let predicateValue = triples[j].predicate.value;
                  for (const prop in QueryGraph.Config.Config.prefix) 
                  {
                    predicateValue = predicateValue.replace(QueryGraph.Config.Config.prefix[prop], prop + ":");
                  }

                  if(labelProp != predicateValue || elementLabel.includes(triples[j].subject.value))
                  {
                    nodesVars.push({name : triples[j].object.value, type : QueryGraph.Data.NodeType.ELEMENT, id: nodesVars.length+1});
                  }
                  else
                  {
                    elementLabel.push(triples[j].subject.value);
                  }
                }
                else if(triples[j].object.termType == "NamedNode" && triples[j].predicate.value == completeTypeUri)
                {
                  nodesVars.filter(node => node.name == triples[j].subject.value)[0].typeValue = triples[j].object.value;
                }
                else if(triples[j].object.termType == "NamedNode")
                {
                  nodesVars.push({name : triples[j].object.value, type : QueryGraph.Data.NodeType.DATA, id: nodesVars.length+1});
                }
              }

              if(triples[j].predicate.value != completeTypeUri)
              {
                if(triples[j].predicate.termType == "Variable")
                {
                  edgesVar.push({name : triples[j].predicate.value, nodeStartName : triples[j].subject.value, nodeStartEnd : triples[j].object.value, type: QueryGraph.Data.EdgeType.VARIABLE, optional: optional});
                }
                else if(triples[j].predicate.type == "path")
                {
                  edgesVar.push({name : "", nodeStartName : triples[j].subject.value, nodeStartEnd : triples[j].object.value, type: QueryGraph.Data.EdgeType.FIXED, optional: optional});
                }
                else
                {
                  edgesVar.push({name: triples[j].predicate.value, nodeStartName : triples[j].subject.value, nodeStartEnd : triples[j].object.value, type: QueryGraph.Data.EdgeType.FIXED, optional: optional});
                }
              }
            }
          }
          else if(queryObj.where[i].type == "filter")
          {
            let name = "";
            let value = "";
            let operator = queryObj.where[i].expression.operator.toUpperCase();
            let valueType = "";

            let args = queryObj.where[i].expression.args;

            for(let j = 0; j < args.length; j++)
            {
              if(args[j].termType == "Literal")
              {
                value = args[j].value;

                if(args[j].datatype.value == "http://www.w3.org/2001/XMLSchema#string")
                {
                  valueType = QueryGraph.Data.NodeFilterValueType.TEXT;
                }
                else if(args[j].datatype.value == "http://www.w3.org/2001/XMLSchema#integer")
                {
                  valueType = QueryGraph.Data.NodeFilterValueType.NUMBER;
                }
                else if(args[j].datatype.value == "http://www.w3.org/2001/XMLSchema#dateTime")
                {
                  valueType = QueryGraph.Data.NodeFilterValueType.DATE;
                }
              }
              else if(args[j].type == "operation" || args[j].type == "functionCall")
              {
                // queryObj.where[i].expression.args[j].operator == "str"

                for(let k = 0; k < args[j].args.length; k++)
                {
                  if(args[j].args[k].termType == "Variable")
                  {
                    name = args[j].args[k].value;
                  }
                }
              }
              else if(args[j].termType == "Variable")
              {
                name = args[j].value;
              }
            }

            let node = nodesVars.filter(node => node.name == name)[0];
            if(node)
            {
              node.type = QueryGraph.Data.NodeType.FILTER;
              node.value = value;
              node.operator = operator;
              node.valueType = valueType;
            }
          }
        } 

        // Add element nodes
        for(let i = 0; i < nodesVars.length; i++)
        {
          this.addNode(0, 0, (i+1));

          if(nodesVars[i].type == QueryGraph.Data.NodeType.ELEMENT)
          {
            this.nodes[i].elementInfos.name = nodesVars[i].name;

            if(nodesVars[i].typeValue)
            {
              this.nodes[i].elementInfos.uri = nodesVars[i].typeValue;
            }
          }
          else if(nodesVars[i].type == QueryGraph.Data.NodeType.DATA)
          {
            this.nodes[i].dataInfos.label = nodesVars[i].name;
            this.nodes[i].dataInfos.uri = nodesVars[i].name;
          }
          else if(nodesVars[i].type == QueryGraph.Data.NodeType.FILTER)
          {
            this.nodes[i].filterInfos.value = nodesVars[i].value;
            this.nodes[i].filterInfos.operator = nodesVars[i].operator;
            this.nodes[i].filterInfos.valueType = nodesVars[i].valueType;
          }

          this.nodes[i].setType(nodesVars[i].type, this);
        }
        // Add edges elements
        for(let i = 0; i < edgesVar.length; i++)
        {
          let nodeStartVar = nodesVars.filter(el => el.name == edgesVar[i].nodeStartName)[0];
          let nodeEndVar = nodesVars.filter(el => el.name == edgesVar[i].nodeStartEnd)[0];

          if(nodeStartVar && nodeEndVar)
          {
            let idNodeStart = nodeStartVar.id;
            let idNodeEnd = nodeEndVar.id;

            let startNode = this.getNode(idNodeStart);

            this.addEdge(idNodeStart, idNodeEnd, (i+1), edgesVar[i].type);

            let optional = edgesVar[i].optional;
            let name = edgesVar[i].name;

            this.edges[this.edges.length - 1].setInformations(name, name, name, optional, this);
          }
        }

        // Get Select Data
        queryManager.buildQuery(this);
        // Disable all visibility
        let defaultVisibility = false;
        if(queryObj.variables[0].termType == "Wildcard")
        {
          defaultVisibility = true;
        }

        for(let i = 0; i < this.params.visibility.length; i++)
        {
          this.params.visibility[i].visibility = defaultVisibility;
          this.params.visibility[i].label = defaultVisibility;
        }

        // Update select visibility
        for(let i = 0; i < queryObj.variables.length; i++)
        {
          if(queryObj.variables[i].termType == "Variable")
          {
            let visibility = this.params.visibility.filter(visibility => visibility.name == queryObj.variables[i].value)[0];
            if(visibility)
            {
              visibility.visibility = true;
            }
          }
        }

        // Manage ORDER
        if(queryObj.order && queryObj.order.length > 0)
        {
          // 
          this.params.sortEnable = true;
          this.params.sortVar = queryObj.order[0].expression.value;

          if(queryObj.order[0].descending)
          {
            this.params.sortType = QueryGraph.Data.ParamsSortType.DECREASING;
          }
          else
          {
            this.params.sortType = QueryGraph.Data.ParamsSortType.INCREASING;
          }
        }

        // Manage LIMIT
        if(queryObj.limit)
        {
          this.params.limitEnable = true;
          this.params.limitVal = queryObj.limit;
        }
        else
        {
          this.params.limitEnable = false;
        }
      } 
      catch (error) 
      {
        alert(QueryGraph.Dictionary.Dictionary.get("LOAD_SPARQL_ERROR"));
      }
    }
    else
    {
      alert(QueryGraph.Dictionary.Dictionary.get("LOAD_SPARQL_ERROR") + " : " + messageError);
    }

    this.uiManager.unSelect();
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

