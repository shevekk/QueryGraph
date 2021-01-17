
if (typeof QueryGraph.Query == 'undefined') {
  QueryGraph.Query = {};
}

/**
 * Class for menage the query creation
 */
QueryGraph.Query.QueryManager = class QueryManager
{
  constructor() 
  {
    /*
     * @property {String[]}               selectVars            List of select variable
     * @property {String}                 query                 Query string
     * @property {String}                 selectQuery           Content of the where part of the query
     * @property {String}                 whereQuery            Content of the select part of the query
     */
    this.selectVars;
    this.query;
    this.selectQuery;
    this.whereQuery;
  }

  /**
   * Execute a query, parse query and send to triplestore
   * @param {QueryGraph.Data.Graph}            graph                  The graphe manager
   * @param {Function}                    callback               The callback
   */
  exec(graph, callback)
  {
    let me = this;

    // Reinit query vars
    this.selectVars = [];
    this.query = "";
    this.selectQuery = "SELECT ";
    this.whereQuery = " ";

    // Create request 
    for(let i = 0; i < graph.nodes.length; i++)
    {
      let node = graph.nodes[i];

      me.addNode(graph, node);
    }

    this.whereQuery += me.addFilters(graph);

    // Add language label management
    if(QueryGraph.Config.Config.displayLabel && QueryGraph.Config.Config.tripleStore == QueryGraph.Config.TripleStoreType.WIKIDATA)
    {
      this.whereQuery += ' SERVICE wikibase:label { bd:serviceParam wikibase:language "'+QueryGraph.Config.Config.getQueryLanguage()+'". }';
    }

    this.query += this.selectQuery + " WHERE { " + this.whereQuery + " }";

    // Add limit
    if(QueryGraph.Config.Config.limit != null)
    {
      this.query += " LIMIT " + QueryGraph.Config.Config.limit;
    }

    // let queryURL = QueryGraph.Config.Config.endPoint + "?" + "query="+encodeURI(this.query) + "&format=json";
    let queryURL = QueryGraph.Config.Config.endPoint + "?" + "query="+encodeURIComponent(this.query) + "&format=json";

    // launch the query
    let ajaxRequest = $.ajax({
      url:queryURL,
      dataType: 'json'
    });

    ajaxRequest.fail(function(error)
    {
      // if the request fails, return to menu
      console.log("EndPoint : " + QueryGraph.Config.Config.endPoint);
      console.log("Query : " + me.query);

      alert(QueryGraph.Dictionary.Dictionary.get("QUERY_FAIL"));

      // call log script
      let ajaxRequest = $.ajax({
        url:"log/log.php",
        dataType: 'json',
        method: "POST",
        data: { query: me.query, lang: QueryGraph.Config.Config.lang, endPoint: QueryGraph.Config.Config.endPoint, state: "FAIL" }
      });
      
      callback(null, null, error.responseText);
    });

    // Send request
    ajaxRequest.done(function(data)
    {
      // call log script
      let ajaxRequest = $.ajax({
        url:"log/log.php",
        dataType: 'json',
        method: "POST",
        data: { query: me.query, lang: QueryGraph.Config.Config.lang, endPoint: QueryGraph.Config.Config.endPoint, state: "OK" }
      });

      callback(data, me.selectVars);
    });
  }

  /**
   * Add a node data to a query
   * @param {QueryGraph.Data.Graph}           graph                 The graph manager
   * @param {QueryGraph.Data.Node}            node                  Node to add data to query
   */
  addNode(graph, node)
  {
    if(node.type == QueryGraph.Data.NodeType.ELEMENT)
    {
      let typeUri = node.elementInfos.uri;

      let nameVar = "?" + node.elementInfos.name;
      let name = node.elementInfos.name;

      // Add node to select with its label optionnaly
      this.selectQuery += nameVar + " ";
      if(QueryGraph.Config.Config.displayLabel)
      {
        this.selectVars.push({"value" : name, "label" : name + "Label", "elementType" : QueryGraph.Data.ElementType.NODE});
        this.selectQuery += nameVar + "Label ";
      }
      else
      {
        this.selectVars.push({"value" : name});
      }

      // Menage optional state
      let nodeOptional = node.edgesAreAllOptional();
      if(nodeOptional)
      {
        this.whereQuery += " OPTIONAL { "
      }
      
      if(typeUri != "")
      {
        // Menage http element
        if(typeUri.startsWith("http"))
        {
          typeUri = "<" + typeUri + ">";
        }

        // Create query line with the optional recovery of the subclass 
        if(node.elementInfos.subclass)
        {
          this.whereQuery += nameVar + " " + QueryGraph.Config.Config.typeUri + "/" + QueryGraph.Config.Config.subclassUri + "* " + typeUri + " . ";
        }
        else
        {
          this.whereQuery += nameVar + " " + QueryGraph.Config.Config.typeUri + " " + typeUri + " . ";
        }
      }

      // Add edges if the end node edges are not all optional (optional node)
      for(let j = 0; j < node.edges.length; j++)
      {
        let edge = node.edges[j];
        let endNode = graph.getNode(edge.idNodeEnd);

        if(!endNode.edgesAreAllOptional() || endNode.type == QueryGraph.Data.NodeType.DATA)
        {
          this.addEdge(edge, nameVar, endNode, nodeOptional);
        }
      }

      // For optional node add revert edges
      if(nodeOptional)
      {
        for(let i = 0; i < node.reverseEdges.length; i++)
        {
          let edge = node.reverseEdges[i];
          let startNode = graph.getNode(edge.idNodeStart);
          let nameVar = this.getNodeVarName(startNode);

          this.addEdge(edge, nameVar, node, nodeOptional);
        }

        this.whereQuery += " } "
      }
    }
    else if(node.type == QueryGraph.Data.NodeType.DATA)
    {
      // For data nodes, create edges with other nodes
      let startNodeUri = node.dataInfos.uri;
      if(startNodeUri.startsWith("http"))
      {
        startNodeUri = "<" + startNodeUri + ">";
      }

      for(let j = 0; j < node.edges.length; j++)
      {
        let edge = node.edges[j];
        let endNode = graph.getNode(edge.idNodeEnd);

        this.addEdge(edge, startNodeUri, endNode, false);
      }
    }
  }

  /**
   * Add a edge data to a query
   * @param {QueryGraph.Data.Edge}            edge                        Edge to add data to query
   * @param {String}                     startNodeVarName            Var Name of the start node
   * @param {QueryGraph.Data.Node}            endNode                     End node
   * @param {Boolean}                    nodeOptional                True if an optional node (no optional balise for edge)
   */
  addEdge(edge, startNodeVarName, endNode, nodeOptional)
  {
    // Init end node var name
    let endNodeVarName = this.getNodeVarName(endNode);

    // add edge in query
    if(edge.type == QueryGraph.Data.EdgeType.FIXED)
    {
      let uri = edge.uri;
      if(uri.startsWith("http"))
      {
        uri = "<" + uri + ">";
      }

      // Create query line for optional and not optional
      if(edge.optional && !nodeOptional)
      {
        this.whereQuery +=  " OPTIONAL { " + startNodeVarName + " " + uri + " " + endNodeVarName + " } . ";
      }
      else
      {
        this.whereQuery +=  startNodeVarName + " " + uri + " " + endNodeVarName + " . ";
      }
    }
    else if(edge.type == QueryGraph.Data.EdgeType.VARIABLE)
    {
      let name = "?" + edge.name;

      // Cretae query lien for for optional and not optional
      if(edge.optional && !nodeOptional)
      {
        this.whereQuery +=  " OPTIONAL { " + startNodeVarName + " " + name + " " + endNodeVarName + " } . ";
      }
      else
      {
        this.whereQuery +=  startNodeVarName + " " + name + " " + endNodeVarName + " . ";
      }

      // Add edge variable name to select
      this.selectVars.push({"value" : edge.name, "elementType" : QueryGraph.Data.ElementType.EDGE});
      this.selectQuery += name + " ";
    }
  }

  /**
   * Get the node var name by type
   * @param {QueryGraph.Data.Node}            node                    The node
   * @return {String}                                                 The node var name
   */
  getNodeVarName(node)
  {
    let varName = "";

    if(node.type == QueryGraph.Data.NodeType.ELEMENT)
    {
      varName = "?" + node.elementInfos.name;
    }
    else if(node.type == QueryGraph.Data.NodeType.DATA)
    { 
      varName = node.dataInfos.uri;

      if(varName.startsWith("http"))
      {
        varName = "<" + varName + ">";
      }
    }
    else if(node.type == QueryGraph.Data.NodeType.FILTER)
    {
      varName = "?filter" + node.id;
    }

    return varName;
  }

  /**
   * Create the filter query string form filter nodes data
   * @param {QueryGraph.Data.Graph}            graphe                 The graph manager
   * @return {String}                                                 The filter query string
   */
  addFilters(graph)
  {
    let filterStr = '';
    
    for(let i = 0; i < graph.nodes.length; i++)
    {
      if(graph.nodes[i].type == QueryGraph.Data.NodeType.FILTER)
      {
        let filterContentStr = '';
        let varName = this.getNodeVarName(graph.nodes[i]);

        if(graph.nodes[i].filterInfos.operator == QueryGraph.Data.NodeFilterOperator.CONTAINS || graph.nodes[i].filterInfos.operator == QueryGraph.Data.NodeFilterOperator.STRSTARTS || graph.nodes[i].filterInfos.operator == QueryGraph.Data.NodeFilterOperator.STRENDS)
        {
          // Manage CONTAINS, STRSTARTS and STRENDS Filters
          let value = graph.nodes[i].filterInfos.value;
          if(!value.startsWith('"'))
          {
            value = '"' + value + '"';
          }

          if(graph.nodes[i].filterInfos.operator == QueryGraph.Data.NodeFilterOperator.CONTAINS)
          {
            filterContentStr += "CONTAINS(" + varName + ", " + value + ")";
          }
          else if(graph.nodes[i].filterInfos.operator == QueryGraph.Data.NodeFilterOperator.STRSTARTS)
          {
            filterContentStr += "STRSTARTS(" + varName + ", " + value + ")";
          }
          else if(graph.nodes[i].filterInfos.operator == QueryGraph.Data.NodeFilterOperator.STRENDS)
          {
            filterContentStr += "STRENDS(" + varName + ", " + value + ")";
          }
        }
        else
        {
          // Other filters
          if(graph.nodes[i].filterInfos.valueType == QueryGraph.Data.NodeFilterValueType.TEXT)
          {
            filterContentStr = 'STR(' + varName + ')';
          }
          else
          {
            filterContentStr = varName;
          }

          if(graph.nodes[i].filterInfos.operator == QueryGraph.Data.NodeFilterOperator.IN)
          {
            // Manage IN operator for number or string
            let values = graph.nodes[i].filterInfos.value.split(', ').join(',').split(',')

            filterContentStr += " IN(";
            for(let j = 0; j < values.length; j++)
            {
              if(graph.nodes[i].filterInfos.valueType == QueryGraph.Data.NodeFilterValueType.TEXT && !values[j].startsWith('"'))
              {
                filterContentStr += '"' + values[j]+ '"';
              }
              else
              {
                filterContentStr += '' + values[j]+ '';
              }

              if(j < values.length-1)
              {
                filterContentStr += ","
              }
            }

            filterContentStr += ")";
          }
          else
          {
            // Menage =, >, >=, <, <= operators
            filterContentStr += " " + graph.nodes[i].filterInfos.operator + " ";
            
            if(graph.nodes[i].filterInfos.valueType != QueryGraph.Data.NodeFilterValueType.NUMBER && !graph.nodes[i].filterInfos.value.startsWith('"'))
            {
              filterContentStr += '"' + graph.nodes[i].filterInfos.value + '"';
            }
            else
            {
              filterContentStr += graph.nodes[i].filterInfos.value;
            }

            if(graph.nodes[i].filterInfos.valueType == QueryGraph.Data.NodeFilterValueType.DATE)
            {
              filterContentStr += "^^xsd:dateTime";
            }
          }
        }

        filterStr += " FILTER(" + filterContentStr + ") . ";
      }
    }

    return filterStr;
  }
}