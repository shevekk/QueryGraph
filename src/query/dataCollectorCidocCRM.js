
if (typeof QueryGraph.Query == 'undefined') {
  QueryGraph.Query = {};
}

/**
 * Class for menage get data for graph creation
 */
QueryGraph.Query.DataCollectorCidocCRM = class DataCollectorCidocCRM extends QueryGraph.Query.DataCollector 
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
      SELECT ?element ?label ?note
      WHERE 
      {  
        ?element <http://www.w3.org/2004/02/skos/core#prefLabel> ?label . 
        OPTIONAL { ?element <http://www.cidoc-crm.org/cidoc-crm/P3_has_note> ?note } . 
        FILTER(CONTAINS(?label, "fossé") ||  CONTAINS(?note, "fossé"))   
      }
    */
    let query = `SELECT ?element ?label ?note
      WHERE 
      {  
        ?element <http://www.w3.org/2004/02/skos/core#prefLabel> ?label . 
        OPTIONAL { ?element <http://www.cidoc-crm.org/cidoc-crm/P3_has_note> ?note } . 
        FILTER(CONTAINS(?label, "${name}") ||  CONTAINS(?note, "${name}"))   
      } LIMIT 15`;

    let queryURL = QueryGraph.Config.Config.main.endPoint + "?" + "query="+encodeURIComponent(query) + "&format=json";

    me.launchQuery(queryURL, function(data)
    {
      let number = 0;

      for(let i = data.results.bindings.length-1; i >= 0; i--)
      {
        result[number] = {};
        result[number]["label"] = data.results.bindings[i]["label"]["value"];
        result[number]["uri"] = data.results.bindings[i]["element"]["value"];

        if(data.results.bindings[i]["note"])
        {
          result[number]["description"] = data.results.bindings[i]["note"]["value"];
        }

        number ++;
      }

      callback(result);
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




