if (typeof QueryGraph.UI == 'undefined') {
  QueryGraph.UI = {};
}

/**
 */
QueryGraph.UI.TopUI = function()
{
};

/**
 * @property {String}             ADD_NODE_BUTTON_HTML_ID                  Button for creation of a node
 * @property {String}             ADD_EDGE_BUTTON_HTML_ID                  Button for creation of a edge batweeb two node
 * @property {String}             REVERT_EDGE_BUTTON_HTML_ID               Button for revert the direction of the edge
 * @property {String}             DELETE_BUTTON_HTML_ID                    Button for delete a node or a dege
 * @property {String}             CANCEL_ACTION_BUTTON_HTML_ID             Button for cancel current action
 * @property {String}             EXEC_QUERY_GRAPH_BUTTON_HTML_ID          Button for execute a query and display the result as a graph
 * @property {String}             EXEC_QUERY_BUTTON_HTML_ID                Button for execute a query
 */
QueryGraph.UI.TopUI.ADD_NODE_BUTTON_HTML_ID = "addNode";
QueryGraph.UI.TopUI.ADD_EDGE_BUTTON_HTML_ID = "addEdge";
QueryGraph.UI.TopUI.REVERT_EDGE_BUTTON_HTML_ID = "revertEdge";
QueryGraph.UI.TopUI.DELETE_BUTTON_HTML_ID = "delete";
QueryGraph.UI.TopUI.CANCEL_ACTION_BUTTON_HTML_ID = "cancelAction";
QueryGraph.UI.TopUI.EXEC_QUERY_GRAPH_BUTTON_HTML_ID = "execQueryGraph";
QueryGraph.UI.TopUI.EXEC_QUERY_BUTTON_HTML_ID = "execQuery";