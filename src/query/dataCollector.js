
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
   * Get edge types possible for the linked node type
   * @param {String}           linkedNodeType          Type of the linked node
   * @param {String}           linkedNodeUri           URI of the linked node
   * @param {Function}         callback                Callback with type URI and type label
   */
  getEdges(linkedNodeType, linkedNodeUri, callback)
  {

  }

  /**
   * Get the list of types of nodes
   * @param {String}           nodeType             Type of the node
   * @param {Function}         callback             Callback with values keys list and values list in params
   */
  getNodesPredefinedValues(nodeType, callback)
  {
    let keysList = [];
    let valuesList = [];
    let baseList = [];

    if(nodeType == QueryGraph.Data.NodeType.ELEMENT)
    {
      baseList = QueryGraph.Config.Config.getNodeTypes();
    }
    else if(nodeType == QueryGraph.Data.NodeType.DATA)
    {
      baseList = QueryGraph.Config.Config.getNodePredefinedDatas();
    }

    for (const key in baseList)
    {
      let value = baseList[key];

      valuesList.push(value);
      keysList.push(key);
    }

    callback(keysList, valuesList);
  }

  /**
   * Get types of nodes from name
   * @param {String}           name          The target name
   */
  getNodesTypes(name)
  {
    
  }

  /**
   * Get data of nodes from name
   * @param {String}           name          The target name
   */
  getNodesData(name)
  {
    
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




