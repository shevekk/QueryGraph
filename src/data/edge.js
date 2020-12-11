if (typeof QueryGraph.Data == 'undefined') {
  QueryGraph.Data = {};
}

/**
 * Class for menage a edge 
 */
QueryGraph.Data.Edge = class Edge extends QueryGraph.Data.Element
{
  /**
   * Class for menage a edge 
   * @param {Number}                  idNodeStart          Id of the start node
   * @param {Number}                  idNodeEnd            Id of the end node
   * @param {QueryGraph.Data.Node}         nodeStart            Start node
   * @param {QueryGraph.Data.Node}         nodeEnd              End node
   */
  constructor(idNodeStart, idNodeEnd, nodeStart, nodeEnd)
  {
    super();
    /*
     * @property {Number}                              id                    Id of the edge
     * @property {Number}                              idNodeStart           Id of the start node
     * @property {Number}                              idNodeEnd             Id of the end node
     * @property {QueryGraph.Data.Node}                     nodeStart             Start node
     * @property {QueryGraph.Data.Node}                     nodeEnd               End node
     * @property {Number}                              label                 Label of the edge (for FIXED)
     * @property {Number}                              uri                   URI of the edge  (for FIXE)
     * @property {Number}                              name                  Name of the edge  (for VARIABLE)
     * @property {Boolean}                             optional              True for optional edge
     */
    this.id = null;

    this.idNodeStart = idNodeStart;
    this.idNodeEnd = idNodeEnd;

    this.nodeStart = nodeStart;
    this.nodeEnd = nodeEnd;

    this.type = QueryGraph.Data.EdgeType.VARIABLE;

    this.label = "";
    this.uri = "";
    this.name = "";

    this.optional = false;
  }

  /**
   * Initialise the id for first free Id in the same nodes
   * @param {QueryGraph.Data.Graph}                      graph                  The graphe manager
   */
  initId(graph)
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
  }

  /*
   * Create the visnetwork edge content
   */
  createVisEdge = function()
  {
    let edge = {
      id: this.id,
      from: this.idNodeStart,
      to: this.idNodeEnd,
      arrows : "to",
      width: 3,
      label: this.name,
      color: {
        color: "#ff0000"
      }
    };

    return edge;
  }

  /**
   * Set the type of the edge and init design from type
   * @param {QueryGraph.Data.EdgeType}                  type                   New type of the edge
   * @param {QueryGraph.Data.Graph}                      graph                  The graphe manager
   */
  setType(type, graph)
  {
    this.type = type;

    // set design
    if(this.type == QueryGraph.Data.EdgeType.VARIABLE)
    {
      graph.visEdges.update({id: this.id, color: { color : "#8499c9" }, font: { strokeWidth: 2, strokeColor: "#acbde3" }});
    }
    else if(this.type == QueryGraph.Data.EdgeType.FIXED)
    {
      graph.visEdges.update({id: this.id, color: { color : "#84c994" }, font: { strokeWidth: 2, strokeColor: "#b1e3bd" }});
    }
  }

  /**
   * Set edge informations
   * @param {String}                      label                  Label of element in triplestore
   * @param {String}                      uri                    URI of element in triplestore
   * @param {String}                      name                   Name of element in triplestore
   * @param {Boolean}                     optional               True for optional edge
   * @param {QueryGraph.Data.Graph}            graph                  The graphe manager
   */
  setInformations(label, uri, name, optional, graph)
  {
    if(label != "")
    {
      this.label = label;

      if(this.type == QueryGraph.Data.EdgeType.FIXED)
      {
        graph.visEdges.update({id: this.id, label: label});
      }
    }

    if(uri != "")
    {
      this.uri = uri;
    }

    if(name != "")
    {
      this.name = name;

      if(this.type == QueryGraph.Data.EdgeType.VARIABLE)
      {
        graph.visEdges.update({id: this.id, label: name});
      }
    }

    this.optional = optional;
    if(optional)
    {
      graph.visEdges.update({id: this.id, dashes: [5, 5]});
    }
    else
    {
      graph.visEdges.update({id: this.id, dashes: [1]});
    }
  }

  /**
   * Reverse the direction of the edge
   * @param {QueryGraph.Data.Graph}            graph                  The graphe manager
   */
  reverse(graph)
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
  }
}


