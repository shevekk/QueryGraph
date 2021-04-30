
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
    let me = this;
    let query = "";

    if(linkedNodeUri != "")
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
    //if(linkedNodeType != "")
    else
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
      let edgesValuesByElementDefault = QueryGraph.Config.Config.edgesValuesByElementNodeType[QueryGraph.Config.Config.lang]["*"];
      let edgesValuesByElementNodeType = QueryGraph.Config.Config.edgesValuesByElementNodeType[QueryGraph.Config.Config.lang][linkedNodeType];

      let edgesValuesByElement = Object.assign({}, edgesValuesByElementDefault, edgesValuesByElementNodeType);
      if(edgesValuesByElement != undefined)
      {
        for (let key in edgesValuesByElement)
        {
          edgesValues.push(key);
          edgesLabels.push(edgesValuesByElement[key]);
        }
      }

      callback(edgesValues, edgesLabels);
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
  getNodesTypes(name, callback)
  {
    callback([]);
  }

  /**
   * Get data of nodes from name
   * @param {String}           name          The target name
   */
  getNodesData(name, callback)
  {
    callback([]);
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




