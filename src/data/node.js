if (typeof QueryGraph.Data == 'undefined') {
  QueryGraph.Data = {};
}

/**
 * Class for menage a node
 */
QueryGraph.Data.Node = class Node extends QueryGraph.Data.Element
{
  /**
   * Class for menage a node 
   * @param {Number}                  id                  Id of the node
   */
  constructor(id)
  {
    super();

    /**
     * @property {String}                                   id                    Id of the node
     * @property {QueryGraph.Data.NodeElementInfos}         elementInfos          Information of elements node
     * @property {QueryGraph.Data.NodeDataInfos}            dataInfos             Information of data node
     * @property {QueryGraph.Data.Edge[]}                   edges                 Edges of the node
     * @property {QueryGraph.Data.Edge[]}                   reverseEdges          Reverses edges of the node
     */
    this.id = id;
    this.type = QueryGraph.Data.NodeType.ELEMENT;

    this.elementInfos = new QueryGraph.Data.NodeElementInfos();
    this.elementInfos.name = "Noeud" + this.id;
    this.dataInfos = new QueryGraph.Data.NodeDataInfos();
    this.filterInfos = new QueryGraph.Data.NodeFilterInfos();

    this.edges = [];
    this.reverseEdges = [];
  }

  /**
   * Create the visnetwork node content
   * @param {String}               x                The X node position
   * @param {String}               y                The Y node position
   */
  createVisNode(x, y)
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
      },
      font: { vadjust : -4 }
    };

    return node;
  }

  /**
   * Set the type of the node and init design from type
   * @param {QueryGraph.Data.NodeType}                  type                   New type of the node
   * @param {QueryGraph.Data.Graph}                     graph                  The graphe manager
   */
  setType(type, graph)
  {
    this.type = type;

    // set design
    if(this.type == QueryGraph.Data.NodeType.DATA)
    {
      graph.visNodes.update({id: this.id, color: { background: "#e99290", border: "#ba4e4b" }, shape: "dot", size: 15, shape: "diamond", borderWidth: 2, font: { strokeWidth: 2, strokeColor: "#e99290" }});
    }
    else if(this.type == QueryGraph.Data.NodeType.ELEMENT)
    {
      graph.visNodes.update({id: this.id, color: { background: "#a9d1db", border: "#418597" }, size: 11, shape: "dot", borderWidth: 2, font: { strokeWidth: 2, strokeColor: "#a9d1db" }});
    }
    else if(this.type == QueryGraph.Data.NodeType.FILTER)
    {
      graph.visNodes.update({id: this.id, color: { background: "#ffe782", border: "#d3b843" }, size: 12, shape: "triangle", borderWidth: 2, font: { strokeWidth: 2, strokeColor: "#ffe782" }});

      // Reverse edges
      for(let i = 0; i < this.edges.length; i++)
      {
        this.edges[i].reverse(graph);
        i--;
      }
      // Set reserse edges type to FIXED
      for(let i = 0; i < this.reverseEdges.length; i++)
      {
        if(this.reverseEdges[i].type != QueryGraph.Data.EdgeType.FIXED)
        {
          this.reverseEdges[i].setType(QueryGraph.Data.EdgeType.FIXED, graph);
        }
      }
    }
  }

  /**
   * Set elements informations
   * @param {String}                         label                  Label of element in triplestore
   * @param {String}                         uri                    URI of element in triplestore
   * @param {String}                         name                   Name of element in triplestore
   * @param {Boolean}                        subclass               True for get subclass of the element
   * @param {QueryGraph.Data.Graph}          graph                  The graphe manager
   */
  setElementInfos(label, uri, name, subclass, graph)
  {
    this.elementInfos.label = label;
    this.elementInfos.uri = uri;
    this.elementInfos.name = name;
    this.elementInfos.subclass = subclass;

    graph.visNodes.update({id: this.id, label: name});
  }

  /**
   * Set data informations
   * @param {String}                        label                  Label of element in triplestore
   * @param {String}                        uri                    URI of element in triplestore
   * @param {QueryGraph.Data.Graph}         graph                  The graphe manager
   */
  setDataInfos(label, uri, graph)
  {
    this.dataInfos.label = label;
    this.dataInfos.uri = uri;

    graph.visNodes.update({id: this.id, label: label});
  }

  /**
   * Set data informations
   * @param {QueryGraph.Data.NodeFilterOperator}          operator               Operator of the filter
   * @param {QueryGraph.Data.NodeFilterValueType}         valueType              Type of the value
   * @param {String}                                      value                  Value(s) of the filter
   * @param {QueryGraph.Data.Graph}                       graph                  The graphe manager
   */
  setFilterInfos(operator, valueType, value, graph)
  {
    this.filterInfos.operator = operator;
    this.filterInfos.valueType = valueType;
    this.filterInfos.value = value;

    graph.visNodes.update({id: this.id, label: operator + " " + value});
  }

  /**
   * Add a edge to this node
   * @param {QueryGraph.Data.Edge}             edge                     The edge
   * @param {Boolean}                     reverse                  True if the edges id reverse (end node)
   */
  addEdge(edge, reverse)
  {
    if(reverse)
    {
      this.reverseEdges.push(edge);
    }
    else
    {
      this.edges.push(edge);
    }
  }

  /**
   * Check if edges and reverse edges are optional
   * @return                          True if edges are all optional
   */
  edgesAreAllOptional()
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
  }
}

/**
 * Class for menage a node
 * @property {String}                        label                  Label of element in triplestore
 * @property {String}                        uri                    URI of element in triplestore
 */
QueryGraph.Data.NodeDataInfos = class NodeDataInfos
{
  constructor()
  {
    this.label = ""; 
    this.uri = ""; 
  }
}

/*
 * Information of elements node
 * @property {String}                         label                  Label of element in triplestore
 * @property {String}                         uri                    URI of element in triplestore
 * @property {String}                         name                   Name of element in triplestore
 * @property {Boolean}                        subclass               True for get subclass of the element
 */
QueryGraph.Data.NodeElementInfos = class NodeElementInfos
{
  constructor()
  {
    this.label = ""; 
    this.uri = ""; 
    this.name = "";
    this.subclass = false;
  }
}

/*
 * Information of filter node
 * @property {QueryGraph.Data.NodeFilterOperator}           operator               Operator of the filter
 * @property {QueryGraph.Data.NodeFilterValueType}          valueType              Type of the value
 * @property {String}                                       value                  Value(s) of the filter
 */
QueryGraph.Data.NodeFilterInfos = class NodeFilterInfos
{
  constructor()
  {
    this.operator = QueryGraph.Data.NodeFilterOperator.EQUAL; 
    this.valueType = QueryGraph.Data.NodeFilterValueType.NUMBER;
    this.value = "";
  }
}

/*
 * Filter node operators
 */
QueryGraph.Data.NodeFilterOperator = 
{
  EQUAL: "=",
  SUPERIOR: ">",
  INFERIOR: "<",
  SUPERIOR_OR_EQUAL: ">=",
  INFERIOR_OR_EQUAL: "<=",
  IN: "IN",
  CONTAINS: "CONTAINS",
  STRSTARTS: "STRSTARTS",
  STRENDS: "STRENDS",
  DIFFERENT: "!="
}

/*
 * Value type of filter node
 */
QueryGraph.Data.NodeFilterValueType = 
{
  NUMBER: "NUMBER",
  TEXT: "TEXT",
  DATE: "DATE",
}