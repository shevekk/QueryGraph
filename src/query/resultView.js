
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

  static RESULT_HEAD_DIV_ID = "resultHeadDiv";

  static RESULT_MAP_BUTTON_ID = "resultMapButton";
  static RESULT_TIMELINE_BUTTON_ID = "resultTimeLineButton";
  static RESULT_CHART_BUTTON_ID = "resultChartButton";
  static RESULT_BUTTON_CLASS = "resultButtonClass";

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
    let me = this;

    let content = "";

    content += `<div id="${QueryGraph.Query.ResultView.RESULT_HEAD_DIV_ID}">
      ${QueryGraph.Dictionary.Dictionary.get("NB_RESULTS")} : ${data.results.bindings.length}`;

    if(QueryGraph.Config.Config.views.mapEnable)
    {
      content += `  <button class="${QueryGraph.Query.ResultView.RESULT_BUTTON_CLASS}" id="${QueryGraph.Query.ResultView.RESULT_MAP_BUTTON_ID}">${QueryGraph.Dictionary.Dictionary.get("RESULTS_MAP_BUTTON")}</button>`;
    }
    if(QueryGraph.Config.Config.views.timelineEnable)
    {
      content += `  <button class="${QueryGraph.Query.ResultView.RESULT_BUTTON_CLASS}" id="${QueryGraph.Query.ResultView.RESULT_TIMELINE_BUTTON_ID}">${QueryGraph.Dictionary.Dictionary.get("RESULTS_TIMELINE_BUTTON")}</button>`;
    }
    if(QueryGraph.Config.Config.views.chartEnable)
    {
      content += `  <button class="${QueryGraph.Query.ResultView.RESULT_BUTTON_CLASS}" id="${QueryGraph.Query.ResultView.RESULT_CHART_BUTTON_ID}">${QueryGraph.Dictionary.Dictionary.get("RESULTS_CHART_BUTTON")}</button>`;
    }

    content += `</div>`;

    content += "<table>";

    // Create table header
    content += "<tr>";
    for(let i = 0; i < selectVars.length; i++)
    {
      if(selectVars[i].visible)
      {
        if(graph.params.sortEnable && graph.params.sortVar == selectVars[i].value)
        {
          content += "<th style='background-color:#75cbc2'>" + selectVars[i].value + "</th>";
        }
        else
        {
          content += "<th>" + selectVars[i].value + "</th>";
        }
      }

      if(selectVars[i].label && selectVars[i].visibleLabel)
      {
        // If result type are all literal don't get label
        let allLiteral = true;
        for(let j = 0; j < data.results.bindings.length; j++)
        {
          if(data.results.bindings[j][selectVars[i].value] == undefined || data.results.bindings[j][selectVars[i].value]["type"] != "literal")
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
      else if(QueryGraph.Config.Config.label.enable && QueryGraph.Config.Config.main.tripleStore == QueryGraph.Config.TripleStoreType.WIKIDATA && selectVars[i].elementType == QueryGraph.Data.ElementType.EDGE && selectVars[i].visible)
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
        let value = "";
        let type = "";

        if(selectVars[j].visible)
        {
          if(data.results.bindings[i][selectVars[j].value])
          {
            value = data.results.bindings[i][selectVars[j].value]["value"];
            type = data.results.bindings[i][selectVars[j].value]["type"];

            if(type != "literal")
            {
              content += "<td><a href='"+value+"' target='_blank'>" + value + "</a></td>";
            }
            else
            {
              content += "<td>" + value + "</td>";
            }
          }
          else
          {
            content += "<td></td>";
          }
        }
        
        if(selectVars[j].label && !selectVars[j].allLiteral && selectVars[j].visibleLabel)
        {
          if(data.results.bindings[i][selectVars[j].label])
          {
            value = data.results.bindings[i][selectVars[j].label]["value"];
          }
          
          if(type == "literal")
          {
            content += "<td></td>";
          }
          else
          {
            content += "<td>" + value + "</td>";
          }
        }
        else if(QueryGraph.Config.Config.label.enable && QueryGraph.Config.Config.main.tripleStore == QueryGraph.Config.TripleStoreType.WIKIDATA && selectVars[j].elementType == QueryGraph.Data.ElementType.EDGE && selectVars[j].visible)
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
      content += "</tr>";
    }
    content += "</table>";

    $("#"+QueryGraph.Query.ResultView.RESULT_DIV_ID).html(content);

    // 
    $("#" + QueryGraph.Query.ResultView.RESULT_MAP_BUTTON_ID).click(function()
    {
      me.openExternalView("map/index.php", graph, data, selectVars, listEdgesLabel);
    });

    $("#" + QueryGraph.Query.ResultView.RESULT_TIMELINE_BUTTON_ID).click(function()
    {
      me.openExternalView("timeline/index.php", graph, data, selectVars, listEdgesLabel);
    });

    $("#" + QueryGraph.Query.ResultView.RESULT_CHART_BUTTON_ID).click(function()
    {
      me.openExternalView("chart/index.php", graph, data, selectVars, listEdgesLabel);
    });
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

  openExternalView(urlToPage, graph, data, selectVars, listEdgesLabel)
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
          nodes[nodes.length - 1]["uri"] = me.getUri(graph.nodes[i].elementInfos.uri);
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
        if(data.results.bindings[i][selectVars[j].value] && selectVars[j].visible)
        {
          let value = data.results.bindings[i][selectVars[j].value]["value"];
          let label = "";

          if(selectVars[j].label && selectVars[j].visibleLabel)
          {
            label = data.results.bindings[i][selectVars[j].label]["value"];
          }
          else if(QueryGraph.Config.Config.label.enable && selectVars[j].elementType == QueryGraph.Data.ElementType.EDGE)
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
    mapForm.action = url + urlToPage;

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

    var resultsJsonInput = document.createElement("input");
    resultsJsonInput.type = "text";
    resultsJsonInput.name = "config";
    resultsJsonInput.value = QueryGraph.Config.Config.fileName;
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
   * Send result data to graph result representation 
   * @param {QueryGraph.Data.Graph}     graph                    Graph manager
   * @param {Array}                     data                     Data result of the query
   * @param {Object[]}                  selectVars               List of selected query
   * @param {Object}                    listEdgesLabel           Object containing edges label with as key the type of edge
   */
  sendDataToGraph(graph, data, selectVars, listEdgesLabel)
  {
    this.openExternalView("resultGraph/index.php", graph, data, selectVars, listEdgesLabel);
    /*
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
          nodes[nodes.length - 1]["uri"] = me.getUri(graph.nodes[i].elementInfos.uri);
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
        if(data.results.bindings[i][selectVars[j].value] && selectVars[j].visible)
        {
          let value = data.results.bindings[i][selectVars[j].value]["value"];
          let label = "";

          if(selectVars[j].label && selectVars[j].visibleLabel)
          {
            label = data.results.bindings[i][selectVars[j].label]["value"];
          }
          else if(QueryGraph.Config.Config.label.enable && selectVars[j].elementType == QueryGraph.Data.ElementType.EDGE)
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

    var resultsJsonInput = document.createElement("input");
    resultsJsonInput.type = "text";
    resultsJsonInput.name = "config";
    resultsJsonInput.value = QueryGraph.Config.Config.fileName;
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
    */
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


