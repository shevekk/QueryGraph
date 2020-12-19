
if (typeof QueryGraph.Query == 'undefined') {
  QueryGraph.Query = {};
}

/**
 * Class for drawing request result
 */
QueryGraph.Query.ResultView = class ResultView
{
  /**
   * @property {String}             RESULT_DIV_ID                HTML ID for the result div
   */
  static RESULT_DIV_ID = "result";

  constructor() 
  {

  }

  /**
   * Init view with data to drawing
   * @param {Array}                     data                     Data result of the query
   * @param {Object[]}                  selectVars               List of selected query
   * @param {Object}                    listEdgesLabel           Object containing edges label with as key the type of edge
   */
  displayResults(data, selectVars, listEdgesLabel)
  {
    let content = "";

    content += "<table>";

    // Create table header
    content += "<tr>";
    for(let i = 0; i < selectVars.length; i++)
    {
      content += "<th>" + selectVars[i].value + "</th>";

      if(selectVars[i].label)
      {
        content += "<th>" + selectVars[i].label + "</th>";
      }
      else if(QueryGraph.Config.Config.displayLabel && selectVars[i].elementType == QueryGraph.Data.ElementType.EDGE)
      {
        content += "<th>" + selectVars[i].value + "Label</th>";
      }
    }
    content += "</tr>";

    // Create table content
    for(let i = 0; i < data.results.bindings.length; i++)
    {
      content += "<tr>";
      for(let j = 0; j < selectVars.length; j++)
      {
        if(data.results.bindings[i][selectVars[j].value])
        {
          let value = data.results.bindings[i][selectVars[j].value]["value"];

          content += "<td>" + value + "</td>";

          if(selectVars[j].label)
          {
            value = data.results.bindings[i][selectVars[j].label]["value"];

            content += "<td>" + value + "</td>";
          }
          else if(QueryGraph.Config.Config.displayLabel && selectVars[j].elementType == QueryGraph.Data.ElementType.EDGE)
          {
            content += "<td>" + listEdgesLabel[value] + "</td>";
          }
        }
        else
        {
          content += "<td></td>";

          if(QueryGraph.Config.Config.displayLabel)
          {
            content += "<td></td>";
          }
        }
      }
      content += "</tr>";
    }
    content += "</table>";

    $("#"+QueryGraph.Query.ResultView.RESULT_DIV_ID).html(content);
  }

  /**
   * Draw message of query progress
   */
  queryProgress()
  {
    $("#"+QueryGraph.Query.ResultView.RESULT_DIV_ID).html("<h3>Requête en cours d'exécution</h3>");
  }

  /**
   * Draw message of query fail
   * @param {String}                     errorReponseText                     Query fail reponse text
   */
  queryFail(errorReponseText)
  {
    let content = "<h3>Echec de la requête</h3>";
    //content += "<p>" + errorReponseText + "</p>";

    $("#"+QueryGraph.Query.ResultView.RESULT_DIV_ID).html(content);
  }

  /**
   * Send result data to graph result representation 
   * @param {QueryGraph.Data.Graph}          graph                    Graph manager
   * @param {Array}                     data                     Data result of the query
   * @param {Object[]}                  selectVars               List of selected query
   * @param {Object}                    listEdgesLabel           Object containing edges label with as key the type of edge
   */
  sendDataToGraph(graph, data, selectVars, listEdgesLabel)
  {
    var me = this;

    if(data.results.bindings.length == 0)
    {
      alert("Impossible de visualiser le graphe : Aucun résultats");
      return;
    }

    // Get graph nodes
    var nodes = []; 
    var edges = []; 
    for(let i = 0; i < graph.nodes.length; i++)
    {
      if(graph.nodes[i].type != QueryGraph.Data.NodeType.FILTER)
      {
        nodes.push({});
        nodes[i]["id"] = graph.nodes[i].id;
        nodes[i]["type"] = graph.nodes[i].type;
        
        if(graph.nodes[i].type == QueryGraph.Data.NodeType.DATA)
        {
          nodes[i]["label"] = graph.nodes[i].dataInfos.label;
          nodes[i]["uri"] = me.getUri(graph.nodes[i].dataInfos.uri);
        }
        else if(graph.nodes[i].type == QueryGraph.Data.NodeType.ELEMENT)
        {
          nodes[i]["name"] = graph.nodes[i].elementInfos.name;
        }
      }
    }

    // Get graph edges
    for(let i = 0; i < graph.edges.length; i++)
    {
      if(graph.edges[i].nodeStart.type != QueryGraph.Data.NodeType.FILTER && graph.edges[i].nodeEnd.type != QueryGraph.Data.NodeType.FILTER)
      {
        edges.push({});
        edges[i]["type"] = graph.edges[i].type;
        edges[i]["idNodeStart"] = graph.edges[i].idNodeStart;
        edges[i]["idNodeEnd"] = graph.edges[i].idNodeEnd;
        edges[i]["typeNodeStart"] = graph.edges[i].nodeStart.type;
        edges[i]["typeNodeEnd"] = graph.edges[i].nodeEnd.type;

        if(graph.edges[i].type == QueryGraph.Data.EdgeType.VARIABLE)
        {
          edges[i]["name"] = graph.edges[i].name;
        }
        else if(graph.edges[i].type == QueryGraph.Data.EdgeType.FIXED)
        {
          edges[i]["label"] = graph.edges[i].label;
          edges[i]["uri"] = me.getUri(graph.edges[i].uri);
        }
      }
    }
    // Init json graph
    let graphObject = { "nodes" : nodes, "edges" : edges};
    let graphJson = JSON.stringify(graphObject); 

    // Init Json Result
    var results = [];
    for(let i = 0; i < data.results.bindings.length; i++)
    {
      for(let j = 0; j < selectVars.length; j++)
      {
        if(data.results.bindings[i][selectVars[j].value])
        {
          let value = data.results.bindings[i][selectVars[j].value]["value"];
          let label = "";

          if(selectVars[j].label)
          {
            label = data.results.bindings[i][selectVars[j].label]["value"];
          }
          else if(QueryGraph.Config.Config.displayLabel && selectVars[j].elementType == QueryGraph.Data.ElementType.EDGE)
          {
            label = listEdgesLabel[value];
          }

          results.push({"var" : selectVars[j].value, "value" : value, "label" : label.replaceAll('"', "'"), "lineNumber" : i});
        }
      }
    }
    let resultsJson = JSON.stringify(results); 

    // Create hidden form for transmit data
    let url = window.location.href.split("?")[0];
    
    var mapForm = document.createElement("form");
    mapForm.target = "Map";
    mapForm.method = "POST";
    mapForm.action = url + "resultGraph/index.php";

    var graphJsonInput = document.createElement("input");
    graphJsonInput.type = "text";
    graphJsonInput.name = "graph";
    graphJsonInput.value = graphJson;
    graphJsonInput.className = 'invisibleField';
    mapForm.appendChild(graphJsonInput);

    var resultsJsonInput = document.createElement("input");
    resultsJsonInput.type = "text";
    resultsJsonInput.name = "data";
    resultsJsonInput.value = resultsJson.replaceAll("'", "\'");
    resultsJsonInput.className = 'invisibleField';
    mapForm.appendChild(resultsJsonInput);

    document.body.appendChild(mapForm);

    mapForm.submit();
  }

  /**
   * For URI with prefix get the complete URI
   * @param {String}          uri                    Uri with prefix
   * @return {String}                                Complete UROI
   */
  getUri(uri)
  {
    if(!uri.startsWith("http"))
    {
      for (const key in QueryGraph.Config.Config.prefix)
      {
        if(uri.split(':')[0] == key)
        {
          uri = QueryGraph.Config.Config.prefix[key] + uri.split(':')[1];  
        }
      }
    }

    return uri;
  }
}


