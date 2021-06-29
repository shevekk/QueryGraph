if (typeof QueryGraph.UI == 'undefined') {
  QueryGraph.UI = {};
}

QueryGraph.UI.TopUI = class TopUI 
{
  /**
   * @property {String}             TOP_UI_DIV_HTML_ID                       HTML ID of the top ui div containing select and buttons
   * @property {String}             ADD_NODE_BUTTON_HTML_ID                  Button for creation of a node
   * @property {String}             ADD_EDGE_BUTTON_HTML_ID                  Button for creation of a edge batweeb two node
   * @property {String}             REVERT_EDGE_BUTTON_HTML_ID               Button for revert the direction of the edge
   * @property {String}             DELETE_BUTTON_HTML_ID                    Button for delete a node or a dege
   * @property {String}             CANCEL_ACTION_BUTTON_HTML_ID             Button for cancel current action
   * @property {String}             NEW_QUERY_ACTION_BUTTON_HTML_ID          Button for create a new query
   * @property {String}             EXEC_QUERY_BUTTON_HTML_ID                Button for execute a query
   * @property {String}             TOP_BUTTON_RIGHT_HTML_CLASS              Top button right html class
   * @property {String}             TOP_BUTTON_LEFT_HTML_CLASS               Top button left html class
   */
  static TOP_UI_DIV_HTML_ID = "top";

  static ADD_NODE_BUTTON_HTML_ID = "addNode";
  static ADD_EDGE_BUTTON_HTML_ID = "addEdge";
  static REVERT_EDGE_BUTTON_HTML_ID = "revertEdge";
  static DELETE_BUTTON_HTML_ID = "delete";
  static CANCEL_ACTION_BUTTON_HTML_ID = "cancelAction";
  static NEW_QUERY_ACTION_BUTTON_HTML_ID = "newQuery";
  static EXEC_QUERY_BUTTON_HTML_ID = "execQuery";

  static TOP_BUTTON_RIGHT_HTML_CLASS = "top_button_right";
  static TOP_BUTTON_LEFT_HTML_CLASS = "top_button_left";
  

  /*
   * Init the top UI buttons
   */
  init()
  {
    let content = '<button name="'+QueryGraph.UI.TopUI.ADD_NODE_BUTTON_HTML_ID+'" id="'+QueryGraph.UI.TopUI.ADD_NODE_BUTTON_HTML_ID+'" title="'+QueryGraph.Dictionary.Dictionary.get("ADD_NODE_BUTTON_DESC")+'" class="'+QueryGraph.UI.TopUI.TOP_BUTTON_LEFT_HTML_CLASS+'">'+QueryGraph.Dictionary.Dictionary.get("ADD_NODE_BUTTON_NAME")+'</button>';
    content += '<button name="'+QueryGraph.UI.TopUI.ADD_EDGE_BUTTON_HTML_ID+'" id="'+QueryGraph.UI.TopUI.ADD_EDGE_BUTTON_HTML_ID+'" title="'+QueryGraph.Dictionary.Dictionary.get("ADD_EDGE_BUTTON_DESC")+'" class="'+QueryGraph.UI.TopUI.TOP_BUTTON_LEFT_HTML_CLASS+'">'+QueryGraph.Dictionary.Dictionary.get("ADD_EDGE_BUTTON_NAME")+'</button>';
    content += '<button name="'+QueryGraph.UI.TopUI.REVERT_EDGE_BUTTON_HTML_ID+'" id="'+QueryGraph.UI.TopUI.REVERT_EDGE_BUTTON_HTML_ID+'" title="'+QueryGraph.Dictionary.Dictionary.get("REVERT_EDGE_BUTTON_DESC")+'" class="'+QueryGraph.UI.TopUI.TOP_BUTTON_LEFT_HTML_CLASS+'">'+QueryGraph.Dictionary.Dictionary.get("REVERT_EDGE_BUTTON_NAME")+'</button>';
    content += '<button name="'+QueryGraph.UI.TopUI.DELETE_BUTTON_HTML_ID+'" id="'+QueryGraph.UI.TopUI.DELETE_BUTTON_HTML_ID+'" title="'+QueryGraph.Dictionary.Dictionary.get("DELETE_BUTTON_DESC")+'" class="'+QueryGraph.UI.TopUI.TOP_BUTTON_LEFT_HTML_CLASS+'">'+QueryGraph.Dictionary.Dictionary.get("DELETE_BUTTON_NAME")+'</button>';
    content += '<button name="'+QueryGraph.UI.TopUI.CANCEL_ACTION_BUTTON_HTML_ID+'" id="'+QueryGraph.UI.TopUI.CANCEL_ACTION_BUTTON_HTML_ID+'" title="'+QueryGraph.Dictionary.Dictionary.get("CANCEL_ACTION_BUTTON_DESC")+'" class="'+QueryGraph.UI.TopUI.TOP_BUTTON_LEFT_HTML_CLASS+'">'+QueryGraph.Dictionary.Dictionary.get("CANCEL_ACTION_BUTTON_NAME")+'</button>';
    content += '<button name="'+QueryGraph.UI.TopUI.NEW_QUERY_ACTION_BUTTON_HTML_ID+'" id="'+QueryGraph.UI.TopUI.NEW_QUERY_ACTION_BUTTON_HTML_ID+'" title="'+QueryGraph.Dictionary.Dictionary.get("NEW_QUERY_BUTTON_DESC")+'" class="'+QueryGraph.UI.TopUI.TOP_BUTTON_LEFT_HTML_CLASS+'">'+QueryGraph.Dictionary.Dictionary.get("NEW_QUERY_BUTTON_NAME")+'</button>';
    content += '<button name="'+QueryGraph.UI.TopUI.EXEC_QUERY_BUTTON_HTML_ID+'" id="'+QueryGraph.UI.TopUI.EXEC_QUERY_BUTTON_HTML_ID+'" title="'+QueryGraph.Dictionary.Dictionary.get("EXEC_QUERY_BUTTON_DESC")+'" class="'+QueryGraph.UI.TopUI.TOP_BUTTON_RIGHT_HTML_CLASS+'">'+QueryGraph.Dictionary.Dictionary.get("EXEC_QUERY_BUTTON_NAME")+'</button>';

    $("#" + QueryGraph.UI.TopUI.TOP_UI_DIV_HTML_ID).html(content);
  }

  /*
   * Highlight a button and modify handler design
   * @param {String}                  buttonId                The button id
   * @param {Boolean}                 enable                  Enable state
   */
  static highlight(buttonId, enable)
  {
    $("#" + buttonId).off( "mouseenter mouseleave" );
    if(enable)
    {
      $("#" + buttonId).css("background-color", "#fae692");
    }
    else
    {
      $("#" + buttonId).css("background-color", "#f2f2f2");
    }

    $("#" + buttonId).mouseenter( handlerIn ).mouseleave( handlerOut );

    /*
     * Hover button
     */
    function handlerIn()
    {
      if(enable)
      {
        $("#" + buttonId).css("background-color", "#fbde63");
      }
      else
      {
        $("#" + buttonId).css("background-color", "#e7e7e7");
      }
    }

    /*
     * UnHover button
     */
    function handlerOut()
    {
      if(enable)
      {
        $("#" + buttonId).css("background-color", "#fae692");
      }
      else
      {
        $("#" + buttonId).css("background-color", "#f2f2f2");
      }
    }
  }
}

