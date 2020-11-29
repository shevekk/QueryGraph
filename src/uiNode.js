/**
 * Class for ui node
 */
QueryGraph.UINode = function()
{
  QueryGraph.UIElement.call(this);
};
QueryGraph.UINode.prototype = Object.create(QueryGraph.UIElement.prototype);

/**
 * @param {QueryGraph.Node}                     node                 The selected node
 */
QueryGraph.UINode.prototype.node;

/*
 * Get types list
 * @return {String[]}                 The list of types
 */
QueryGraph.UINode.prototype.getType = function()
{
  let types = {};
  types[QueryGraph.Node.Type.ELEMENT] = "Element"
  types[QueryGraph.Node.Type.DATA] = "Données"

  return types;
};

/*
 * Update selected node
 * @param {QueryGraph.Node}                      node              The selected node
 */
QueryGraph.UINode.prototype.getSelectElement = function(node)
{
  this.node = node;
};

/**
 * Update params contenent by type of node
 * @param {QueryGraph.Node.Type}                 type              The type of the node
 * @param {QueryGraph.Node}                      node              The selected node
 */
QueryGraph.UINode.prototype.updateContent = function(type, node)
{
  let me = this;
  let content = "";

  if(type == QueryGraph.Node.Type.ELEMENT)
  {
    content += '<br/>';
    content += '<div id='+QueryGraph.UIElement.DESCRIPTION_DIV_ID+'><i>Noeud représentant une donnée variable avec un type de donnée prédéfinie.</i></div>';
    content += '<br/>';

    content += '<div id='+QueryGraph.UIElement.LIST_ELEMENT_HTML_DIV_ID+'><label class="uiTextFieldLabel" for="'+QueryGraph.UIElement.LIST_ELEMENT_HTML_ID+'">Type prédéfini :</label><select id="'+QueryGraph.UIElement.LIST_ELEMENT_HTML_ID+'" name="'+QueryGraph.UIElement.LIST_ELEMENT_HTML_ID+'" class="uiSelect"></select><br></div>';

    content += '<label class="uiTextFieldLabel" for="'+QueryGraph.UIElement.SEARCH_HTML_ID+'">Recherche du type :</label><input type="text" id="'+QueryGraph.UIElement.SEARCH_HTML_ID+'" name="'+QueryGraph.UIElement.SEARCH_HTML_ID+'" class="uiSelect" value="">';
    content += '<button id="'+QueryGraph.UIElement.SEARCH_BUTTON_HTML_ID+'">OK</button><br/>';
    content += '<div id="'+QueryGraph.UIElement.SEARCH_DIV_ID+'"></div><br/>';
    content += '<br/>';
    
    content += '<label class="uiTextFieldLabel" for="'+QueryGraph.UIElement.NAME_HTML_ID+'">Nom:</label><input type="text" id="'+QueryGraph.UIElement.NAME_HTML_ID+'" name="'+QueryGraph.UIElement.NAME_HTML_ID+'" class="uiTextField" value="'+ node.elementInfos.name +'"><br>';
    content += '<label class="uiTextFieldLabel" for="'+QueryGraph.UIElement.LABEL_HTML_ID+'">Label du type :</label><input type="text" id="'+QueryGraph.UIElement.LABEL_HTML_ID+'" name="'+QueryGraph.UIElement.LABEL_HTML_ID+'" class="uiTextField" value="'+ node.elementInfos.label +'"><br>';
    content += '<label class="uiTextFieldLabel" for="'+QueryGraph.UIElement.URI_HTML_ID+'">URI du type:</label><input type="text" id="'+QueryGraph.UIElement.URI_HTML_ID+'" name="'+QueryGraph.UIElement.URI_HTML_ID+'" class="uiTextField" value="'+ node.elementInfos.uri +'"><br>';
  
    content += '<br/><div><input type="checkbox" id="'+QueryGraph.UIElement.SUBCLASS_HTML_ID+'" name="'+QueryGraph.UIElement.SUBCLASS_HTML_ID+'" class="uiCheckbox"><label for="'+QueryGraph.UIElement.SUBCLASS_HTML_ID+'">Récupérer sous classes</label></div>';
  }
  else if(type == QueryGraph.Node.Type.DATA)
  {
    content += '<br/>';
    content += '<div id='+QueryGraph.UIElement.DESCRIPTION_DIV_ID+'><i>Noeud correspondant à une donnée fixe.</i></div>';
    content += '<br/>';

    content += '<label class="uiTextFieldLabel" for="'+QueryGraph.UIElement.SEARCH_HTML_ID+'">Recherche:</label><input type="text" id="'+QueryGraph.UIElement.SEARCH_HTML_ID+'" name="'+QueryGraph.UIElement.SEARCH_HTML_ID+'" class="uiSelect" value="">';
    content += '<button id="'+QueryGraph.UIElement.SEARCH_BUTTON_HTML_ID+'">OK</button><br/>';
    content += '<div id="'+QueryGraph.UIElement.SEARCH_DIV_ID+'"></div><br/>';
    content += '<br/>';
    
    content += '<label class="uiTextFieldLabel" for="'+QueryGraph.UIElement.LABEL_HTML_ID+'">Label:</label><input type="text" id="'+QueryGraph.UIElement.LABEL_HTML_ID+'" name="'+QueryGraph.UIElement.LABEL_HTML_ID+'" class="uiTextField" value="'+ node.dataInfos.label +'"><br>';
    content += '<label class="uiTextFieldLabel" for="'+QueryGraph.UIElement.URI_HTML_ID+'">URI:</label><input type="text" id="'+QueryGraph.UIElement.URI_HTML_ID+'" name="'+QueryGraph.UIElement.URI_HTML_ID+'" class="uiTextField" value="'+ node.dataInfos.uri +'"><br>';
  }

  content += '<br/><a href="" id="'+QueryGraph.UIElement.WEB_LINK_HTML_ID+'" target="_blank">Lien vers la page</a>';

  $("#"+QueryGraph.UIElement.CONTENT_HTML_ID).html(content);

  if(type == QueryGraph.Node.Type.DATA)
  {
    me.getWebLink(node.dataInfos.uri);

    me.menageSearch(type);
  }
  else if(type == QueryGraph.Node.Type.ELEMENT)
  {
    me.getWebLink(node.elementInfos.uri);

    me.menageChoiseList();
    me.menageSearch(type);

    if(node.elementInfos.subclass)
    {
      $("#"+QueryGraph.UIElement.SUBCLASS_HTML_ID).prop("checked", true);
    }
    else
    {
      $("#"+QueryGraph.UIElement.SUBCLASS_HTML_ID).prop("checked", false);
    }
  }

  // Menage web link
  $("#"+QueryGraph.UIElement.URI_HTML_ID).change(function() { 
      me.getWebLink($("#"+QueryGraph.UIElement.URI_HTML_ID).val()); 
  });
};

/**
 * Menage action in the search toolbar
 * @param {QueryGraph.Node.Type}                 type              The type of the node
 */
QueryGraph.UINode.prototype.menageSearch = function(type)
{
  let me = this;

  $("#"+QueryGraph.UIElement.SEARCH_BUTTON_HTML_ID).click(function() 
  {
    $("#" + QueryGraph.UIElement.SEARCH_DIV_ID).html("");

    let searchValue = $("#"+QueryGraph.UIElement.SEARCH_HTML_ID).val();

    if(type == QueryGraph.Node.Type.DATA)
    {
      me.dataCollector.getNodesTypes(searchValue, function(results)
      {
        displaySearchResult(results);
      });
    }
    else if(type == QueryGraph.Node.Type.ELEMENT)
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

        let content = "<div class='" + QueryGraph.UIElement.SEARCH_DIV_LINE_CLASS + "' uri='"+uri+"' label='"+label+"'><b>" + label + " (" + key + ")</b> : " + description + "<br/></div>";

        $("#" + QueryGraph.UIElement.SEARCH_DIV_ID).prepend(content);
      }

      // Menage click in search line : select an element
      $('.'+QueryGraph.UIElement.SEARCH_DIV_LINE_CLASS).click(function()
      {
        let uri = $(this).attr("uri");

        $("#"+QueryGraph.UIElement.LABEL_HTML_ID).val($(this).attr("label")); 
        $("#"+QueryGraph.UIElement.URI_HTML_ID).val(uri); 

        me.getWebLink(uri);

        $("#" + QueryGraph.UIElement.SEARCH_DIV_ID).html("");
      });
      
    }
  });
};

/**
 * Menage choise type in list
 */
QueryGraph.UINode.prototype.menageChoiseList = function()
{
  let me = this;

  me.dataCollector.getNodesTypesList(function(nodesValues, nodesLabels)
  {
    if(nodesValues.length > 0)
    {
      $('#'+QueryGraph.UIElement.LIST_ELEMENT_HTML_ID).append(new Option("", ""))

      for(let i = 0; i < nodesValues.length; i++)
      {
        $('#'+QueryGraph.UIElement.LIST_ELEMENT_HTML_ID).append(new Option(nodesLabels[i], nodesValues[i]))
      }
    }
    else
    {
      $('#'+QueryGraph.UIElement.LIST_ELEMENT_HTML_DIV_ID).hide();
    }
  });

  // Choise a element --> Update label and URI fields
  $('#'+QueryGraph.UIElement.LIST_ELEMENT_HTML_ID).change(function() 
  {
    let label = $( '#'+QueryGraph.UIElement.LIST_ELEMENT_HTML_ID + ' option:selected' ).text();
    let val = $( this ).val();

    $('#'+QueryGraph.UIElement.LABEL_HTML_ID).val(label);
    $('#'+QueryGraph.UIElement.URI_HTML_ID).val(val);

    me.getWebLink(val);
  });
}

/**
 * Set informations from form to the node
 * @param {QueryGraph.Graph}                     graph                 The graph manager
 */
QueryGraph.UINode.prototype.setNodeInformations = function(graph)
{
  let elements = {};

  let type = $("#"+QueryGraph.UIElement.TYPE_SELECT_HTML_ID).val();
  this.node.setType(type, graph);

  if(type == QueryGraph.Node.Type.ELEMENT)
  {
    let label = $("#"+QueryGraph.UIElement.LABEL_HTML_ID).val();
    let uri = $("#"+QueryGraph.UIElement.URI_HTML_ID).val();
    let name = $("#"+QueryGraph.UIElement.NAME_HTML_ID).val();
    let subclass = $("#"+QueryGraph.UIElement.SUBCLASS_HTML_ID).prop('checked');

    this.node.setElementInfos(label, uri, name, subclass, graph);
  }
  else if(type == QueryGraph.Node.Type.DATA)
  {
    let label = $("#"+QueryGraph.UIElement.LABEL_HTML_ID).val();
    let uri = $("#"+QueryGraph.UIElement.URI_HTML_ID).val();

    this.node.setDataInfos(label, uri, graph);
  }
};

