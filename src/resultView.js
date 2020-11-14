/**
 * Class for drawing request result
 */
QueryGraph.ResultView = function()
{

};

/**
 * @property {String}             RESULT_DIV_ID                HTML ID for the result div
 */
QueryGraph.ResultView.RESULT_DIV_ID = "result";

/**
 * Init view with data to drawing
 * @param {Array}                     data                     Data result of the query
 * @param {String[]}                  selectVars               List of selected query
 */
QueryGraph.ResultView.prototype.init = function(data, selectVars)
{
  let content = "";

    content += "<table>";

    // Create table header
    content += "<tr>";
    for(let i = 0; i < selectVars.length; i++)
    {
      content += "<th>" + selectVars[i] + "</th>";
    }
    content += "</tr>";

    // Create table content
    for(let i = 0; i < data.results.bindings.length; i++)
    {
      content += "<tr>";
      for(let j = 0; j < selectVars.length; j++)
      {
        let value = data.results.bindings[i][selectVars[j]]["value"];

        content += "<td>" + value + "</td>";
      }
      content += "</tr>";
    }
    content += "</table>";

    $("#"+QueryGraph.ResultView.RESULT_DIV_ID).html(content);
};

/**
 * Draw message of query progress
 */
QueryGraph.ResultView.prototype.queryProgress = function()
{
  $("#"+QueryGraph.ResultView.RESULT_DIV_ID).html("<h3>Requête en cours d'exécution</h3>");
};

/**
 * Draw message of query fail
 * @param {String}                     errorReponseText                     Query fail reponse text
 */
QueryGraph.ResultView.prototype.queryFail = function(errorReponseText)
{
  let content = "<h3>Echec de la requête</h3>";
  //content += "<p>" + errorReponseText + "</p>";

  $("#"+QueryGraph.ResultView.RESULT_DIV_ID).html(content);
};