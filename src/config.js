/**
 * Class for menage config
 */
QueryGraph.Config = function()
{

}

/*
 * @property {String}           endPoint            The SPARQL EndPoint adresse
 * @property {String}           typeUri             URI of the type 
 * @property {Boolean}          displayLabel        True if label is display
 * @property {String}           language            Language of the request (for labels)
 * @property {Number}           limit               Limit of result (null for no limit)
 * @property {Object}           wikidataSearch      Wikidata search options
 * @property {Object}           nodeTypes           List of possible node type
 */
QueryGraph.Config.endPoint;
QueryGraph.Config.typeUri;
QueryGraph.Config.displayLabel;
QueryGraph.Config.language;
QueryGraph.Config.limit;
QueryGraph.Config.wikidataSearch;
QueryGraph.Config.nodeTypes;

/**
 * Load config informations
 * @param {String}     fileName       The file name
 * @param {function}     callback       The callback
 */
QueryGraph.Config.load = function(fileName, callback)
{
  let jqxhr = $.getJSON(fileName, null)
  .done(function(content)
  {
    QueryGraph.Config.endPoint = content.endPoint;
    QueryGraph.Config.typeUri = content.typeUri;
    QueryGraph.Config.displayLabel = content.displayLabel;
    QueryGraph.Config.language = content.language;
    QueryGraph.Config.limit = content.limit;
    QueryGraph.Config.wikidataSearch = content.wikidataSearch;
    QueryGraph.Config.nodeTypes = content.nodeTypes;

    callback();
  })
  .fail(function(d, textStatus, error)
  {
    console.error("getJSON failed, status: " + textStatus + ", error: "+error);
  })
  .always(function()
  {

  });
};
