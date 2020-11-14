/**
 * Class for menage get data for graph creation
 */
QueryGraph.DataCollector = function()
{

};

/**
 * Get edge types 
 * @param {String}           linkedNodeType          Type of the linked node
 */
QueryGraph.DataCollector.prototype.getEdges = function(linkedNodeType, callback)
{

};

/**
 * Get the list of types of nodes
 */
QueryGraph.DataCollector.prototype.getNodesTypesList = function()
{

};

/**
 * Get types of nodes from name
 * @param {String}           name          The target name
 */
QueryGraph.DataCollector.prototype.getNodesTypes = function(name)
{

};

/**
 * Get data of nodes from name
 * @param {String}           name          The target name
 */
QueryGraph.DataCollector.prototype.getNodesData = function(name)
{

};

/**
 * Launch the query
 * @param {String}           queryURL          The URL
 * @param {Function}         callback          The callback
 */
QueryGraph.DataCollector.prototype.launchQuery = function(queryURL, callback)
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