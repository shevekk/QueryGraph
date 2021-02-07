
if (typeof QueryGraph.Query == 'undefined') {
  QueryGraph.Query = {};
}

/**
 * Class for menage get data for graph creation
 */
QueryGraph.Query.DataCollectorBNF = class DataCollectorBNF extends QueryGraph.Query.DataCollector 
{
  /**
   * Get edge types possible for the linked node type
   * @param {String}           linkedNodeType          Type of the linked node
   * @param {String}           linkedNodeUri           URI of the linked node
   * @param {Function}         callback                Callback with type URI and type label
   */
  getEdges(linkedNodeType, linkedNodeUri, callback)
  {
    let me = this;
    let query = "";

    if(linkedNodeType != "")
    {
      
      let edgesValues = [];
      let edgesLabels = [];

      // Replace uri by prefix for linkedNodeType
      if(linkedNodeType.startsWith("http"))
      {
        for (let key in QueryGraph.Config.Config.prefix)
        {
          linkedNodeType = linkedNodeType.replace(QueryGraph.Config.Config.prefix[key], key + ":")
        }
      }

      // Get possible edges values form config
      let egdesValuesByElementNodeType = QueryGraph.Config.Config.egdesValuesByElementNodeType[QueryGraph.Config.Config.lang][linkedNodeType];
      if(egdesValuesByElementNodeType != undefined)
      {
        for (let key in egdesValuesByElementNodeType)
        {
          edgesValues.push(key);
          edgesLabels.push(egdesValuesByElementNodeType[key]);
        }
      }

      callback(edgesValues, edgesLabels);
    }
    else if(linkedNodeUri != "")
    {
      // Get possible edges values form tripleStore
      if(linkedNodeUri.startsWith("http"))
      {
        linkedNodeUri = "<" + linkedNodeUri + ">";
      }

      query = 'SELECT ?link ';
      query += 'WHERE { ';
      query +=  ' '+linkedNodeUri+' ?link ?linkedElement ';
      query += '} ';
      query += 'GROUP BY ?link ';
    }

    if(query)
    {
      let queryURL = QueryGraph.Config.Config.main.endPoint + "?" + "query="+encodeURIComponent(query) + "&format=json";

      me.launchQuery(queryURL, function(data)
      {
        let edgesValues = [];
        let edgesLabels = [];

        if(linkedNodeUri != "")
        {
          for(let i = 0; i < data.results.bindings.length; i++)
          {
            edgesValues.push(data.results.bindings[i]["link"]["value"]);
          }

          callback(edgesValues, edgesValues);
        }
      });
    }
  }

  /**
   * Get types of nodes from name
   * @param {String}           name          The target name
   */
  getNodesTypes(name, callback)
  {
    callback([]);
  }

  /**
   * Get data of nodes from name
   * @param {String}           name                 The target name
   * @param {Function}         callback             Callback with search result in params
   */
  getNodesData(name, callback)
  {
    let me = this;
    let result = [];
    /*
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT DISTINCT ?work ?title ?description
      WHERE {
        ?work rdfs:label ?title .
        OPTIONAL { ?work dcterms:description ?description }
        FILTER(contains(STR(?title),"Les misérables")) 
      } LIMIT 15
    */
    let query = `PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT DISTINCT ?work ?title ?description
      WHERE {
        ?work rdfs:label ?title .
        OPTIONAL { ?work dcterms:description ?description }
        FILTER(contains(STR(?title),"${name}")) 
      } LIMIT 15`;

    let queryURL = QueryGraph.Config.Config.main.endPoint + "?" + "query="+encodeURIComponent(query) + "&format=json";

    me.launchQuery(queryURL, function(data)
    {
      let number = 0;

      for(let i = data.results.bindings.length-1; i >= 0; i--)
      {
        result[number] = {};
        result[number]["label"] = data.results.bindings[i]["title"]["value"];
        result[number]["uri"] = data.results.bindings[i]["work"]["value"];

        if(result[number]["description"] = data.results.bindings[i]["description"])
        {
          result[number]["description"] = data.results.bindings[i]["description"]["value"];
        }

        number ++;
      }

      /*
        PREFIX rdagroup2elements: <http://rdvocab.info/ElementsGr2/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        SELECT DISTINCT ?person ?name ?note
        WHERE {
         ?person foaf:name ?name . 
          OPTIONAL { ?person rdagroup2elements:biographicalInformation ?note }
          FILTER(contains(STR(?name),"Victor Hugo")) 
        } LIMIT 15
      */
      query = `PREFIX rdagroup2elements: <http://rdvocab.info/ElementsGr2/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        SELECT DISTINCT ?person ?name ?note
        WHERE {
         ?person foaf:name ?name . 
          OPTIONAL { ?person rdagroup2elements:biographicalInformation ?note }
          FILTER(contains(?name,"${name}")) 
        } LIMIT 15`;

      queryURL = QueryGraph.Config.Config.main.endPoint + "?" + "query="+encodeURIComponent(query) + "&format=json";

      me.launchQuery(queryURL, function(data)
      {
        for(let i = data.results.bindings.length-1; i >= 0; i--)
        {
          result[number] = {};
          result[number]["label"] = data.results.bindings[i]["name"]["value"];
          result[number]["uri"] = data.results.bindings[i]["person"]["value"];

          if(data.results.bindings[i]["note"])
          {
            result[number]["description"] = data.results.bindings[i]["note"]["value"];
          }

          number ++;
        }

        callback(result);
      });

      
    });
  }

  /**
   * Launch the query
   * @param {String}           queryURL          The URL
   * @param {Function}         callback          The callback
   */
  launchQuery(queryURL, callback)
  {
    let ajaxRequest = $.ajax({
      type: "GET",
      url:queryURL,
      dataType: 'json'
    });

    ajaxRequest.fail(function(error)
    {
      alert(error.statusText);
    });

    // Send request
    ajaxRequest.done(function(data)
    {
      callback(data);
    });
  }
}




