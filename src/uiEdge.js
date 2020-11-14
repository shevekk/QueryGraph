﻿/**
 * Class for ui edge
 */
QueryGraph.UIEdge = function()
{
  QueryGraph.UIElement.call(this);
};
QueryGraph.UIEdge.prototype = Object.create(QueryGraph.UIElement.prototype);


/**
 * @param {QueryGraph.Edge}                     edge                 The selected edge
 */
QueryGraph.UIEdge.prototype.edge;


/*
 * Get types list
 * @return {String[]}                 The list of types
 */
QueryGraph.UIEdge.prototype.getType = function()
{
  let types = {};
  types[QueryGraph.Edge.Type.VARIABLE] = "Variable"
  types[QueryGraph.Edge.Type.FIXED] = "Fixe"

  return types;
};

/*
 * Update selected edge
 * @param {QueryGraph.Edge}                      edge              The selected edge
 */
QueryGraph.UIEdge.prototype.getSelectElement = function(edge)
{
  this.edge = edge;
};

/**
 * Update params contenent by type of node
 * @param {QueryGraph.Edge.Type}                 type              The type of the node
 * @param {QueryGraph.Edge}                      edge              The selected edge
 */
QueryGraph.UIEdge.prototype.updateContent = function(type, edge)
{
  let me = this;

  let content = "";

  if(type == QueryGraph.Edge.Type.FIXED)
  {
    content += '<br/>';
    content += '<div id='+QueryGraph.UIElement.DESCRIPTION_DIV_ID+'><i>Lien dont la valeur est variable.</i></div>';
    content += '<br/>';

    content += '<div id='+QueryGraph.UIElement.LIST_ELEMENT_HTML_DIV_ID+'><label for="'+QueryGraph.UIElement.LIST_ELEMENT_HTML_ID+'">Choix du lien:</label><select id="'+QueryGraph.UIElement.LIST_ELEMENT_HTML_ID+'" name="'+QueryGraph.UIElement.LIST_ELEMENT_HTML_ID+'"></select><br></div>';
    content += '<br/>';

    content += '<label for="'+QueryGraph.UIElement.LABEL_HTML_ID+'">Label:</label><input type="text" id="'+QueryGraph.UIElement.LABEL_HTML_ID+'" name="'+QueryGraph.UIElement.LABEL_HTML_ID+'" value="'+ edge.label +'"><br>';
    content += '<label for="'+QueryGraph.UIElement.URI_HTML_ID+'">URI:</label><input type="text" id="'+QueryGraph.UIElement.URI_HTML_ID+'" name="'+QueryGraph.UIElement.URI_HTML_ID+'" value="'+ edge.uri +'"><br>';
  }
  else if(type == QueryGraph.Edge.Type.VARIABLE)
  {
    content += '<br/>';
    content += '<div id='+QueryGraph.UIElement.DESCRIPTION_DIV_ID+'><i>Lien possédant une valeur fixe.</i></div>';
    content += '<br/>';
    
    content += '<label for="'+QueryGraph.UIElement.NAME_HTML_ID+'">Nom:</label><input type="text" id="'+QueryGraph.UIElement.NAME_HTML_ID+'" name="'+QueryGraph.UIElement.NAME_HTML_ID+'" value="'+ edge.name +'"><br>';
  }

  $("#"+QueryGraph.UIElement.CONTENT_HTML_ID).html(content);

  // Init auto choise list
  if(type == QueryGraph.Edge.Type.FIXED)
  {
    me.menageChoiseList(edge);
  }
};

/**
 * Menage action in the choise list toolbar
 * @param {QueryGraph.Edge}                      edge              The selected edge
 */
QueryGraph.UIEdge.prototype.menageChoiseList = function(edge)
{
  let me = this;

  let nodeStart = edge.nodeStart;

  if(nodeStart.type == QueryGraph.Node.Type.ELEMENT && nodeStart.elementInfos.uri != "")
  {
    me.dataCollector.getEdges(nodeStart.elementInfos.uri, function(edgesValues, edgesLabels)
    {
      if(edgesValues.length > 0)
      {
        $('#'+QueryGraph.UIElement.LIST_ELEMENT_HTML_ID).append(new Option("", ""))

        for(let i = 0; i < edgesValues.length; i++)
        {
          $('#'+QueryGraph.UIElement.LIST_ELEMENT_HTML_ID).append(new Option(edgesLabels[i], edgesValues[i]))
        }
      }
      else
      {
        $('#'+QueryGraph.UIElement.LIST_ELEMENT_HTML_DIV_ID).hide();
      }
    });
  }
  else
  {
    $('#'+QueryGraph.UIElement.LIST_ELEMENT_HTML_DIV_ID).hide();
  }

  // Choise a element --> Update label and URI fields
  $('#'+QueryGraph.UIElement.LIST_ELEMENT_HTML_ID).change(function() 
  {
    let label = $( '#'+QueryGraph.UIElement.LIST_ELEMENT_HTML_ID + ' option:selected' ).text();
    let val = $( this ).val();

    $('#'+QueryGraph.UIElement.LABEL_HTML_ID).val(label);
    $('#'+QueryGraph.UIElement.URI_HTML_ID).val(val);
  });
};

/**
 * Set informations from form to the node
 * @property {QueryGraph.Graph}                     graph                 The graph manager
 */
QueryGraph.UIEdge.prototype.setEdgeInformations = function(graph)
{
  let elements = {};

  let type = $("#"+QueryGraph.UIElement.TYPE_SELECT_HTML_ID).val();
  this.edge.setType(type, graph);

  if(type == QueryGraph.Edge.Type.FIXED)
  {
    let label = $("#"+QueryGraph.UIElement.LABEL_HTML_ID).val();
    let uri = $("#"+QueryGraph.UIElement.URI_HTML_ID).val();

    this.edge.setInformations(label, uri, "", graph);
  }
  else if(type == QueryGraph.Edge.Type.VARIABLE)
  {
    let name = $("#"+QueryGraph.UIElement.NAME_HTML_ID).val();

    this.edge.setInformations("", "", name, graph);
  }
};
