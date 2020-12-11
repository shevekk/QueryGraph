if (typeof QueryGraph.UI == 'undefined') {
  QueryGraph.UI = {};
}

/**
 * Class for ui element
 */
QueryGraph.UI.UIElement = class UIElement 
{
  constructor() 
  {
    /**
     * @property {QueryGraph.Query.DataCollector}             dataCollector         The data collector
     */
    this.dataCollector;
  }

  /**
   * @property {String}             DESCRIPTION_DIV_ID             HTML ID of DIV for description or element
   * @property {String}             LIST_ELEMENT_HTML_ID           HTML ID for list of elements
   * @property {String}             LIST_ELEMENT_HTML_DIV_ID       HTML ID for the div of list of elements
   * @property {String}             SEARCH_HTML_ID                 HTML ID for search element
   * @property {String}             SEARCH_BUTTON_HTML_ID          HTML ID for search button
   * @property {String}             SEARCH_DIV_ID                  HTML ID for search result div
   * @property {String}             SEARCH_DIV_LINE_CLASS          HTML Class for a line in the search resul div
   * @property {String}             LABEL_HTML_ID                  HTML ID for Label field
   * @property {String}             URI_HTML_ID                    HTML ID for URI field
   * @property {String}             NAME_HTML_ID                   HTML ID for Name field
   * @property {String}             TYPE_SELECT_HTML_ID            HTML ID for the select of type
   * @property {String}             CONTENT_HTML_ID                HTML ID for content div
   * @property {String}             OPTIONAL_HTML_ID               HTML ID for the optional checkbox 
   * @property {String}             WEB_LINK_HTML_ID               HTML ID for web link
   * @property {String}             SUBCLASS_HTML_ID               HTML ID for get sub class of node (checkbox)
   */
  static DESCRIPTION_DIV_ID = "descriptionDiv";

  static LIST_ELEMENT_HTML_ID = "listElement";
  static LIST_ELEMENT_HTML_DIV_ID = "listElementDiv";

  static SEARCH_HTML_ID = "search";
  static SEARCH_BUTTON_HTML_ID = "searchButton";
  static SEARCH_DIV_ID = "searchDiv";
  static SEARCH_DIV_LINE_CLASS = "searchDivLine";

  static LABEL_HTML_ID = "label";
  static URI_HTML_ID = "uri";
  static NAME_HTML_ID = "name";

  static TYPE_SELECT_HTML_ID = "nodeType";

  static CONTENT_HTML_ID = "uiContent";

  static OPTIONAL_HTML_ID = "optional";
  static SUBCLASS_HTML_ID = "subclass";

  static WEB_LINK_HTML_ID = "webLink";


  /**
   * Init UI for a node
   * @param {JQuery Element}                  html                JQuery element of the UI
   * @param {QueryGraph.Data.Element}              nodeOrEdge          The selected node or edge
   * @param {QueryGraph.Query.DataCollector}        dataCollector       The data collector
   */
  init(html, nodeOrEdge, dataCollector)
  {
    let me = this;
    
    me.dataCollector = dataCollector;

    me.getSelectElement(nodeOrEdge);
    let types = me.getType();

    let content = '<div id="uiDisplayZone">';

    // selection of type
    content += '<select name="'+QueryGraph.UI.UIElement.TYPE_SELECT_HTML_ID+'" id="'+QueryGraph.UI.UIElement.TYPE_SELECT_HTML_ID+'">';
    for (const key in types)
    {
      content += '<option value="'+key+'">'+types[key]+'</option>';
    }
    content += '</select>';

    content += "<br/>";
    content += '<div id="'+QueryGraph.UI.UIElement.CONTENT_HTML_ID+'"></div>';
    content += "<br/>";

    content += '<button id="'+QueryGraph.UI.UIManager.OK_BUTTON_HTML_ID+'">OK</button>';

    content += '</div>';

    html.html(content);

    $("#"+QueryGraph.UI.UIElement.TYPE_SELECT_HTML_ID).val(nodeOrEdge.type);
    me.updateContent(nodeOrEdge.type, nodeOrEdge);

    $("#"+QueryGraph.UI.UIElement.TYPE_SELECT_HTML_ID).change(function() 
    {
      let type = $( this ).val();
      me.updateContent(type, nodeOrEdge);
    });
  }
}

;

/**
 * Init UI for a node
 * @param {String}                  uri                The element URI
 */
QueryGraph.UI.UIElement.prototype.getWebLink = function(uri)
{
  let me = this;

  if(!uri.startsWith("http"))
  {
    for (const key in QueryGraph.Config.Config.prefix)
    {
      if(uri.split(':')[0] == key)
      {
        uri = QueryGraph.Config.Config.prefix[key] + uri.split(':')[1];  
      }
    }
  }

  if(uri)
  {
    $('#' + QueryGraph.UI.UIElement.WEB_LINK_HTML_ID).attr("href", uri);
    $('#' + QueryGraph.UI.UIElement.WEB_LINK_HTML_ID).css("visibility", "visible");
  }
  else
  {
    $('#' + QueryGraph.UI.UIElement.WEB_LINK_HTML_ID).css("visibility", "hidden");
  }
};