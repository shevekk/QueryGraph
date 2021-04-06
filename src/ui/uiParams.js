
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
     * @property {Boolean}                                   enable               True is the UI is currently enable (display)
     */
    this.queryManager = new QueryGraph.Query.QueryManager();
    this.enable = false;
  }

  /**
   * @property {String}             QUERY_AREA_HTML_ID                   HTML ID of the query area
   * @property {String}             CHECKBOX_SORT_ENABLE                 HTML ID of the sort enable checkbox
   * @property {String}             SELECT_SORT_VAR                      HTML ID of the sort var
   * @property {String}             SELECT_SORT_TYPE                     HTML ID of the sort type
   * @property {String}             CHECKBOX_LIMIT_ENABLE                HTML ID of the limit enable checkbox
   * @property {String}             NUMBER_FIELD_LIMIT_VAL               HTML ID of the limit val
   * @property {String}             ICON_VISIBILITY_HTML_CLASS           HTML ID of a visibility icon
   * @property {String}             ICON_VISIBILITY_HTML_BASE_ID         HTML BASE ID of a visibility icon
   * @property {String}             VISIBILITY_DIV_HTML_ID               HTML ID of the visibility zone
   */
  static QUERY_AREA_HTML_ID = "queryArea";

  static CHECKBOX_SORT_ENABLE = "enableSort";
  static SELECT_SORT_VAR = "sortVar";
  static SELECT_SORT_TYPE = "sortType";

  static CHECKBOX_LIMIT_ENABLE = "enableLimit";
  static NUMBER_FIELD_LIMIT_VAL = "limitVal";

  static ICON_VISIBILITY_HTML_CLASS = "uiIconVisibility";
  static ICON_VISIBILITY_HTML_BASE_ID = "uiIconVisibility_";
  static ICON_UP_HTML_BASE_ID = "uiIconUp_";
  static ICON_DOWN_HTML_BASE_ID = "uiIconDown_";
  static ICON_ARROW_HTML_CLASS = "uiIconArrow";

  static VISIBILITY_DIV_HTML_ID = "uiVisibilityDiv";

  /**
   * Init the view of parameters
   * @param {JQuery Element}                       html                JQuery element of the UI
   * @param {QueryGraph.Data.Graph}                graph               The graph manager
   */
  init(html, graph)
  {
    let me = this;

    me.enable = true;

    me.queryManager.buildQuery(graph)

    let query = me.queryManager.query;
    
    let content = '<div id="'+QueryGraph.UI.UIManager.DISPLAY_ZONE_HTML_ID+'">';

    // Query Params
    content += '<label for="'+QueryGraph.UI.UIParams.QUERY_AREA_HTML_ID+'"><b>'+QueryGraph.Dictionary.Dictionary.get("QUERY_LABEL")+'</b></label>';

    content += '<textarea id="'+QueryGraph.UI.UIParams.QUERY_AREA_HTML_ID+'" name="'+QueryGraph.UI.UIParams.QUERY_AREA_HTML_ID+'" rows="'+(query.split("\n").length+1)+'" readonly>';
    content += query;
    content += '</textarea>';

    if(QueryGraph.Config.Config.main.queryInEndPointLink)
    {
      let hrefInTripleStore = QueryGraph.Config.Config.main.queryInEndPointLink + encodeURIComponent(query);
      content += '<a href="'+hrefInTripleStore+'" target="_blank">'+QueryGraph.Dictionary.Dictionary.get("LINK_TO_TRIPLESTORE")+'</a>';
    }

    // Sort params
    content += '<p><b>'+QueryGraph.Dictionary.Dictionary.get("PARAMS_SORT")+'</b><br/>';
    content += '<input type="checkbox" id="'+QueryGraph.UI.UIParams.CHECKBOX_SORT_ENABLE+'" name="'+QueryGraph.UI.UIParams.CHECKBOX_SORT_ENABLE+'"><label for="'+QueryGraph.UI.UIParams.CHECKBOX_SORT_ENABLE+'">'+QueryGraph.Dictionary.Dictionary.get("PARAMS_SORT_ENABLE")+'</label><br/>';
    content += '<label for="'+QueryGraph.UI.UIParams.SELECT_SORT_VAR+'">'+QueryGraph.Dictionary.Dictionary.get("PARAMS_SORT_VAL")+'</label><select name="'+QueryGraph.UI.UIParams.SELECT_SORT_VAR+'" id="'+QueryGraph.UI.UIParams.SELECT_SORT_VAR+'"></select><br/>';
    content += '<label for="'+QueryGraph.UI.UIParams.SELECT_SORT_TYPE+'">'+QueryGraph.Dictionary.Dictionary.get("PARAMS_SORT_TYPE")+'</label><select name="'+QueryGraph.UI.UIParams.SELECT_SORT_TYPE+'" id="'+QueryGraph.UI.UIParams.SELECT_SORT_TYPE+'"><option value="'+QueryGraph.Data.ParamsSortType.INCREASING+'">Croissant</option><option value="'+QueryGraph.Data.ParamsSortType.DECREASING+'">Décroissant</option></select></p>';

    // Limit params
    content += '<p><b>'+QueryGraph.Dictionary.Dictionary.get("PARAMS_LIMIT")+'</b><br/>';
    content += '<input type="checkbox" id="'+QueryGraph.UI.UIParams.CHECKBOX_LIMIT_ENABLE+'" name="'+QueryGraph.UI.UIParams.CHECKBOX_LIMIT_ENABLE+'"><label for="'+QueryGraph.UI.UIParams.CHECKBOX_LIMIT_ENABLE+'">'+QueryGraph.Dictionary.Dictionary.get("PARAMS_LIMIT_ENABLE")+'</label><br/>';
    content += '<label for="'+QueryGraph.UI.UIParams.NUMBER_FIELD_LIMIT_VAL+'">'+QueryGraph.Dictionary.Dictionary.get("PARAMS_LIMIT_VAL")+'</label><input type="number" id="'+QueryGraph.UI.UIParams.NUMBER_FIELD_LIMIT_VAL+'" name="'+QueryGraph.UI.UIParams.NUMBER_FIELD_LIMIT_VAL+'" value="'+ graph.params.limitVal +'"></p>';

    // Select elements
    content += "<div id='"+QueryGraph.UI.UIParams.VISIBILITY_DIV_HTML_ID+"'></div>";
   
    content += '</div>';

    html.html(content);

    me.displayVisibilityZone(graph);

    // Set sort checkbox
    if(graph.params.sortEnable)
    {
      $("#"+QueryGraph.UI.UIParams.CHECKBOX_SORT_ENABLE).prop("checked", true);
    }
    else
    {
      $("#"+QueryGraph.UI.UIParams.CHECKBOX_SORT_ENABLE).prop("checked", false);
    }

    // Set sort values
    for(let i = 0; i < me.queryManager.selectVars.length; i++)
    {
      $("#"+QueryGraph.UI.UIParams.SELECT_SORT_VAR).append(new Option(me.queryManager.selectVars[i].value, me.queryManager.selectVars[i].value));
    }
    if(graph.params.sortVar)
    {
      $("#"+QueryGraph.UI.UIParams.SELECT_SORT_VAR).val(graph.params.sortVar);
    }

    // Set sort type
    $("#"+QueryGraph.UI.UIParams.SELECT_SORT_TYPE).val(graph.params.sortType);

    // Set limit checkbox
    if(graph.params.limitEnable)
    {
      $("#"+QueryGraph.UI.UIParams.CHECKBOX_LIMIT_ENABLE).prop("checked", true);
    }
    else
    {
      $("#"+QueryGraph.UI.UIParams.CHECKBOX_LIMIT_ENABLE).prop("checked", false);
    }

    // Set Limit value
    $("#"+QueryGraph.UI.UIParams.NUMBER_FIELD_LIMIT_VAL).val(graph.params.limitVal);

    // Manage events for update testareaQuery content
    $("#"+QueryGraph.UI.UIParams.CHECKBOX_SORT_ENABLE).change(function() 
    {
      me.updateTextAreaQueryContent(graph);
    });
    $("#"+QueryGraph.UI.UIParams.SELECT_SORT_VAR).change(function() 
    {
      me.updateTextAreaQueryContent(graph);
    });
    $("#"+QueryGraph.UI.UIParams.SELECT_SORT_TYPE).change(function() 
    {
      me.updateTextAreaQueryContent(graph);
    });
    $("#"+QueryGraph.UI.UIParams.CHECKBOX_LIMIT_ENABLE).change(function() 
    {
      me.updateTextAreaQueryContent(graph);
    });
    $("#"+QueryGraph.UI.UIParams.NUMBER_FIELD_LIMIT_VAL).change(function() 
    {
      me.updateTextAreaQueryContent(graph);
    });
  }

  /**
   * Init display view
   * @param {QueryGraph.Data.Graph}                graph               The graph manager
   */
  displayVisibilityZone(graph)
  {
    let me = this;
    let selectVars = me.queryManager.selectVars;

    graph.params.updateVisiblityInfosList(selectVars);

    let content = '<p><b>' + QueryGraph.Dictionary.Dictionary.get("VISIBILITY_ELEMENT_ZONE") + '</b></br>'
    for(let i = 0; i < graph.params.visibility.length; i++)
    {
      let infos = graph.params.visibility[i];
      if(infos.visibility == true)
      {
        content += '<img src="img/eye.svg" alt="Contact" id="'+QueryGraph.UI.UIParams.ICON_VISIBILITY_HTML_BASE_ID+infos.name+'" class="'+QueryGraph.UI.UIParams.ICON_VISIBILITY_HTML_CLASS+'" title="'+QueryGraph.Dictionary.Dictionary.get("ICON_VISIBLE_DESC")+'"/>';
      }
      else
      {
        content += '<img src="img/eye-slash.svg" alt="Contact" id="'+QueryGraph.UI.UIParams.ICON_VISIBILITY_HTML_BASE_ID+infos.name+'" class="'+QueryGraph.UI.UIParams.ICON_VISIBILITY_HTML_CLASS+'" title="'+QueryGraph.Dictionary.Dictionary.get("ICON_INVISIBLE_DESC")+'"/>';
      }
      content += infos.name;

      if(!infos.label)
      {
        if(i != 0)
        {
          content += '<img src="img/arrow-up.svg" alt="Contact" id="'+QueryGraph.UI.UIParams.ICON_UP_HTML_BASE_ID+infos.name+'" class="'+QueryGraph.UI.UIParams.ICON_ARROW_HTML_CLASS+'" title="'+QueryGraph.Dictionary.Dictionary.get("ICON_ARROW_UP_DESC")+'"/>';
        }
        if (i < graph.params.visibility.length -1 && !(i+1 == graph.params.visibility.length-1 && graph.params.visibility[i + 1].label))
        {
          content += '<img src="img/arrow-down.svg" alt="Contact" id="'+QueryGraph.UI.UIParams.ICON_DOWN_HTML_BASE_ID+infos.name+'" class="'+QueryGraph.UI.UIParams.ICON_ARROW_HTML_CLASS+'" title="'+QueryGraph.Dictionary.Dictionary.get("ICON_ARROW_DOWN_DESC")+'"/>';
        }
      }

      content += '<br/>';
    }
    content += '</p>';

    $("#"+QueryGraph.UI.UIParams.VISIBILITY_DIV_HTML_ID).html(content);

    // Visility action
    $("."+QueryGraph.UI.UIParams.ICON_VISIBILITY_HTML_CLASS).click(function() 
    {
      let id = $(this)[0].id;
      let name = id.split(QueryGraph.UI.UIParams.ICON_VISIBILITY_HTML_BASE_ID)[1];

      for(let i = 0; i < graph.params.visibility.length; i++)
      {
        if(name == graph.params.visibility[i].name)
        {
          graph.params.visibility[i].visibility = !graph.params.visibility[i].visibility;
        }
      }

      // Update query
      me.queryManager.buildQuery(graph)
      let query = me.queryManager.query;
      $('#' + QueryGraph.UI.UIParams.QUERY_AREA_HTML_ID).val(query);

      me.displayVisibilityZone(graph);
    });

    // Up/Down action
    $("."+QueryGraph.UI.UIParams.ICON_ARROW_HTML_CLASS).click(function() 
    {
      let id = $(this)[0].id;
      let name = "";
      let up = true;

      if(id.includes(QueryGraph.UI.UIParams.ICON_UP_HTML_BASE_ID))
      {
        name = id.split(QueryGraph.UI.UIParams.ICON_UP_HTML_BASE_ID)[1];
        up = true;
      }
      else if(id.includes(QueryGraph.UI.UIParams.ICON_DOWN_HTML_BASE_ID))
      {
        name = id.split(QueryGraph.UI.UIParams.ICON_DOWN_HTML_BASE_ID)[1];
        up = false;
      }

      graph.params.updateVisibilityOrder(name, up);

      me.displayVisibilityZone(graph);
    });
  }

  /**
   * Update the text area query content
   * @param {QueryGraph.Data.Graph}                graph               The graph manager
   */
  updateTextAreaQueryContent(graph)
  {
    this.save(graph.params);

    this.queryManager.buildQuery(graph)

    $("#" + QueryGraph.UI.UIParams.QUERY_AREA_HTML_ID).val(this.queryManager.query);
  }

  /**
   * Save the params
   * @param {QueryGraph.Data.Params}              graphParams                The graph params
   */
  save(graphParams)
  {
    graphParams.sortEnable = $("#"+QueryGraph.UI.UIParams.CHECKBOX_SORT_ENABLE).prop('checked');
    graphParams.sortVar = $("#"+QueryGraph.UI.UIParams.SELECT_SORT_VAR).val();
    graphParams.sortType = $("#"+QueryGraph.UI.UIParams.SELECT_SORT_TYPE).val();

    graphParams.limitEnable = $("#"+QueryGraph.UI.UIParams.CHECKBOX_LIMIT_ENABLE).prop('checked');
    graphParams.limitVal = $("#"+QueryGraph.UI.UIParams.NUMBER_FIELD_LIMIT_VAL).val();
  }
}