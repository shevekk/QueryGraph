if (typeof QueryGraph.UI == 'undefined') {
  QueryGraph.UI = {};
}

/**
 * Class for ui edge
 */
QueryGraph.UI.UIEdge = class UIEdge extends QueryGraph.UI.UIElement
{
  constructor() 
  {
    super();
    /**
     * @param {QueryGraph.Data.Edge}                     edge                 The selected edge
     */
    this.edge = null;
  }

  /*
   * Get types list
   * @return {String[]}                 The list of types
   */
  getType()
  {
    let types = {};
    types[QueryGraph.Data.EdgeType.VARIABLE] = "Variable"
    types[QueryGraph.Data.EdgeType.FIXED] = "Fixe"

    return types;
  }

  /*
   * Update selected edge
   * @param {QueryGraph.Data.Edge}                      edge              The selected edge
   */
  getSelectElement(edge)
  {
    this.edge = edge;
  }

  /**
   * Update params contenent by type of node
   * @param {QueryGraph.Data.EdgeType}                 type              The type of the node
   * @param {QueryGraph.Data.Edge}                      edge              The selected edge
   */
  updateContent(type, edge)
  {
    let me = this;

    let content = "";

    if(type == QueryGraph.Data.EdgeType.FIXED)
    {
      content += '<br/>';
      content += '<div id="'+QueryGraph.UI.UIElement.DESCRIPTION_DIV_ID+'"><i>Lien dont la valeur est variable.</i></div>';
      content += '<br/>';

      content += '<div id="'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_DIV_ID+'"><label class="uiTextFieldLabel" for="'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID+'">Choix du lien:</label><select id="'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID+'" class="uiSelect" name="'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID+'"></select><br></div>';
      content += '<br/>';

      content += '<label class="uiTextFieldLabel" for="'+QueryGraph.UI.UIElement.LABEL_HTML_ID+'">Label:</label><input type="text" id="'+QueryGraph.UI.UIElement.LABEL_HTML_ID+'" name="'+QueryGraph.UI.UIElement.LABEL_HTML_ID+'" class="uiTextField" value="'+ edge.label +'"><br>';
      content += '<label class="uiTextFieldLabel" for="'+QueryGraph.UI.UIElement.URI_HTML_ID+'">URI:</label><input type="text" id="'+QueryGraph.UI.UIElement.URI_HTML_ID+'" name="'+QueryGraph.UI.UIElement.URI_HTML_ID+'" class="uiTextField" value="'+ edge.uri +'"><br>';
    
      content += '<a href="" id="'+QueryGraph.UI.UIElement.WEB_LINK_HTML_ID+'" target="_blank">Lien vers la page</a>';
    }
    else if(type == QueryGraph.Data.EdgeType.VARIABLE)
    {
      content += '<br/>';
      content += '<div id='+QueryGraph.UI.UIElement.DESCRIPTION_DIV_ID+'><i>Lien possédant une valeur fixe.</i></div>';
      content += '<br/>';
      
      content += '<label class="uiTextFieldLabel" for="'+QueryGraph.UI.UIElement.NAME_HTML_ID+'">Nom:</label><input type="text" id="'+QueryGraph.UI.UIElement.NAME_HTML_ID+'" name="'+QueryGraph.UI.UIElement.NAME_HTML_ID+'" class="uiTextField" value="'+ edge.name +'"><br>';
    }

    content += '<br/><div><input type="checkbox" id="'+QueryGraph.UI.UIElement.OPTIONAL_HTML_ID+'" name="'+QueryGraph.UI.UIElement.OPTIONAL_HTML_ID+'" class="uiCheckbox"><label for="'+QueryGraph.UI.UIElement.OPTIONAL_HTML_ID+'" class="'+QueryGraph.UI.UIElement.OPTIONAL_HTML_ID+'">Optionel</label></div>';

    $("#"+QueryGraph.UI.UIElement.CONTENT_HTML_ID).html(content);

    if(edge.optional)
    {
      $("#"+QueryGraph.UI.UIElement.OPTIONAL_HTML_ID).prop("checked", true);
    }
    else
    {
      $("#"+QueryGraph.UI.UIElement.OPTIONAL_HTML_ID).prop("checked", false);
    }

    // Init auto choise list
    if(type == QueryGraph.Data.EdgeType.FIXED)
    {
      me.menageChoiseList(edge);

      // Menage web link
      me.getWebLink(edge.uri);
      $("#"+QueryGraph.UI.UIElement.URI_HTML_ID).change(function() { 
        me.getWebLink($("#"+QueryGraph.UI.UIElement.URI_HTML_ID).val()); 
      });
    }
  }


  /**
   * Menage action in the choise list toolbar
   * @param {QueryGraph.Data.Edge}                      edge              The selected edge
   */
  menageChoiseList(edge)
  {
    let me = this;

    let nodeStart = edge.nodeStart;

    if(nodeStart.type == QueryGraph.Data.NodeType.ELEMENT || nodeStart.type == QueryGraph.Data.NodeType.DATA)
    {
      let type = "";
      let uri = "";
      if(nodeStart.type == QueryGraph.Data.NodeType.ELEMENT)
      {
        type = nodeStart.elementInfos.uri;
      }
      else if(nodeStart.type == QueryGraph.Data.NodeType.DATA)
      {
        uri = nodeStart.dataInfos.uri
      }

      me.dataCollector.getEdges(type, uri, function(edgesValues, edgesLabels)
      {
        if(edgesValues.length > 0)
        {
          $('#'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID).append(new Option("", ""))

          for(let i = 0; i < edgesValues.length; i++)
          {
            $('#'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID).append(new Option(edgesLabels[i], edgesValues[i]))
          }
        }
        else
        {
          $('#'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_DIV_ID).hide();
        }
      });
    }
    else
    {
      $('#'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_DIV_ID).hide();
    }

    // Choise a element --> Update label and URI fields
    $('#'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID).change(function() 
    {
      let label = $( '#'+QueryGraph.UI.UIElement.LIST_ELEMENT_HTML_ID + ' option:selected' ).text();
      let val = $( this ).val();

      me.getWebLink(val);
      $('#'+QueryGraph.UI.UIElement.LABEL_HTML_ID).val(label);
      $('#'+QueryGraph.UI.UIElement.URI_HTML_ID).val(val);
    });
  }

  /**
   * Set informations from form to the node
   * @property {QueryGraph.Data.Graph}                     graph                 The graph manager
   */
  setEdgeInformations(graph)
  {
    let elements = {};

    let type = $("#"+QueryGraph.UI.UIElement.TYPE_SELECT_HTML_ID).val();
    this.edge.setType(type, graph);

    let optional = $("#"+QueryGraph.UI.UIElement.OPTIONAL_HTML_ID).prop('checked');

    if(type == QueryGraph.Data.EdgeType.FIXED)
    {
      let label = $("#"+QueryGraph.UI.UIElement.LABEL_HTML_ID).val();
      let uri = $("#"+QueryGraph.UI.UIElement.URI_HTML_ID).val();

      this.edge.setInformations(label, uri, "", optional, graph);
    }
    else if(type == QueryGraph.Data.EdgeType.VARIABLE)
    {
      let name = $("#"+QueryGraph.UI.UIElement.NAME_HTML_ID).val();

      this.edge.setInformations("", "", name, optional, graph);
    }
  }
}