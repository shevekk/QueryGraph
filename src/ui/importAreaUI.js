if (typeof QueryGraph.UI == 'undefined') {
  QueryGraph.UI = {};
}

/*
 * Manage import area
 */
QueryGraph.UI.ImportAreaUI = class ImportAreaUI 
{
 /**
  * @property {String}             DIV_HTML_ID                    HTML ID of the import area
  * @property {String}             TEXTAREA_ID                    Id of the textArea
  * @property {String}             TEXTAREA_CLASS                 Class of the textArea
  * @property {String}             CANCEL_BUTTON_ID               Cancel button id
  * @property {String}             LOAD_BUTTON_ID                 Load button id
  */
  static DIV_HTML_ID = "importArea";
  static TEXTAREA_ID = "importTextArea";
  static TEXTAREA_CLASS = "importTextArea";
  static CANCEL_BUTTON_ID = "importAreaCancelButton";
  static LOAD_BUTTON_ID = "importAreaLoadButton";

  /*
   * Init the import area with html content and action management
   * @param {QueryGraph.Data.Graph}                   graph             The graph manager 
   * @param {QueryGraph.Query.QueryManager}           queryManager      The query manager 
   */
  init(graph, queryManager)
  {
    let content = `<textarea id="${QueryGraph.UI.ImportAreaUI.TEXTAREA_ID}" name="${QueryGraph.UI.ImportAreaUI.TEXTAREA_ID}" class="${QueryGraph.UI.ImportAreaUI.TEXTAREA_CLASS}"></textarea><br/>
      <button id="${QueryGraph.UI.ImportAreaUI.CANCEL_BUTTON_ID}" title="${QueryGraph.Dictionary.Dictionary.get("IMPORTAREA_CANCEL_BUTTON_DESC")}">${QueryGraph.Dictionary.Dictionary.get("IMPORTAREA_CANCEL_BUTTON_NAME")}</button>
      <button id="${QueryGraph.UI.ImportAreaUI.LOAD_BUTTON_ID}" title="${QueryGraph.Dictionary.Dictionary.get("IMPORTAREA_LOAD_BUTTON_DESC")}">${QueryGraph.Dictionary.Dictionary.get("IMPORTAREA_LOAD_BUTTON_NAME")}</button>`;

    $("#" + QueryGraph.UI.ImportAreaUI.DIV_HTML_ID).html(content);

    // Cancel action : hide div
    $("#" + QueryGraph.UI.ImportAreaUI.CANCEL_BUTTON_ID).click(function()
    {
      $("#" + QueryGraph.UI.ImportAreaUI.DIV_HTML_ID).css("display", "none");
    });

    // Load action : hide div and load data
    $("#" + QueryGraph.UI.ImportAreaUI.LOAD_BUTTON_ID).click(function()
    {
      $("#" + QueryGraph.UI.ImportAreaUI.DIV_HTML_ID).css("display", "none");

      graph.loadFromSPARQL($("#" + QueryGraph.UI.ImportAreaUI.TEXTAREA_ID).val(), queryManager);
    });
  }
};