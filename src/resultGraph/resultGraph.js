if (typeof QueryGraph == 'undefined') {
  QueryGraph = {};
}

if (typeof QueryGraph.ResultGraph == 'undefined') {
  QueryGraph.ResultGraph = {};
}

/**
 * Main class 
 */
QueryGraph.ResultGraph.ResultGraph = class ResultGraph 
{
  /**
   * Class for display graph from query result data
   * @param {Object}                     graphJson                    Graph informations
   * @param {Object[]}                   dataJson                     Data result information
   */
  constructor(graphJson, dataJson)
  {
   /**
   * @property {vis.DataSet}                        visNodes                     VisNetwork nodes datas 
   * @property {vis.DataSet}                        visEdges                     VisNetwork nodes edges 
   * @property {vis.Network}                        network                      The vis network
   * @property {Object}                             baseGraph                    Graph informations
   * @property {Object[]}                           data                         Data result information
   */
    this.baseGraph = JSON.parse(graphJson);
    this.data = JSON.parse(dataJson);
    this.network = null;
    this.visNodes = new vis.DataSet([]);
    this.visEdges = new vis.DataSet([]);
  }

  /**
   * Create a graph from data
   */
  draw()
  {
    var me = this;

    if(me.data.length == 0)
    {
      alert(QueryGraph.Dictionary.Dictionary.get("GRAPH_NO_DATA"));
    }
    else if(me.data.length >= 500)
    {
      var confimation = confirm(QueryGraph.Dictionary.Dictionary.get("GRAPH_TOO_MANY_DATA_START") + me.data.length + QueryGraph.Dictionary.Dictionary.get("GRAPH_TOO_MANY_DATA_END"));

      // If user Cancel action -> Close window
      if(!confimation)
      {
        close();
      }
    }

    // create groups
    let groups = {};
    for(let i = 0; i < this.baseGraph.nodes.length; i++)
    {
      if(this.baseGraph.nodes[i].type == QueryGraph.Data.NodeType.ELEMENT)
      {
        let icon = null;
        for (const property in QueryGraph.Config.Config.icons) 
        {
          if(QueryGraph.Config.Config.checkSameUri(property, this.baseGraph.nodes[i].uri))
          {
            let uri = this.baseGraph.nodes[i].uri;
            if(uri.startsWith("http"))
            {
              for (let key in QueryGraph.Config.Config.prefix)
              {
                uri = uri.replace(QueryGraph.Config.Config.prefix[key], key + ":")
              }
            }

            icon = QueryGraph.Config.Config.icons[uri];
          }
        }

        if(icon != null)
        {
          groups[this.baseGraph.nodes[i].name] = {
            shape: "icon",
            icon: {
              face: '"FontAwesome"',
              code: `${icon}`,
              size: 35,
              color:'#418597'
            },
            borderWidth: 3,
            margin : 10,
            font: { strokeWidth: 2, strokeColor: "#a9d1db" }
          };
        }
        else
        {
          groups[this.baseGraph.nodes[i].name] = {
            shape: "dot",
            color: { background : "#a9d1db", border : "#418597" }, 
            size: 11,
            borderWidth: 2,
            font: { strokeWidth: 2, strokeColor: "#a9d1db" }
          };
        }
      }
      else if(this.baseGraph.nodes[i].type == QueryGraph.Data.NodeType.DATA)
      {
        groups["|data|"] = {
          color: { background : "#e99290", border : "#ba4e4b" },
          size: 15,
          shape: "diamond",
          borderWidth: 2, 
          font: { strokeWidth: 2, strokeColor: "#e99290" }
        };
      }
    }

    // Create nodes
    var nodeNumber = 0;
    for(let i = 0; i < this.baseGraph.nodes.length; i++)
    {
      if(this.baseGraph.nodes[i].type == QueryGraph.Data.NodeType.DATA)
      {
        nodeNumber ++;
        me.addNode(nodeNumber, this.baseGraph.nodes[i].type, this.baseGraph.nodes[i].name, this.baseGraph.nodes[i].label, this.baseGraph.nodes[i].id, -1, this.baseGraph.nodes[i].uri);
      }
    }
    for(let i = 0; i < this.baseGraph.nodes.length; i++)
    {
      if(this.baseGraph.nodes[i].type == QueryGraph.Data.NodeType.ELEMENT)    
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

            me.addNode(nodeNumber, this.baseGraph.nodes[i].type, this.baseGraph.nodes[i].name, label, this.baseGraph.nodes[i].id, this.data[j].lineNumber, this.data[j].value);
          }
        }
      }
    }

    // Create edges
    for(let i = 0; i < this.baseGraph.edges.length; i++)
    {
      me.edgesCreation(this.baseGraph.edges[i]);
    }
    // Init graph 
    let container = document.getElementById('graph');
    let data = {
      nodes: me.visNodes,
      edges: me.visEdges
    };
    let options = {
      groups: groups,
      physics : {
        enabled: true,
        stabilization: false,
        barnesHut : {
          gravitationalConstant : -3000,
          centralGravity : 0.25,
          springLength : 95,
          springConstant : 0.025
        }
      }
    };

    me.network = new vis.Network(container, data, options);


    // Reinit labels
    var ids = me.visEdges.getIds();
    for(let i = 0; i < ids.length; i++)
    {
      me.visEdges.update({id: ids[i], label: me.visEdges.get(ids[i]).label});
    }

    // Double click --> Open URI in 
    me.network.on("doubleClick", function(data)
    {
      if(data.nodes.length > 0)
      {
        if(me.visNodes.get(data.nodes[0]).uri.startsWith("http"))
        {
          window.open(me.visNodes.get(data.nodes[0]).uri);
        }
      }
      else if(data.edges.length > 0)
      {
        if(me.visEdges.get(data.edges[0]).uri.startsWith("http"))
        {
          window.open(me.visEdges.get(data.edges[0]).uri);
        }
      }
    });

    me.network.on("click", function(data)
    {
      let content = "";
      if(data.nodes.length > 0)
      {
        // QueryGraph.Dictionary.Dictionary.get("NODE_LABEL") NODE_URI NODE_NAME NODE_TYPE EDGE_LABEL  EDGE_URI EDGE_TYPE
        content += ` || ${QueryGraph.Dictionary.Dictionary.get("NODE_LABEL")} ${me.visNodes.get(data.nodes[0]).label}`;
        content += ` || ${QueryGraph.Dictionary.Dictionary.get("NODE_URI")} <a href="${me.visNodes.get(data.nodes[0]).uri}" target="_blank">${me.visNodes.get(data.nodes[0]).uri}</a>`;

        if(me.visNodes.get(data.nodes[0]).name)
        {
          content += ` || ${QueryGraph.Dictionary.Dictionary.get("NODE_NAME")} ${me.visNodes.get(data.nodes[0]).name}`;
        }

        content += ` || ${QueryGraph.Dictionary.Dictionary.get("NODE_TYPE")} ${me.visNodes.get(data.nodes[0]).type}`;
      }
      else if(data.edges.length > 0)
      {
        content += ` || ${QueryGraph.Dictionary.Dictionary.get("EDGE_LABEL")} ${me.visEdges.get(data.edges[0]).label}`;
        content += ` || ${QueryGraph.Dictionary.Dictionary.get("EDGE_URI")} <a href="${me.visEdges.get(data.edges[0]).uri}" target="_blank">${me.visEdges.get(data.edges[0]).uri}</a>`;
        content += ` || ${QueryGraph.Dictionary.Dictionary.get("EDGE_TYPE")} ${me.visEdges.get(data.edges[0]).type}`;
      }

      $("#contentData").html(content);
    });
  }

  /**
   * Create edges for a baseGraphEdge
   * @param {Object}                     baseGraphEdge                    Edge graph object
   */
  edgesCreation(baseGraphEdge)
  {
    var me = this;

    let startNodes = me.visNodes.get({
      filter: function (item) {
        return item.baseIds[baseGraphEdge.idNodeStart] != undefined;
      }
    });

    for(let i = 0; i < startNodes.length; i++)
    {
      let endNodesIds = [];

      let startNodesLineNumbers = [];
      startNodesLineNumbers = startNodesLineNumbers.concat(startNodes[i].baseIds[baseGraphEdge.idNodeStart]);

      for(let j = 0; j < startNodesLineNumbers.length; j++)
      {
        let endNodes = me.visNodes.get({
          filter: function (item) {

            let itemLineNumbers = [];
            itemLineNumbers = itemLineNumbers.concat(item.baseIds[baseGraphEdge.idNodeEnd]);

            return (item.uri != startNodes[i].uri && itemLineNumbers.includes(startNodesLineNumbers[j]) || itemLineNumbers.includes(-1) || startNodesLineNumbers[j] == -1) 
            && item.baseIds[baseGraphEdge.idNodeEnd] != undefined;
          }
        });
        for(let k = 0; k < endNodes.length; k++)
        {
          if(!endNodesIds.includes(endNodes[k].id))
          {
            let data = me.getEdgeLabelAndUri(baseGraphEdge, startNodes[i], endNodes[k]);

            for(let l = 0; l < data.uri.length; l++)
            {
              endNodesIds.push(endNodes[k].id);
              me.addEdge(startNodes[i].id, endNodes[k].id, baseGraphEdge.type, data.uri[l], data.labels[l]);
            }
          }
        }
      }
    }
  }

  /**
   * Get the edges label, if variable get the data line value
   * @param {Object}                     baseGraphEdge                    Edge graph object
   * @param {Object}                     startNode                        VisNode Object
   * @param {Object}                     endNode                          VisNode Object
   * return {Object}                                                      Data with array of label and uri
   */
  getEdgeLabelAndUri(baseGraphEdge, startNode, endNode)
  {
    let me = this;

    let label = "";
    let uri = "";

    let data = {};
    data.labels = [];
    data.uri = [];

    if(baseGraphEdge.type == QueryGraph.Data.EdgeType.VARIABLE)
    {
      let numLines = [];

      if(startNode.baseIds[baseGraphEdge.idNodeStart] != undefined && endNode.baseIds[baseGraphEdge.idNodeEnd] != undefined)
      {
        let startLines = startNode.baseIds[baseGraphEdge.idNodeStart];
        let endLines = endNode.baseIds[baseGraphEdge.idNodeEnd];

        for(let i = 0; i < startLines.length; i++)
        {
          for(let j = 0; j < endLines.length; j++)
          {
            if(startLines[i] == endLines[j] || startLines[i] == -1 || endLines[j] == -1)
            {
              if(startLines[i] != -1)
              {
                numLines.push(startLines[i]);
              }
              else
              {
                numLines.push(endLines[j]);
              }
            }
          }
        }
      }

      for(let j = 0; j < me.data.length; j++)
      {
        if(me.data[j].var == baseGraphEdge.name && numLines.includes(me.data[j].lineNumber))
        {
          if(!data.uri.includes(me.data[j].value))
          {
            data.uri.push(me.data[j].value);
            
            if(me.data[j].label)
            {
              data.labels.push(me.data[j].label);
            }
            else
            {
              data.labels.push(me.data[j].value);
            }
          }
        }
      }
    }
    else if(baseGraphEdge.type == QueryGraph.Data.EdgeType.FIXED)
    {
      data.labels.push(baseGraphEdge.label);
      data.uri.push(baseGraphEdge.uri);
    }

    return data;
  }

  /**
   * Add a new node, if node with is URI already exist, update lines Numbers
   * @param {Number}                       id                      Number of the node
   * @param {QueryGraph.Data.NodeType}     type                    Type of the node 
   * @param {String}                       name                    Name of the node
   * @param {String}                       label                   Label of the node
   * @param {String}                       baseId                  Id of the base graph matching the node
   * @param {Number}                       lineNumber              The line number
   * @param {String}                       uri                     URI of the node
   */ 
  addNode(id, type, name, label, baseId, lineNumber, uri)
  {
    var items = this.visNodes.get({
      filter: function (item) {
        return item.uri == uri;
      }
    });

    if(uri == null || items.length == 0)
    {
      let group = name;
      if(type == QueryGraph.Data.NodeType.DATA)
      {
        group = "|data|";
      }

        let node = {
        id: id,
        label: label,
        size : 10,
        baseIds: [],
        uri: uri,
        type: type,
        name: name,
        group : group,
        color: {
          border: "#000000",
        }
      };
      node.baseIds[baseId] = [lineNumber];
      this.visNodes.add(node);
    }
    else
    {
      let baseIds = items[0].baseIds;
      if(!baseIds[baseId])
      {
        baseIds[baseId] = [lineNumber];
      }
      else
      {
        let lineNumbers = baseIds[baseId].lineNumbers;
        baseIds[baseId].push(lineNumber);
      }

      id = items[0].id;

      this.visNodes.update({id, baseIds: baseIds});
    }
  }

  /**
   * Add a new edge between two nodes
   * @param {Number}                       idNodeStart               Id of the start node
   * @param {Number}                       idNodeEnd                 Id of the end node
   * @param {QueryGraph.Data.EdgeType}         type                      Type of the edge 
   * @param {String}                       uri                       URI of the edge
   * @param {String}                       label                     Label of the edge
   */ 
  addEdge(idNodeStart, idNodeEnd, type, uri, label)
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
      uri: uri,
      type: type,
      color: {
        color: "#ff0000"
      }
    };

    this.visEdges.add(edge);

    if(type == QueryGraph.Data.EdgeType.VARIABLE)
    {
      this.visEdges.update({id: id, color: { color : "#8499c9" }, width : 3, font: { strokeWidth: 2, strokeColor: "#acbde3" }});
    }
    else if(type == QueryGraph.Data.EdgeType.FIXED)
    {
      this.visEdges.update({id: id, color: { color : "#84c994" }, width : 3, font: { strokeWidth: 2, strokeColor: "#b1e3bd" }});
    }
  }
}
