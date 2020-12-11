
if (typeof QueryGraph.Config == 'undefined') {
  QueryGraph.Config = {};
}

/**
 * Class for menage config
 */
QueryGraph.Config.Config = class Config 
{
  /*
   * @property {String}           endPoint            The SPARQL EndPoint adresse
   * @property {String}           typeUri             URI of the type 
   * @property {String}           subclassUri         URI of the subclass 
   * @property {Boolean}          displayLabel        True if label is display
   * @property {String}           language            Language of the request (for labels)
   * @property {Number}           limit               Limit of result (null for no limit)
   * @property {Object}           wikidataSearch      Wikidata search options
   * @property {Object}           nodeTypes           List of possible node type
   * @property {Object}           prefix              The prefix of triplestore
   */
  static endPoint;
  static typeUri;
  static displayLabel;
  static language;
  static limit;
  static wikidataSearch;
  static nodeTypes;
  static prefix;
  static subclassUri;

  constructor() 
  {

  }

  /**
   * Load config informations
   * @param {String}     fileName       The file name
   * @param {function}     callback       The callback
   */
  static load(fileName, callback)
  {
    let jqxhr = $.getJSON(fileName, null)
    .done(function(content)
    {
      QueryGraph.Config.Config.endPoint = content.endPoint;
      QueryGraph.Config.Config.typeUri = content.typeUri;
      QueryGraph.Config.Config.displayLabel = content.displayLabel;
      QueryGraph.Config.Config.language = content.language;
      QueryGraph.Config.Config.limit = content.limit;
      QueryGraph.Config.Config.wikidataSearch = content.wikidataSearch;
      QueryGraph.Config.Config.nodeTypes = content.nodeTypes;
      QueryGraph.Config.Config.prefix = content.prefix;
      QueryGraph.Config.Config.subclassUri = content.subclassUri;

      callback();
    })
    .fail(function(d, textStatus, error)
    {
      console.error("getJSON failed, status: " + textStatus + ", error: "+error);
    })
    .always(function()
    {

    });
  }
}