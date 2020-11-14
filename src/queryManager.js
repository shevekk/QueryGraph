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
 * @property {Boolean}                validQuery            True if the query is valid and can be run
 */
QueryGraph.QueryManager.prototype.selectVars;
QueryGraph.QueryManager.prototype.query;
QueryGraph.QueryManager.prototype.selectQuery;
QueryGraph.QueryManager.prototype.whereQuery;
QueryGraph.QueryManager.prototype.validQuery;

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
  this.validQuery = false;

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

  if(this.validQuery)
  {
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
  }
  else
  {
    alert("Impossible d'envoyer la requête car elle est vide");
  }
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
    this.validQuery = true;

    let typeUri = node.elementInfos.uri;

    if(typeUri != "" || node.edges.length > 0 || node.reverseEdges.length > 0)
    {
      let nameVar = "?" + node.elementInfos.name;
      let name = node.elementInfos.name;

      this.selectVars.push(name);
      this.selectQuery += nameVar + " ";

      if(QueryGraph.Config.displayLabel)
      {
        this.selectVars.push(name + "Label");
        this.selectQuery += nameVar + "Label ";
      }
      
      if(typeUri != "")
      {
        this.whereQuery += nameVar + " " + QueryGraph.Config.typeUri + " " + typeUri + " . ";
      }

      // Add edges
      for(let j = 0; j < node.edges.length; j++)
      {
        let edge = node.edges[j];
        let endNode = graph.getNode(edge.idNodeEnd);

        this.addEdge(edge, nameVar, endNode);
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

      this.addEdge(edge, startNodeUri, endNode);
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
 */
QueryGraph.QueryManager.prototype.addEdge = function(edge, startNodeVarName, endNode)
{
  // Init end node var name
  let endNodeVarName = "";
  if(endNode.type == QueryGraph.Node.Type.ELEMENT)
  {
    endNodeVarName = "?" + endNode.elementInfos.name;
  }
  else if(endNode.type == QueryGraph.Node.Type.DATA)
  { 
    endNodeVarName = endNode.dataInfos.uri;
  }

  // add edge in query
  if(edge.type == QueryGraph.Edge.Type.FIXED)
  {
    this.whereQuery +=  startNodeVarName + " " + edge.uri + " " + endNodeVarName + " . ";
  }
  else if(edge.type == QueryGraph.Edge.Type.VARIABLE)
  {
    let name = "?" + edge.name;

    this.whereQuery +=  startNodeVarName + " " + name + " " + endNodeVarName + " . ";

    // Add edge variable name to select
    this.selectVars.push(edge.name);

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