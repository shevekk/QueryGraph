
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
    types[QueryGraph.Data.NodeType.ELEMENT] = "Element";
    types[QueryGraph.Data.NodeType.DATA] = "Données";
    types[QueryGraph.Data.NodeType.FILTER] = "Filtre";

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
   * @param {QueryGraph.Data.Node}                      node              The selected node
   */
  updateContent(type, node)
  {
    let me = this;
    let content = "";

    if(type == QueryGraph.Data.NodeType.ELEMENT)
    {
      content += '<br/>';
      content += '<div id='+QueryGraph.UI.UIElement.DESCRIPTION_DIV_ID+'><i>Noeud représentant une donnée variable avec un type de donnée prédéfinie.</i></div>';
      content += '<br/>';

      content += '<div id='+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_DIV_ID+'><label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID+'">Type prédéfini :</label><select id="'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID+'" name="'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID+'" class="'+QueryGraph.UI.UIElement.SELECT_CLASS+'"></select><br></div>';

      content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.SEARCH_HTML_ID+'">Recherche du type :</label><input type="text" id="'+QueryGraph.UI.UIElement.SEARCH_HTML_ID+'" name="'+QueryGraph.UI.UIElement.SEARCH_HTML_ID+'" class="'+QueryGraph.UI.UIElement.SELECT_CLASS+'" value="">';
      content += '<button id="'+QueryGraph.UI.UIElement.SEARCH_BUTTON_HTML_ID+'">OK</button><br/>';
      content += '<div id="'+QueryGraph.UI.UIElement.SEARCH_DIV_ID+'"></div><br/>';
      content += '<br/>';
      
      content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.NAME_HTML_ID+'">Nom:</label><input type="text" id="'+QueryGraph.UI.UIElement.NAME_HTML_ID+'" name="'+QueryGraph.UI.UIElement.NAME_HTML_ID+'" class="'+QueryGraph.UI.UIElement.TEXT_FIELD_CLASS+'" value="'+ node.elementInfos.name +'"><br>';
      content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.LABEL_HTML_ID+'">Label du type :</label><input type="text" id="'+QueryGraph.UI.UIElement.LABEL_HTML_ID+'" name="'+QueryGraph.UI.UIElement.LABEL_HTML_ID+'" class="'+QueryGraph.UI.UIElement.TEXT_FIELD_CLASS+'" value="'+ node.elementInfos.label +'"><br>';
      content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.URI_HTML_ID+'">URI du type:</label><input type="text" id="'+QueryGraph.UI.UIElement.URI_HTML_ID+'" name="'+QueryGraph.UI.UIElement.URI_HTML_ID+'" class="'+QueryGraph.UI.UIElement.TEXT_FIELD_CLASS+'" value="'+ node.elementInfos.uri +'"><br>';
    
      content += '<br/><div><input type="checkbox" id="'+QueryGraph.UI.UIElement.SUBCLASS_HTML_ID+'" name="'+QueryGraph.UI.UIElement.SUBCLASS_HTML_ID+'" class="'+QueryGraph.UI.UIElement.CHECKBOX_CLASS+'"><label for="'+QueryGraph.UI.UIElement.SUBCLASS_HTML_ID+'">Récupérer sous classes</label></div>';
    }
    else if(type == QueryGraph.Data.NodeType.DATA)
    {
      content += '<br/>';
      content += '<div id='+QueryGraph.UI.UIElement.DESCRIPTION_DIV_ID+'><i>Noeud correspondant à une donnée fixe.</i></div>';
      content += '<br/>';

      content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.SEARCH_HTML_ID+'">Recherche:</label><input type="text" id="'+QueryGraph.UI.UIElement.SEARCH_HTML_ID+'" name="'+QueryGraph.UI.UIElement.SEARCH_HTML_ID+'" class="'+QueryGraph.UI.UIElement.SELECT_CLASS+'" value="">';
      content += '<button id="'+QueryGraph.UI.UIElement.SEARCH_BUTTON_HTML_ID+'">OK</button><br/>';
      content += '<div id="'+QueryGraph.UI.UIElement.SEARCH_DIV_ID+'"></div><br/>';
      content += '<br/>';
      
      content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.LABEL_HTML_ID+'">Label:</label><input type="text" id="'+QueryGraph.UI.UIElement.LABEL_HTML_ID+'" name="'+QueryGraph.UI.UIElement.LABEL_HTML_ID+'" class="'+QueryGraph.UI.UIElement.TEXT_FIELD_CLASS+'" value="'+ node.dataInfos.label +'"><br>';
      content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.URI_HTML_ID+'">URI:</label><input type="text" id="'+QueryGraph.UI.UIElement.URI_HTML_ID+'" name="'+QueryGraph.UI.UIElement.URI_HTML_ID+'" class="'+QueryGraph.UI.UIElement.TEXT_FIELD_CLASS+'" value="'+ node.dataInfos.uri +'"><br>';
    }
    else if(type == QueryGraph.Data.NodeType.FILTER)
    {
      content += '<br/>';
      content += '<div id='+QueryGraph.UI.UIElement.DESCRIPTION_DIV_ID+'><i>Noeud permettant de filtrer les données.</i></div>';
      content += '<br/>';

      content += '<div><label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID+'">Opérateurs :</label><select id="'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID+'" name="'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID+'" class="'+QueryGraph.UI.UIElement.SELECT_CLASS+'">';
      content += '</select><br></div>';

      content += '<div><label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.VALUE_TYPE_HTML_ID+'">Type de valeurs :</label><select id="'+QueryGraph.UI.UIElement.VALUE_TYPE_HTML_ID+'" name="'+QueryGraph.UI.UIElement.VALUE_TYPE_HTML_ID+'" class="'+QueryGraph.UI.UIElement.SELECT_CLASS+'">';
      content += '   <option value="'+QueryGraph.Data.NodeFilterValueType.NUMBER+'">Nombre</option>';
      content += '   <option value="'+QueryGraph.Data.NodeFilterValueType.TEXT+'">Texte</option>';
      content += '   <option value="'+QueryGraph.Data.NodeFilterValueType.DATE+'">Date</option>';
      content += '</select><br></div>';

      content += '<label class="'+QueryGraph.UI.UIElement.TEXT_FIELD_LABEL_CLASS+'" for="'+QueryGraph.UI.UIElement.VALUE_HTML_ID+'">Valeurs:</label><input type="text" id="'+QueryGraph.UI.UIElement.VALUE_HTML_ID+'" name="'+QueryGraph.UI.UIElement.VALUE_HTML_ID+'" class="'+QueryGraph.UI.UIElement.TEXT_FIELD_CLASS+'" value="'+ node.filterInfos.value +'"><br>';
    }

    if(type != QueryGraph.Data.NodeType.FILTER)
    {
      content += '<br/><a href="" id="'+QueryGraph.UI.UIElement.WEB_LINK_HTML_ID+'" target="_blank">Lien vers la page</a>';
    }

    $("#"+QueryGraph.UI.UIElement.CONTENT_HTML_ID).html(content);

    if(type == QueryGraph.Data.NodeType.DATA)
    {
      me.getWebLink(node.dataInfos.uri);

      me.menageSearch(type);
    }
    else if(type == QueryGraph.Data.NodeType.ELEMENT)
    {
      me.getWebLink(node.elementInfos.uri);

      me.menageChoiseList();
      me.menageSearch(type);

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
      $("#" + QueryGraph.UI.UIElement.SEARCH_DIV_ID).html("");

      let searchValue = $("#"+QueryGraph.UI.UIElement.SEARCH_HTML_ID).val();

      if(type == QueryGraph.Data.NodeType.DATA)
      {
        me.dataCollector.getNodesTypes(searchValue, function(results)
        {
          displaySearchResult(results);
        });
      }
      else if(type == QueryGraph.Data.NodeType.ELEMENT)
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

          let content = "<div class='" + QueryGraph.UI.UIElement.SEARCH_DIV_LINE_CLASS + "' uri='"+uri+"' label='"+label+"'><b>" + label + " (" + key + ")</b> : " + description + "<br/></div>";

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
  menageChoiseList()
  {
    let me = this;

    me.dataCollector.getNodesTypesList(function(nodesValues, nodesLabels)
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
    $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(QueryGraph.Data.NodeFilterOperator.EQUAL, "="));

    if(valueType == QueryGraph.Data.NodeFilterValueType.NUMBER)
    {
      $('#'+QueryGraph.UI.UIElement.VALUE_HTML_ID).attr("type", "text");

      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(">", QueryGraph.Data.NodeFilterOperator.SUPERIOR));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option("<", QueryGraph.Data.NodeFilterOperator.INFERIOR));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(">=", QueryGraph.Data.NodeFilterOperator.SUPERIOR_OR_EQUAL));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option("<=", QueryGraph.Data.NodeFilterOperator.INFERIOR_OR_EQUAL));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option("IN", QueryGraph.Data.NodeFilterOperator.IN));
    }
    else if(valueType == QueryGraph.Data.NodeFilterValueType.TEXT)
    {
      $('#'+QueryGraph.UI.UIElement.VALUE_HTML_ID).attr("type", "text");

      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option("Contient", QueryGraph.Data.NodeFilterOperator.CONTAINS));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option("Commence par", QueryGraph.Data.NodeFilterOperator.STRSTARTS));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option("Termine par", QueryGraph.Data.NodeFilterOperator.STRENDS));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option("IN", QueryGraph.Data.NodeFilterOperator.IN));
    }
    else if(valueType == QueryGraph.Data.NodeFilterValueType.DATE)
    {
      $('#'+QueryGraph.UI.UIElement.VALUE_HTML_ID).attr("type", "date");

      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(">", QueryGraph.Data.NodeFilterOperator.SUPERIOR));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option("<", QueryGraph.Data.NodeFilterOperator.INFERIOR));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option(">=", QueryGraph.Data.NodeFilterOperator.SUPERIOR_OR_EQUAL));
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).append(new Option("<=", QueryGraph.Data.NodeFilterOperator.INFERIOR_OR_EQUAL));
    }

    if($("#"+QueryGraph.UI.UIElement.OPERATORS_HTML_ID + " option[value='" + oldValue + "']").length !== 0)
    {
      $('#'+QueryGraph.UI.UIElement.OPERATORS_HTML_ID).val(oldValue);
    }
  }
}