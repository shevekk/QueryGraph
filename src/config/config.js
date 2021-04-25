
if (typeof QueryGraph.Config == 'undefined') {
  QueryGraph.Config = {};
}

/**
 * Class for manage config
 */
QueryGraph.Config.Config = class Config 
{
  /**
   * @property {Object}                                      defaultConfigFileURL                Default url and name of the default config file
   * @property {Object}                                      lang                                The QueryGraph selected language
   */
  static defaultConfigFileURL = "config/config.json";
  static lang;

  /**
   * Main parameters
   * @property {String}                                      homePage                            The home page url (open with clic in home icon)
   * @property {String}                                      endPoint                            The SPARQL EndPoint adresse
   * @property {QueryGraph.Config.TripleStoreType}           tripleStore                         Type of Triplestore
   * @property {String}                                      dataFileUrl                         Name of the file containing the predefined queries 
   * @property {Object}                                      queryInEndPointLink                 URL of the endpoint for link of query in the endPoint
   * @property {String}                                      typeUri                             URI of the type 
   * @property {String}                                      subclassUri                         URI of the subclass 
   * @property {Object}                                      nodeFilterDateEnable                Define if the creation of date filter node is possible
   * @property {Number}                                      limit                               Limit of result (null for no limit)
   * @property {String}                                      queryLanguage                       Language of the request (for labels)
   * @property {String}                                      graph                               Graphes informations
   */
  static main = class Main
  {
    static homePage;
    static endPoint;
    static tripleStore;
    static dataFileUrl;
    static queryInEndPointLink;
    static typeUri;
    static subclassUri;
    static nodeFilterDateEnable;
    static limit;
    static graph;
  }

  /**
   * Languages parameters
   * @property {Object}                                      default                             The QueryGraph default language
   * @property {Object}                                      select                              The language selector (icon)
   * @property {String}                                      query                               Language of the request (for labels)
   */
  static langParams = class Lang
  {
    static default;
    static select;
    static query;
  }

  /**
   * Labels parameters
   * @property {Boolean}                                     enable                              State of display label
   * @property {Object}                                      properties                          Properties get in query for display label
   */
  static label = class Label
  {
    static enable;
    static properties;
  }

  /**
   * @property {Object}                                      prefix                              The prefix of triplestore
   * @property {Object}                                      nodeTypes                           List of possible node type
   * @property {Object}                                      nodeData                            List of possible node data preselected
   * @property {Object}                                      wikidataSearch                      Wikidata search options
   * @property {Object}                                      infos                               The infos with contact and help urls
   * @property {Object}                                      searchAndListDisplayState           Define visibility of UI search bar and select list
   * @property {Object}                                      edgesValuesByElementNodeType        List for possible edges values for all node types
   * @property {Object}                                      icons                               List for icons for node types
   * @property {String}                                      fileName                            Name of the config file
   */
  static prefix;
  static wikidataSearch;
  static nodeTypes;
  static nodeData;
  static infos;
  static searchAndListDisplayState;
  static edgesValuesByElementNodeType;
  static icons;
  static fileName;

  constructor() 
  {

  }

  /**
   * Set QueryGraph language
   * @param {String}       lang       The file name
   */
  static setLang(lang)
  {
    QueryGraph.Config.Config.lang = lang;
  }

  /**
   * Load config informations
   * @param {String}       fileName       The file name
   * @param {function}     callback       The callback
   */
  static load(fileName, callback)
  {
    let jqxhr = $.getJSON(fileName, null)
    .done(function(content)
    {
      QueryGraph.Config.Config.fileName = fileName;
      QueryGraph.Config.Config.main = content.main;
      QueryGraph.Config.Config.langParams = content.langParams;
      QueryGraph.Config.Config.prefix = content.prefix;
      QueryGraph.Config.Config.wikidataSearch = content.wikidataSearch;
      QueryGraph.Config.Config.nodeTypes = content.nodeTypes;
      QueryGraph.Config.Config.nodeData = content.nodeData;
      QueryGraph.Config.Config.infos = content.infos;
      QueryGraph.Config.Config.searchAndListDisplayState = content.searchAndListDisplayState;
      QueryGraph.Config.Config.edgesValuesByElementNodeType = content.edgesValuesByElementNodeType;
      QueryGraph.Config.Config.label = content.label;
      QueryGraph.Config.Config.icons = content.icons;

      if(QueryGraph.Config.Config.lang == null)
      {
        QueryGraph.Config.Config.lang = QueryGraph.Config.Config.langParams.default;
      }

      callback();
    })
    .fail(function(d, textStatus, error)
    {
      alert("Echec du chargement du fichier de configuration " + fileName);

      // Load default config if is not
      if(fileName != QueryGraph.Config.Config.defaultConfigFileURL)
      {
        QueryGraph.Config.Config.load(QueryGraph.Config.Config.defaultConfigFileURL, function()
        {
          callback();
        });
      }

      console.error("getJSON failed, status: " + textStatus + ", error: "+error);
    })
    .always(function()
    {

    });
  }

  /**
   * Get the request language
   * @return {String}                  The language
   */
  static getQueryLanguage()
  {
    return QueryGraph.Config.Config.langParams.query[QueryGraph.Config.Config.lang];
  }

  /**
   * Get the search language
   * @return {String}                  The language
   */
  static getSearchLanguage()
  {
    return QueryGraph.Config.Config.wikidataSearch.language[QueryGraph.Config.Config.lang];
  }

  /**
   * Get the Node predefined types
   * @return {String}                  The language
   */
  static getNodeTypes()
  {
    return QueryGraph.Config.Config.nodeTypes[QueryGraph.Config.Config.lang];
  }

  /**
   * Get the Node predefined data
   * @return {String}                  The language
   */
  static getNodePredefinedDatas()
  {
    return QueryGraph.Config.Config.nodeData[QueryGraph.Config.Config.lang];
  }

  /**
   * Get the Url of the contact page
   * @return {String}                  The url of contact page
   */
  static getContactPageUrl()
  {
    let contactUrl = QueryGraph.Config.Config.infos.contactUrl;
    contactUrl = contactUrl.replace("{lang}", QueryGraph.Config.Config.lang);

    return contactUrl;
  }

  /**
   * Get the Url of the help page
   * @return {String}                  The url of help page
   */
  static getHelpPageUrl()
  {
    let helpUrl = QueryGraph.Config.Config.infos.helpUrl;
    helpUrl = helpUrl.replace("{lang}", QueryGraph.Config.Config.lang);

    return helpUrl;
  }

  /**
   * Verify if two uri are same (with prefix)
   * @param {String}       uri1       First uri to compare
   * @param {String}       uri2       Second uri to compare
   */
  static checkSameUri(uri1, uri2)
  {
    if(uri1.startsWith("http"))
    {
      for (let key in QueryGraph.Config.Config.prefix)
      {
        uri1 = uri1.replace(QueryGraph.Config.Config.prefix[key], key + ":")
      }
    }

    if(uri2.startsWith("http"))
    {
      for (let key in QueryGraph.Config.Config.prefix)
      {
        uri2 = uri2.replace(QueryGraph.Config.Config.prefix[key], key + ":")
      }
    }

    if(uri1 == uri2)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
}