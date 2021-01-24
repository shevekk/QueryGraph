
if (typeof QueryGraph.UI == 'undefined') {
  QueryGraph.UI = {};
}

/**
 * Class for ui node
 */
QueryGraph.UI.UINode = class UINode extends QueryGraph.UI.UIElement
{
  constructor() 
  {
    super();
    /**
     * @param {QueryGraph.Data.Node}                     node                 The selected node
     */
    this.node;
  }

  /*
   * Get types list
   * @param {QueryGraph.Data.Node}      node                   The selected npde
   * @return {String[]}                 The list of types
   */
  getTypes(node)
  {
    let types = {};
    types[QueryGraph.Data.NodeType.ELEMENT] = QueryGraph.Dictionary.Dictionary.get("NODE_TYPE_ELEMENT");
    types[QueryGraph.Data.NodeType.DATA] = QueryGraph.Dictionary.Dictionary.get("NODE_TYPE_DATA");
    types[QueryGraph.Data.NodeType.FILTER] = QueryGraph.Dictionary.Dictionary.get("NODE_TYPE_FILTER");

    return types;
  }

  /*
   * Update selected node
   * @param {QueryGraph.Data.Node}                      node              The selected node
   */
  getSelectElement(node)
  {
    this.node = node;
  }

  /**
   * Update params contenent by type of node
   * @param {QueryGraph.Data.NodeType}                 type              The type of the node
   * @param {QueryGraph.Data.Node}                     node              The selected node
   */
  updateContent(type, node)
  {
    let me = this;
    let content = "";

    if(type == QueryGraph.Data.NodeType.ELEMENT)
    {
      content += '<br/>';
      content += '<div id='+QueryGraph.UI.UIElement.DESCRIPTION_DIV_ID+'><i>'+QueryGraph.Dictionary.Dictionary.get("NODE_TYPE_ELEMENT_DESC")+'</i></div>';
      content += '<br/>';

      if(QueryGraph.Config.Config.searchAndListDisplayState.node.element.list)
      {
        content += '<div id='+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_DIV_ID+'><label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_PREDEFINED_TYPE")+'</label><select id="'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID+'" name="'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID+'" class="'+QueryGraph.UI.UIElement.SELECT_CLASS+'"></select><br></div>';
      }

      if(QueryGraph.Config.Config.searchAndListDisplayState.node.element.search)
      {
        content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.SEARCH_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_SEARCH_TYPE")+'</label><input type="text" id="'+QueryGraph.UI.UIElement.SEARCH_HTML_ID+'" name="'+QueryGraph.UI.UIElement.SEARCH_HTML_ID+'" class="'+QueryGraph.UI.UIElement.SELECT_CLASS+'" value="">';
        content += '<button id="'+QueryGraph.UI.UIElement.SEARCH_BUTTON_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("OK_BUTTON_NAME")+'</button><br/>';
        content += '<div id="'+QueryGraph.UI.UIElement.SEARCH_DIV_ID+'"></div><br/>';
      }

      content += '<br/>';
      content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.NAME_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_NAME")+'</label><input type="text" id="'+QueryGraph.UI.UIElement.NAME_HTML_ID+'" name="'+QueryGraph.UI.UIElement.NAME_HTML_ID+'" class="'+QueryGraph.UI.UIElement.TEXT_FIELD_CLASS+'" value="'+ node.elementInfos.name +'"><br>';
      content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.LABEL_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_TYPE_LABEL")+'</label><input type="text" id="'+QueryGraph.UI.UIElement.LABEL_HTML_ID+'" name="'+QueryGraph.UI.UIElement.LABEL_HTML_ID+'" class="'+QueryGraph.UI.UIElement.TEXT_FIELD_CLASS+'" value="'+ node.elementInfos.label +'"><br>';
      content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.URI_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_TYPE_URI")+'</label><input type="text" id="'+QueryGraph.UI.UIElement.URI_HTML_ID+'" name="'+QueryGraph.UI.UIElement.URI_HTML_ID+'" class="'+QueryGraph.UI.UIElement.TEXT_FIELD_CLASS+'" value="'+ node.elementInfos.uri +'"><br>';
    
      if(QueryGraph.Config.Config.subclassUri)
      {
        content += '<br/><div><input type="checkbox" id="'+QueryGraph.UI.UIElement.SUBCLASS_HTML_ID+'" name="'+QueryGraph.UI.UIElement.SUBCLASS_HTML_ID+'" class="'+QueryGraph.UI.UIElement.CHECKBOX_CLASS+'"><label for="'+QueryGraph.UI.UIElement.SUBCLASS_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_GET_SUBCLASS")+'</label></div>';
      }
    }
    else if(type == QueryGraph.Data.NodeType.DATA)
    {
      content += '<br/>';
      content += '<div id='+QueryGraph.UI.UIElement.DESCRIPTION_DIV_ID+'><i>'+QueryGraph.Dictionary.Dictionary.get("NODE_TYPE_DATA_DESC")+'</i></div>';
      content += '<br/>';

      if(QueryGraph.Config.Config.searchAndListDisplayState.node.data.list)
      {
        content += '<div id='+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_DIV_ID+'><label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_PREDEFINED_VALUES")+'</label><select id="'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID+'" name="'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID+'" class="'+QueryGraph.UI.UIElement.SELECT_CLASS+'"></select><br></div>';
      }

      if(QueryGraph.Config.Config.searchAndListDisplayState.node.data.search)
      {
        content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.SEARCH_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_SEARCH_TYPE")+'</label><input type="text" id="'+QueryGraph.UI.UIElement.SEARCH_HTML_ID+'" name="'+QueryGraph.UI.UIElement.SEARCH_HTML_ID+'" class="'+QueryGraph.UI.UIElement.SELECT_CLASS+'" value="">';
        content += '<button id="'+QueryGraph.UI.UIElement.SEARCH_BUTTON_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("OK_BUTTON_NAME")+'</button><br/>';
        content += '<div id="'+QueryGraph.UI.UIElement.SEARCH_DIV_ID+'"></div><br/>';
      }
      
      content += '<br/>';
      content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.LABEL_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_LABEL")+'</label><input type="text" id="'+QueryGraph.UI.UIElement.LABEL_HTML_ID+'" name="'+QueryGraph.UI.UIElement.LABEL_HTML_ID+'" class="'+QueryGraph.UI.UIElement.TEXT_FIELD_CLASS+'" value="'+ node.dataInfos.label +'"><br>';
      content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.URI_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_URI")+'</label><input type="text" id="'+QueryGraph.UI.UIElement.URI_HTML_ID+'" name="'+QueryGraph.UI.UIElement.URI_HTML_ID+'" class="'+QueryGraph.UI.UIElement.TEXT_FIELD_CLASS+'" value="'+ node.dataInfos.uri +'"><br>';
    }
    else if(type == QueryGraph.Data.NodeType.FILTER)
    {
      content += '<br/>';
      content += '<div id='+QueryGraph.UI.UIElement.DESCRIPTION_DIV_ID+'><i>'+QueryGraph.Dictionary.Dictionary.get("NODE_TYPE_FILTER_DESC")+'</i></div>';
      content += '<br/>';

      content += '<div><label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_OPERATORS")+'</label><select id="'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID+'" name="'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID+'" class="'+QueryGraph.UI.UIElement.SELECT_CLASS+'">';
      content += '</select><br></div>';

      content += '<div><label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.VALUE_TYPE_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_VALUES_TYPES")+'</label><select id="'+QueryGraph.UI.UIElement.VALUE_TYPE_HTML_ID+'" name="'+QueryGraph.UI.UIElement.VALUE_TYPE_HTML_ID+'" class="'+QueryGraph.UI.UIElement.SELECT_CLASS+'">';
      content += '   <option value="'+QueryGraph.Data.NodeFilterValueType.NUMBER+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_VALUES_TYPES_NUMBER")+'</option>';
      content += '   <option value="'+QueryGraph.Data.NodeFilterValueType.TEXT+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_VALUES_TYPES_TEXT")+'</option>';
      if(QueryGraph.Config.Config.nodeFilterDateEnable)
      {
        content += '   <option value="'+QueryGraph.Data.NodeFilterValueType.DATE+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_VALUES_TYPES_DATE")+'</option>';
      }
      content += '</select><br></div>';

      content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.VALUE_HTML_ID+'">'+QueryGraph.Dictionary.Dictionary.get("NODE_VALUE")+'</label><input type="text" id="'+QueryGraph.UI.UIElement.VALUE_HTML_ID+'" name="'+QueryGraph.UI.UIElement.VALUE_HTML_ID+'" class="'+QueryGraph.UI.UIElement.TEXT_FIELD_CLASS+'" value="'+ node.filterInfos.value +'"><br>';
    }

    if(type != QueryGraph.Data.NodeType.FILTER)
    {
      content += '<br/><a href="" id="'+QueryGraph.UI.UIElement.WEB_LINK_HTML_ID+'" target="_blank">'+QueryGraph.Dictionary.Dictionary.get("LINK_TO_WEB_PAGE")+'</a>';
    }

    $("#"+QueryGraph.UI.UIElement.CONTENT_HTML_ID).html(content);

    if(type == QueryGraph.Data.NodeType.DATA)
    {
      me.getWebLink(node.dataInfos.uri);

      if(QueryGraph.Config.Config.searchAndListDisplayState.node.data.list)
      {
        me.menageChoiseList(type);
      }
      if(QueryGraph.Config.Config.searchAndListDisplayState.node.data.search)
      {
        me.menageSearch(type);
      }
    }
    else if(type == QueryGraph.Data.NodeType.ELEMENT)
    {
      me.getWebLink(node.elementInfos.uri);

      if(QueryGraph.Config.Config.searchAndListDisplayState.node.element.list)
      {
        me.menageChoiseList(type);
      }
      if(QueryGraph.Config.Config.searchAndListDisplayState.node.element.search)
      {
        me.menageSearch(type);
      }

      if(node.elementInfos.subclass)
      {
        $("#"+QueryGraph.UI.UIElement.SUBCLASS_HTML_ID).prop("checked", true);
      }
      else
      {
        $("#"+QueryGraph.UI.UIElement.SUBCLASS_HTML_ID).prop("checked", false);
      }
    }
    else if(type == QueryGraph.Data.NodeType.FILTER)
    {
      $('#' + QueryGraph.UI.UIElement.VALUE_TYPE_HTML_ID).val(node.filterInfos.valueType);

      me.updateFilterOperatorsList(node.filterInfos.operator);

      $('#'+QueryGraph.UI.UIElement.VALUE_TYPE_HTML_ID).change(function() 
      {
        let oldOperator = $("#"+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).val();
        me.updateFilterOperatorsList(oldOperator);
      });

      $('#' + QueryGraph.UI.UIElement.VALUE_TYPE_HTML_ID).val(node.filterInfos.valueType);
    }

    // Menage web link
    $("#"+QueryGraph.UI.UIElement.URI_HTML_ID).change(function() {
        me.getWebLink($("#"+QueryGraph.UI.UIElement.URI_HTML_ID).val()); 
    });
  }

  /**
   * Menage action in the search toolbar
   * @param {QueryGraph.Data.NodeType}                 type              The type of the node
   */
  menageSearch(type)
  {
    let me = this;

    $("#"+QueryGraph.UI.UIElement.SEARCH_BUTTON_HTML_ID).click(function() 
    {
      $("#" + QueryGraph.UI.UIElement.SEARCH_DIV_ID).html('<b>'+QueryGraph.Dictionary.Dictionary.get("NODE_SEARCH_IN_PROGRESS")+'</b>');

      let searchValue = $("#"+QueryGraph.UI.UIElement.SEARCH_HTML_ID).val();

      if(type == QueryGraph.Data.NodeType.ELEMENT)
      {
        me.dataCollector.getNodesTypes(searchValue, function(results)
        {

          displaySearchResult(results);
        });
      }
      else if(type == QueryGraph.Data.NodeType.DATA)
      {
        me.dataCollector.getNodesData(searchValue, function(results)
        {
          displaySearchResult(results);
        });
      }

      /**
       * Display search result
       * @param {Object}                 results              Object of result
       */
      function displaySearchResult(results)
      {
        for (const key in results)
        {
          let label = results[key].label;
          let description = results[key].description;
          let uri = results[key].uri;
          let title = results[key].title;
          let content = "";

          if(description)
          {
            if(title)
            {
              content = "<div class='" + QueryGraph.UI.UIElement.SEARCH_DIV_LINE_CLASS + "' uri='"+uri+"' label='"+label+"'><b>" + label + " (" + key + ")</b> : " + description + "<br/></div>";
            }
            else
            {
              content = "<div class='" + QueryGraph.UI.UIElement.SEARCH_DIV_LINE_CLASS + "' uri='"+uri+"' label='"+label+"'><b>" + label + "</b> : " + description + "<br/></div>";
            }
          }
          else
          {
            content = "<div class='" + QueryGraph.UI.UIElement.SEARCH_DIV_LINE_CLASS + "' uri='"+uri+"' label='"+label+"'><b>" + label + "</b><br/></div>";
          }          

          $("#" + QueryGraph.UI.UIElement.SEARCH_DIV_ID).prepend(content);
        }

        // Menage click in search line : select an element
        $('.'+QueryGraph.UI.UIElement.SEARCH_DIV_LINE_CLASS).click(function()
        {
          let uri = $(this).attr("uri");

          $("#"+QueryGraph.UI.UIElement.LABEL_HTML_ID).val($(this).attr("label")); 
          $("#"+QueryGraph.UI.UIElement.URI_HTML_ID).val(uri); 

          me.getWebLink(uri);

          $("#" + QueryGraph.UI.UIElement.SEARCH_DIV_ID).html("");
        });
        
      }
    });
  }

  /**
   * Menage choise type in list
   */
  menageChoiseList(type)
  {
    let me = this;

    me.dataCollector.getNodesPredefinedValues(type, function(nodesValues, nodesLabels)
    {
      if(nodesValues.length > 0)
      {
        $('#'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID).append(new Option("", ""))

        for(let i = 0; i < nodesValues.length; i++)
        {
          $('#'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID).append(new Option(nodesLabels[i], nodesValues[i]))
        }
      }
      else
      {
        $('#'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_DIV_ID).hide();
      }
    });

    // Choise a element --> Update label and URI fields
    $('#'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID).change(function() 
    {
      let label = $( '#'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID + ' option:selected' ).text();
      let val = $( this ).val();

      $('#'+QueryGraph.UI.UIElement.LABEL_HTML_ID).val(label);
      $('#'+QueryGraph.UI.UIElement.URI_HTML_ID).val(val);

      me.getWebLink(val);
    });
  }

  /**
   * Set informations from form to the node
   * @param {QueryGraph.Data.Graph}                     graph                 The graph manager
   */
  setNodeInformations(graph)
  {
    let elements = {};

    let type = $("#"+QueryGraph.UI.UIElement.TYPE_SELECT_HTML_ID).val();
    this.node.setType(type, graph);

    if(type == QueryGraph.Data.NodeType.ELEMENT)
    {
      let label = $("#"+QueryGraph.UI.UIElement.LABEL_HTML_ID).val();
      let uri = $("#"+QueryGraph.UI.UIElement.URI_HTML_ID).val();
      let name = $("#"+QueryGraph.UI.UIElement.NAME_HTML_ID).val();
      let subclass = $("#"+QueryGraph.UI.UIElement.SUBCLASS_HTML_ID).prop('checked');

      this.node.setElementInfos(label, uri, name, subclass, graph);
    }
    else if(type == QueryGraph.Data.NodeType.DATA)
    {
      let label = $("#"+QueryGraph.UI.UIElement.LABEL_HTML_ID).val();
      let uri = $("#"+QueryGraph.UI.UIElement.URI_HTML_ID).val();

      this.node.setDataInfos(label, uri, graph);
    }
    else if(type == QueryGraph.Data.NodeType.FILTER)
    {
      let operator = $("#"+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).val();
      let valueType = $("#"+QueryGraph.UI.UIElement.VALUE_TYPE_HTML_ID).val();
      let value = $("#"+QueryGraph.UI.UIElement.VALUE_HTML_ID).val();

      this.node.setFilterInfos(operator, valueType, value, graph);
    }
  }

  /**
   * Update filter operators list
   * @param {String}                     oldValue                 old operator value
   */
  updateFilterOperatorsList(oldValue)
  {
    let valueType = $('#' + QueryGraph.UI.UIElement.VALUE_TYPE_HTML_ID).val();

    $("#"+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).html("");
    $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Data.NodeFilterOperator.EQUAL, QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_EQUAL")));

    if(valueType == QueryGraph.Data.NodeFilterValueType.NUMBER)
    {
      $('#'+QueryGraph.UI.UIElement.VALUE_HTML_ID).attr("type", "text");

      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_SUPERIOR"), QueryGraph.Data.NodeFilterOperator.SUPERIOR));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_INFERIOR"), QueryGraph.Data.NodeFilterOperator.INFERIOR));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_SUPERIOR_OR_EQUAL"), QueryGraph.Data.NodeFilterOperator.SUPERIOR_OR_EQUAL));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_INFERIOR_OR_EQUAL"), QueryGraph.Data.NodeFilterOperator.INFERIOR_OR_EQUAL));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_DIFFERENT"), QueryGraph.Data.NodeFilterOperator.DIFFERENT));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_IN"), QueryGraph.Data.NodeFilterOperator.IN));
    }
    else if(valueType == QueryGraph.Data.NodeFilterValueType.TEXT)
    {
      $('#'+QueryGraph.UI.UIElement.VALUE_HTML_ID).attr("type", "text");

      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_IN"), QueryGraph.Data.NodeFilterOperator.IN));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_CONTAINS"), QueryGraph.Data.NodeFilterOperator.CONTAINS));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_STRSTARTS"), QueryGraph.Data.NodeFilterOperator.STRSTARTS));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_STRENDS"), QueryGraph.Data.NodeFilterOperator.STRENDS));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_DIFFERENT"), QueryGraph.Data.NodeFilterOperator.DIFFERENT));
    }
    else if(valueType == QueryGraph.Data.NodeFilterValueType.DATE)
    {
      $('#'+QueryGraph.UI.UIElement.VALUE_HTML_ID).attr("type", "date");

      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_SUPERIOR"), QueryGraph.Data.NodeFilterOperator.SUPERIOR));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_INFERIOR"), QueryGraph.Data.NodeFilterOperator.INFERIOR));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_SUPERIOR_OR_EQUAL"), QueryGraph.Data.NodeFilterOperator.SUPERIOR_OR_EQUAL));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_INFERIOR_OR_EQUAL"), QueryGraph.Data.NodeFilterOperator.INFERIOR_OR_EQUAL));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Dictionary.Dictionary.get("NODE_FILTER_OPERATOR_DIFFERENT"), QueryGraph.Data.NodeFilterOperator.DIFFERENT));
    }

    if($("#"+QueryGraph.UI.UIElement.OPERATORS_HTML_ID + " option[value='" + oldValue + "']").length !== 0)
    {
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).val(oldValue);
    }
  }
}