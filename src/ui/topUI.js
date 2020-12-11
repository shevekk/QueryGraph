if (typeof QueryGraph.UI == 'undefined') {
  QueryGraph.UI = {};
}

QueryGraph.UI.TopUI = class TopUI 
{
  /**
   * @property {String}             ADD_NODE_BUTTON_HTML_ID                  Button for creation of a node
   * @property {String}             ADD_EDGE_BUTTON_HTML_ID                  Button for creation of a edge batweeb two node
   * @property {String}             REVERT_EDGE_BUTTON_HTML_ID               Button for revert the direction of the edge
   * @property {String}             DELETE_BUTTON_HTML_ID                    Button for delete a node or a dege
   * @property {String}             CANCEL_ACTION_BUTTON_HTML_ID             Button for cancel current action
   * @property {String}             EXEC_QUERY_GRAPH_BUTTON_HTML_ID          Button for execute a query and display the result as a graph
   * @property {String}             EXEC_QUERY_BUTTON_HTML_ID                Button for execute a query
   */
  static ADD_NODE_BUTTON_HTML_ID = "addNode";
  static ADD_EDGE_BUTTON_HTML_ID = "addEdge";
  static REVERT_EDGE_BUTTON_HTML_ID = "revertEdge";
  static DELETE_BUTTON_HTML_ID = "delete";
  static CANCEL_ACTION_BUTTON_HTML_ID = "cancelAction";
  static EXEC_QUERY_GRAPH_BUTTON_HTML_ID = "execQueryGraph";
  static EXEC_QUERY_BUTTON_HTML_ID = "execQuery";
}

