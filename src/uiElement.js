/**
 * Class for ui element
 */
QueryGraph.UIElement = function()
{

}

/**
 * @property {QueryGraph.DataCollector}             dataCollector         The data collector
 */
QueryGraph.UIElement.prototype.dataCollector;

/**
 * @property {String}             DESCRIPTION_DIV_ID             HTML ID Of DIV fro description or element
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
QueryGraph.UIElement.DESCRIPTION_DIV_ID = "descriptionDiv";

QueryGraph.UIElement.LIST_ELEMENT_HTML_ID = "listElement";
QueryGraph.UIElement.LIST_ELEMENT_HTML_DIV_ID = "listElementDiv";

QueryGraph.UIElement.SEARCH_HTML_ID = "search";
QueryGraph.UIElement.SEARCH_BUTTON_HTML_ID = "searchButton";
QueryGraph.UIElement.SEARCH_DIV_ID = "searchDiv";
QueryGraph.UIElement.SEARCH_DIV_LINE_CLASS = "searchDivLine";

QueryGraph.UIElement.LABEL_HTML_ID = "label";
QueryGraph.UIElement.URI_HTML_ID = "uri";
QueryGraph.UIElement.NAME_HTML_ID = "name";

QueryGraph.UIElement.TYPE_SELECT_HTML_ID = "nodeType";

QueryGraph.UIElement.CONTENT_HTML_ID = "uiContent";

QueryGraph.UIElement.OPTIONAL_HTML_ID = "optional";
QueryGraph.UIElement.SUBCLASS_HTML_ID = "subclass";

QueryGraph.UIElement.WEB_LINK_HTML_ID = "webLink";



/**
 * Init UI for a node
 * @param {JQuery Element}                  html                JQuery element of the UI
 * @param {QueryGraph.Element}              nodeOrEdge          The selected node or edge
 * @param {QueryGraph.DataCollector}        dataCollector       The data collector
 */
QueryGraph.UIElement.prototype.init = function(html, nodeOrEdge, dataCollector)
{
  let me = this;
  
  me.dataCollector = dataCollector;

  me.getSelectElement(nodeOrEdge);
  let types = me.getType();

  let content = '<div id="uiDisplayZone">';

  // selection of type
  content += '<select name="'+QueryGraph.UIElement.TYPE_SELECT_HTML_ID+'" id="'+QueryGraph.UIElement.TYPE_SELECT_HTML_ID+'">';
  for (const key in types)
  {
    content += '<option value="'+key+'">'+types[key]+'</option>';
  }
  content += '</select>';

  content += "<br/>";
  content += '<div id="'+QueryGraph.UIElement.CONTENT_HTML_ID+'"></div>';
  content += "<br/>";

  content += '<button id="'+QueryGraph.UIManager.OK_BUTTON_HTML_ID+'">OK</button>';

  content += '</div>';

  html.html(content);

  $("#"+QueryGraph.UIElement.TYPE_SELECT_HTML_ID).val(nodeOrEdge.type);
  me.updateContent(nodeOrEdge.type, nodeOrEdge);

  $("#"+QueryGraph.UIElement.TYPE_SELECT_HTML_ID).change(function() 
  {
    let type = $( this ).val();
    me.updateContent(type, nodeOrEdge);
  });
};

/**
 * Init UI for a node
 * @param {String}                  uri                The element URI
 */
QueryGraph.UIElement.prototype.getWebLink = function(uri)
{
  let me = this;

  if(!uri.startsWith("http"))
  {
    for (const key in QueryGraph.Config.prefix)
    {
      if(uri.split(':')[0] == key)
      {
        uri = QueryGraph.Config.prefix[key] + uri.split(':')[1];  
      }
    }
  }

  if(uri)
  {
    $('#' + QueryGraph.UIElement.WEB_LINK_HTML_ID).attr("href", uri);
    $('#' + QueryGraph.UIElement.WEB_LINK_HTML_ID).css("visibility", "visible");
  }
  else
  {
    $('#' + QueryGraph.UIElement.WEB_LINK_HTML_ID).css("visibility", "hidden");
  }
};