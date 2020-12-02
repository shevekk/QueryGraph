/**
 * Class for menage the query creation
 */
QueryGraph.QueryManager = function()
{

};

/*
 * @property {String[]}               selectVars            List of select variable
 * @property {String}                 query                 Query string
 * @property {String}                 selectQuery           Content of the where part of the query
 * @property {String}                 whereQuery            Content of the select part of the query
 */
QueryGraph.QueryManager.prototype.selectVars;
QueryGraph.QueryManager.prototype.query;
QueryGraph.QueryManager.prototype.selectQuery;
QueryGraph.QueryManager.prototype.whereQuery;

/**
 * Execute a query, parse query and send to triplestore
 * @param {QueryGraph.Graph}            graph                  The graphe manager
 * @param {Function}                    callback               The callback
 */
QueryGraph.QueryManager.prototype.exec = function(graph, callback)
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

  // Add language label management
  if(QueryGraph.Config.displayLabel)
  {
    this.whereQuery += ' SERVICE wikibase:label { bd:serviceParam wikibase:language "'+QueryGraph.Config.language+'". }';
  }

  this.query += this.selectQuery + " WHERE { " + this.whereQuery + " }";

  if(QueryGraph.Config.limit != null)
  {
    this.query += " LIMIT " + QueryGraph.Config.limit;
  }

  let queryURL = QueryGraph.Config.endPoint + "?" + "query="+encodeURI(this.query) + "&format=json";

  // launch the query
  let ajaxRequest = $.ajax({
    url:queryURL,
    dataType: 'json'
  });

  ajaxRequest.fail(function(error)
  {
    // if the request fails, return to menu
    console.log("EndPoint : " + QueryGraph.Config.endPoint);
    console.log("Query : " + me.query);
    alert("Echec de la récupération des données");
    
    callback(null, null, error.responseText);
  });

  // Send request
  ajaxRequest.done(function(data)
  {
    callback(data, me.selectVars);
  });
};

/**
 * Add a node data to a query
 * @param {QueryGraph.Graph}           graph                 The graphe manager
 * @param {QueryGraph.Node}            node                  Node to add data to query
 */
QueryGraph.QueryManager.prototype.addNode = function(graph, node)
{
  if(node.type == QueryGraph.Node.Type.ELEMENT)
  {
    let typeUri = node.elementInfos.uri;

    if(typeUri != "" || node.edges.length > 0 || node.reverseEdges.length > 0)
    {
      let nameVar = "?" + node.elementInfos.name;
      let name = node.elementInfos.name;

      this.selectQuery += nameVar + " ";

      if(QueryGraph.Config.displayLabel)
      {
        this.selectVars.push({"value" : name, "label" : name + "Label", "elementType" : QueryGraph.Element.TYPE.NODE});
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
        if(typeUri.startsWith("http"))
        {
          typeUri = "<" + typeUri + ">";
        }
        // 
        if(node.elementInfos.subclass)
        {
          this.whereQuery += nameVar + " " + QueryGraph.Config.typeUri + "/" + QueryGraph.Config.subclassUri + "* " + typeUri + " . ";
        }
        else
        {
          this.whereQuery += nameVar + " " + QueryGraph.Config.typeUri + " " + typeUri + " . ";
        }
      }

      // Add edges
      for(let j = 0; j < node.edges.length; j++)
      {
        let edge = node.edges[j];
        let endNode = graph.getNode(edge.idNodeEnd);

        if(!endNode.edgesAreAllOptional() || endNode.type == QueryGraph.Node.Type.DATA)
        {
          this.addEdge(edge, nameVar, endNode, nodeOptional);
        }
      }

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
  }
  else if(node.type == QueryGraph.Node.Type.DATA)
  {
    let startNodeUri = node.dataInfos.uri;

    for(let j = 0; j < node.edges.length; j++)
    {
      let edge = node.edges[j];
      let endNode = graph.getNode(edge.idNodeEnd);

      this.addEdge(edge, startNodeUri, endNode, false);
    }
  }
  else if(node.type == QueryGraph.Node.Type.FILTER)
  {

  }
};

/**
 * Add a edge data to a query
 * @param {QueryGraph.Edge}            edge                        Edge to add data to query
 * @param {String}                     startNodeVarName            Var Name of the start node
 * @param {QueryGraph.Node}            endNode                     End node
 * @param {Boolean}                    nodeOptional                True if an optional node (no optional balise for edge)
 */
QueryGraph.QueryManager.prototype.addEdge = function(edge, startNodeVarName, endNode, nodeOptional)
{
  // Init end node var name
  let endNodeVarName = this.getNodeVarName(endNode);

  // add edge in query
  if(edge.type == QueryGraph.Edge.Type.FIXED)
  {
    let uri = edge.uri;
    if(uri.startsWith("http"))
    {
      uri = "<" + uri + ">";
    }

    if(edge.optional && !nodeOptional)
    {
      this.whereQuery +=  " OPTIONAL { " + startNodeVarName + " " + uri + " " + endNodeVarName + " } . ";
    }
    else
    {
      this.whereQuery +=  startNodeVarName + " " + uri + " " + endNodeVarName + " . ";
    }
  }
  else if(edge.type == QueryGraph.Edge.Type.VARIABLE)
  {
    let name = "?" + edge.name;

    if(edge.optional && !nodeOptional)
    {
      this.whereQuery +=  " OPTIONAL { " + startNodeVarName + " " + name + " " + endNodeVarName + " } . ";
    }
    else
    {
      this.whereQuery +=  startNodeVarName + " " + name + " " + endNodeVarName + " . ";
    }

    // Add edge variable name to select
    this.selectVars.push({"value" : edge.name, "elementType" : QueryGraph.Element.TYPE.EDGE});

    this.selectQuery += name + " ";

    /*
    if(QueryGraph.Config.displayLabel)
    {
      this.selectVars.push(edge.name + "Label");
      this.selectQuery += name + "Label ";
    }
    */
  }
};

/**
 * Get the node var name 
 * @param {QueryGraph.Node}            node                    The node
 */
QueryGraph.QueryManager.prototype.getNodeVarName = function(node)
{
  let varName = "";
  if(node.type == QueryGraph.Node.Type.ELEMENT)
  {
    varName = "?" + node.elementInfos.name;
  }
  else if(node.type == QueryGraph.Node.Type.DATA)
  { 
    varName = node.dataInfos.uri;

    if(varName.startsWith("http"))
    {
      varName = "<" + varName + ">";
    }
  }
  return varName;
};