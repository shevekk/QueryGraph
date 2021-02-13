
if (typeof QueryGraph.Query == 'undefined') {
  QueryGraph.Query = {};
}

/**
 * Class for menage get data for graph creation
 */
QueryGraph.Query.DataCollectorBNF = class DataCollectorBNF extends QueryGraph.Query.DataCollector 
{
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




