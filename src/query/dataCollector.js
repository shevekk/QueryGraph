
if (typeof QueryGraph.Query == 'undefined') {
  QueryGraph.Query = {};
}

/**
 * Class for menage get data for graph creation
 */
QueryGraph.Query.DataCollector = class DataCollector 
{
  constructor() 
  {

  }

  /**
   * Get edge types 
   * @param {String}           linkedNodeType          Type of the linked node
   */
  getEdges(linkedNodeType, callback)
  {

  };

  /**
   * Get the list of types of nodes
   */
  getNodesTypesList()
  {

  };

  /**
   * Get types of nodes from name
   * @param {String}           name          The target name
   */
  getNodesTypes(name)
  {

  };

  /**
   * Get data of nodes from name
   * @param {String}           name          The target name
   */
  getNodesData(name)
  {

  };

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




