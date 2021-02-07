
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
  displayResults(graph, data, selectVars, listEdgesLabel)
  {
    let content = "";

    content += QueryGraph.Dictionary.Dictionary.get("NB_RESULTS") + " : " + data.results.bindings.length;

    content += "<table>";

    // Create table header
    content += "<tr>";
    for(let i = 0; i < selectVars.length; i++)
    {
      if(graph.params.sortEnable && graph.params.sortVar == selectVars[i].value)
      {
        content += "<th style='background-color:#75cbc2'>" + selectVars[i].value + "</th>";
      }
      else
      {
        content += "<th>" + selectVars[i].value + "</th>";
      }


      if(selectVars[i].label)
      {
        // If result type are all literal don't get label
        let allLiteral = true;
        for(let j = 0; j < data.results.bindings.length; j++)
        {
          if(data.results.bindings[j][selectVars[i].value]["type"] != "literal")
          {
            allLiteral = false;
          }
        }

        if(!allLiteral)
        {
          content += "<th>" + selectVars[i].label + "</th>";
        }
        else
        {
          selectVars[i].allLiteral = true;
        }
      }
      else if(QueryGraph.Config.Config.main.displayLabel && selectVars[i].elementType == QueryGraph.Data.ElementType.EDGE)
      {
        if(graph.params.sortEnable && graph.params.sortVar == selectVars[i].value)
        {
          content += "<th style='background-color:#50e1ad'>" + selectVars[i].value + "Label</th>";
        }
        else
        {
          content += "<th>" + selectVars[i].value + "Label</th>";
        }
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
          let type = data.results.bindings[i][selectVars[j].value]["type"];

          if(type != "literal")
          {
            content += "<td><a href='"+value+"' target='_blank'>" + value + "</a></td>";
          }
          else
          {
            content += "<td>" + value + "</td>";
          }

          if(selectVars[j].label && !selectVars[j].allLiteral)
          {
            value = data.results.bindings[i][selectVars[j].label]["value"];

            if(type == "literal")
            {
              content += "<td></td>";
            }
            else
            {
              content += "<td>" + value + "</td>";
            }
          }
          else if(QueryGraph.Config.Config.main.displayLabel && selectVars[j].elementType == QueryGraph.Data.ElementType.EDGE)
          {
            if(listEdgesLabel[value] != undefined)
            {
              content += "<td>" + listEdgesLabel[value] + "</td>";
            }
            else
            {
              content += "<td></td>";
            }
          }
        }
        else
        {
          content += "<td></td>";

          if(QueryGraph.Config.Config.main.displayLabel)
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
    $("#"+QueryGraph.Query.ResultView.RESULT_DIV_ID).html("<h3>"+QueryGraph.Dictionary.Dictionary.get("QUERY_IN_PROGRESS")+"</h3>");
  }

  /**
   * Draw message of query fail
   * @param {String}                     errorReponseText                     Query fail reponse text
   */
  queryFail(errorReponseText)
  {
    let content = "<h3>"+QueryGraph.Dictionary.Dictionary.get("QUERY_FAIL")+"</h3>";
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
      alert(QueryGraph.Dictionary.Dictionary.get("DRAW_GRAPH_IMPOSSIBLE_NO_RESULTS"));
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
        nodes[nodes.length - 1]["id"] = graph.nodes[i].id;
        nodes[nodes.length - 1]["type"] = graph.nodes[i].type;
        
        if(graph.nodes[i].type == QueryGraph.Data.NodeType.DATA)
        {
          nodes[nodes.length - 1]["label"] = graph.nodes[i].dataInfos.label;
          nodes[nodes.length - 1]["uri"] = me.getUri(graph.nodes[i].dataInfos.uri);
        }
        else if(graph.nodes[i].type == QueryGraph.Data.NodeType.ELEMENT)
        {
          nodes[nodes.length - 1]["name"] = graph.nodes[i].elementInfos.name;
        }
      }
    }

    // Get graph edges
    for(let i = 0; i < graph.edges.length; i++)
    {
      if(graph.edges[i].nodeStart.type != QueryGraph.Data.NodeType.FILTER && graph.edges[i].nodeEnd.type != QueryGraph.Data.NodeType.FILTER)
      {
        edges.push({});
        edges[edges.length - 1]["type"] = graph.edges[i].type;
        edges[edges.length - 1]["idNodeStart"] = graph.edges[i].idNodeStart;
        edges[edges.length - 1]["idNodeEnd"] = graph.edges[i].idNodeEnd;
        edges[edges.length - 1]["typeNodeStart"] = graph.edges[i].nodeStart.type;
        edges[edges.length - 1]["typeNodeEnd"] = graph.edges[i].nodeEnd.type;

        if(graph.edges[i].type == QueryGraph.Data.EdgeType.VARIABLE)
        {
          edges[edges.length - 1]["name"] = graph.edges[i].name;
        }
        else if(graph.edges[i].type == QueryGraph.Data.EdgeType.FIXED)
        {
          edges[edges.length - 1]["label"] = graph.edges[i].label;
          edges[edges.length - 1]["uri"] = me.getUri(graph.edges[i].uri);
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
          else if(QueryGraph.Config.Config.main.displayLabel && selectVars[j].elementType == QueryGraph.Data.ElementType.EDGE)
          {
            label = listEdgesLabel[value];
          }

          if(label == undefined)
          {
            results.push({"var" : selectVars[j].value, "value" : value.replaceAll('"', "'"), "label" : "", "lineNumber" : i});
          }
          else
          {
            results.push({"var" : selectVars[j].value, "value" : value.replaceAll('"', "'"), "label" : label.replaceAll('"', "'"), "lineNumber" : i});
          }
          
        }
      }
    }
    let resultsJson = JSON.stringify(results); 

    // Create hidden form for transmit data
    //let url = window.location.href.split("?")[0];
    let url = window.location.href.split("?")[0];
    if(url.includes("index.html"))
    {
      url = url.replace("index.html","");
    }
    
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

    var resultsJsonLang = document.createElement("input");
    resultsJsonLang.type = "text";
    resultsJsonLang.name = "lang";
    resultsJsonLang.value = QueryGraph.Config.Config.lang;
    resultsJsonLang.className = 'invisibleField';
    mapForm.appendChild(resultsJsonLang);

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


