
if (typeof QueryGraph.UI == 'undefined') {
  QueryGraph.UI = {};
}

/**
 * Class for ui parameters of Queries
 */
QueryGraph.UI.UIParams = class UIParams
{
  constructor() 
  {
    /**
     * @property {QueryGraph.Query.QueryManager}             queryManager         The queryManager for create query
     */
    this.queryManager = new QueryGraph.Query.QueryManager();
  }

  /**
   * @property {String}             QUERY_AREA_HTML_ID             HTML ID of the query area
   */
  static QUERY_AREA_HTML_ID = "queryArea";

  /**
   * Init the view of parameters
   * @param {JQuery Element}                       html                JQuery element of the UI
   * @param {QueryGraph.Data.Graph}                graph               The graph manager
   */
  init(html, graph)
  {
    let me = this;

    this.queryManager.buildQuery(graph)

    let query = this.queryManager.query;

    let content = '<div id="'+QueryGraph.UI.UIManager.DISPLAY_ZONE_HTML_ID+'">';

    content += '<label for="'+QueryGraph.UI.UIParams.QUERY_AREA_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("QUERY_LABEL");

    content += '<textarea id="'+QueryGraph.UI.UIParams.QUERY_AREA_HTML_ID+'" name="'+QueryGraph.UI.UIParams.QUERY_AREA_HTML_ID+'" rows="'+(query.split("\n").length+1)+'" readonly>';
    content += query;
    content += '</textarea>';

    if(QueryGraph.Config.Config.queryInEndPointLink)
    {
      let hrefInTripleStore = QueryGraph.Config.Config.queryInEndPointLink + encodeURIComponent(query);
      content += '<a href="'+hrefInTripleStore+'" target="_blank">'+QueryGraph.Dictionary.Dictionary.get("LINK_TO_TRIPLESTORE")+'</a>';
    }
    
    content += '</div>';

    html.html(content);
  }
}