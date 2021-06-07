
if (typeof QueryGraph.Query == 'undefined') {
  QueryGraph.Query = {};
}

/**
 * Class for menage get data for graph creation
 */
QueryGraph.Query.dataCollectorSimogih = class dataCollectorSimogih extends QueryGraph.Query.DataCollector 
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
      SELECT ?uri ?label
      WHERE 
      {
       ?uri <http://www.w3.org/2000/01/rdf-schema#label> ?label .
       FILTER(contains(STR(?label), "Enseignement")) 
      } GROUP BY ?uri
    */
    let query = `SELECT ?uri ?label
      WHERE 
      {

        ?uri <http://www.w3.org/2000/01/rdf-schema#label> ?label .
        FILTER(contains(STR(?label),"${name}")) 
      } GROUP BY ?uri
      LIMIT 5`;
    let queryURL = QueryGraph.Config.Config.main.endPoint + "?" + "query="+encodeURIComponent(query) + "&format=json";

    me.launchQuery(queryURL, function(data)
    {
      let number = 0;

      for(let i = data.results.bindings.length-1; i >= 0; i--)
      {
        result[number] = {};
        result[number]["label"] = data.results.bindings[i]["label"]["value"];
        result[number]["uri"] = data.results.bindings[i]["uri"]["value"];

        number ++;
      }

      /*
        SELECT ?el ?label
        WHERE 
        {
          ?el sym:objectStandardName ?label .
          FILTER(contains(STR(?label),"Paris")) 
        }
      */
      let query = `SELECT ?uri ?label
        WHERE 
        {

          ?uri sym:objectStandardName ?label .
          FILTER(contains(STR(?label),"${name}")) 
        } GROUP BY ?uri
        LIMIT 20`;
      let queryURL = QueryGraph.Config.Config.main.endPoint + "?" + "query="+encodeURIComponent(query) + "&format=json";

      me.launchQuery(queryURL, function(data)
      {
        for(let i = data.results.bindings.length-1; i >= 0; i--)
        {
          result[number] = {};
          result[number]["label"] = data.results.bindings[i]["label"]["value"];
          result[number]["uri"] = data.results.bindings[i]["uri"]["value"];

          number ++;
        }

        /*
          SELECT ?uri ?label
          WHERE 
          {

            ?uri sym:knowledgeUnitStandardLabel ?label .
            FILTER(contains(STR(?label),"Paris")) 
          } GROUP BY ?uri
          LIMIT 20
        */
        query = `SELECT ?uri ?label
          WHERE 
          {

            ?uri sym:knowledgeUnitStandardLabel ?label .
            FILTER(contains(STR(?label),"${name}")) 
          } GROUP BY ?uri
          LIMIT 20`;

        queryURL = QueryGraph.Config.Config.main.endPoint + "?" + "query="+encodeURIComponent(query) + "&format=json";

        me.launchQuery(queryURL, function(data)
        {
          for(let i = data.results.bindings.length-1; i >= 0; i--)
          {
            result[number] = {};
            result[number]["label"] = data.results.bindings[i]["label"]["value"];
            result[number]["uri"] = data.results.bindings[i]["uri"]["value"];

            number ++;
          }

          callback(result);
        });
        
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
      dataType: 'jsonp'
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




