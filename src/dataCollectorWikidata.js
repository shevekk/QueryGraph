/**
 * Class for menage get data for graph creation
 */
QueryGraph.DataCollectorWikidata = function()
{
  QueryGraph.DataCollector.call(this);
};
QueryGraph.DataCollectorWikidata.prototype = Object.create(QueryGraph.DataCollector.prototype);

/**
 * Get edge types possible for the linked node type
 * @param {String}           linkedNodeType          Type of the linked node
 * @param {String}           linkedNodeUri           URI of the linked node
 * @param {Function}         callback                Callback with type URI and type label
 */
QueryGraph.DataCollectorWikidata.prototype.getEdges = function(linkedNodeType, linkedNodeUri, callback)
{
  let me = this;
  let query = "";

  if(linkedNodeType != "")
  {
    query = 'SELECT ?link ?linkLabel ';
    query += 'WHERE { ';
    query += ' '+linkedNodeType+' wdt:P1963 ?link ';
    query += ' SERVICE wikibase:label { bd:serviceParam wikibase:language "'+QueryGraph.Config.language+'". } ';
    query += '}';
  }
  else if(linkedNodeUri != "")
  {
    query = 'SELECT ?link ';
    query += 'WHERE { ';
    query +=  ' '+linkedNodeUri+' ?link ?linkedElement ';
    query += '} ';
    query += 'GROUP BY ?link ';
  }

  if(query)
  {
    let queryURL = QueryGraph.Config.endPoint + "?" + "query="+encodeURI(query) + "&format=json";

    me.launchQuery(queryURL, function(data)
    {
      let edgesValues = [];
      let edgesLabels = [];

      if(linkedNodeType != "")
      {
        for(let i = 0; i < data.results.bindings.length; i++)
        {
          let link = data.results.bindings[i]["link"]["value"];
          let linkSplit = link.split("/");
          edgesValues.push("wdt:" + linkSplit[linkSplit.length - 1]);

          edgesLabels.push(data.results.bindings[i]["linkLabel"]["value"]);
        }

        callback(edgesValues, edgesLabels);
      }
      else if(linkedNodeUri != "")
      {
        for(let i = 0; i < data.results.bindings.length; i++)
        {
          edgesValues.push(data.results.bindings[i]["link"]["value"]);
        }

        me.getEdgesLabels(edgesValues, function(newEdgesValues, edgesLabels)
        {
          callback(newEdgesValues, edgesLabels);
        });
      }
    });
  }
  else
  {
    callback([], []);
  }
};

QueryGraph.DataCollectorWikidata.prototype.getEdgesLabels = function(edgesValues, callback)
{
  var me = this;

  let edgesLabels = [];
  let edgesLabelsArrays = [];
  let idsStr = [];
  let idsList = [];

  idsList.push([]);
  idsStr.push("");

  let numList = 0;
  let numListRetrieved = 0;

  for(let i = 0; i < edgesValues.length; i++)
  {
    let linkSplit = edgesValues[i].split("/");
    //edgesValues.push("wdt:" + linkSplit[linkSplit.length - 1]);
    let id = linkSplit[linkSplit.length - 1];
    //let id = edgesValues[i].split(':')[1];

    if(!idsList.includes(id) && id.startsWith("P"))
    {
      if(idsList[numList].length >= 49)
      {
        idsList.push([]);
        idsStr.push("");
        numList ++;
      }

      if(idsList[numList].length != 0)
      {
        idsStr[numList] += "|";
      }

      idsList[numList].push(id);
      idsStr[numList] += id;  
    }
    else
    {
      edgesValues.splice(i, 1); 
      i --;
    }
  }

  for(let i = 0; i < idsStr.length; i++)
  {
    getData(idsStr[i], idsList[i], i, numList);
  }

  // 
  function getData(idsStr, idsList, num, listNumber)
  {
    let queryURL = "https://www.wikidata.org/w/api.php?"
    queryURL += "action=wbgetentities";
    queryURL += "&origin=*";
    queryURL += "&props=labels"; // Get labels
    queryURL += "&ids=" + idsStr;          
    queryURL += "&format=json"; 
    queryURL += "&languages=" + QueryGraph.Config.wikidataSearch.language;

    me.launchQuery(queryURL, function(data)
    {
      edgesLabelsArrays[num] = [];
      for(let i = 0; i < idsList.length; i++)
      {
        if(data["entities"][idsList[i]] != undefined && data["entities"][idsList[i]]["labels"][QueryGraph.Config.wikidataSearch.language] != undefined)
        {
          label = data["entities"][idsList[i]]["labels"][QueryGraph.Config.wikidataSearch.language]["value"];
          edgesLabelsArrays[num].push(label);
        }
        else
        {
          edgesLabelsArrays[num].push(label);
        }
      }

      numListRetrieved ++;
      if(numListRetrieved > listNumber)
      {
        for(let i = 0; i < edgesLabelsArrays.length; i++)
        {
          edgesLabels = edgesLabels.concat(edgesLabelsArrays[i]);
        }

        callback(edgesValues, edgesLabels);
      }
    });
  }

  // Limit 50

    
};

/**
 * Get the list of types of nodes
 */
QueryGraph.DataCollectorWikidata.prototype.getNodesTypesList = function(callback)
{
  let keysList = [];
  let valuesList = [];

  for (const key in QueryGraph.Config.nodeTypes)
  {
    let value = QueryGraph.Config.nodeTypes[key];

    valuesList.push(value);
    keysList.push(key);
  }

  callback(keysList, valuesList);
};

/**
 * Get types of nodes from a text value
 * @param {String}           searchValue          The target search value
 * @param {Function}         callback             Callback with 
 */
QueryGraph.DataCollectorWikidata.prototype.getNodesTypes = function(searchValue, callback)
{
  this.search(searchValue, function(result)
  {
    callback(result);
  });
};

/**
 * Get data of nodes from a text value
 * @param {String}           searchValue          The target search value
 * @param {Function}         callback             Callback with 
 */
QueryGraph.DataCollectorWikidata.prototype.getNodesData = function(searchValue, callback)
{
  this.search(searchValue, function(result)
  {
    callback(result);
  });
};

/**
 * Search from a text value
 * @param {String}           searchValue          The target search value
 * @param {Function}         callback             Callback with 
 */
QueryGraph.DataCollectorWikidata.prototype.search = function(searchValue, callback)
{
  let me = this;
  let result = {};
  let limit = 15;

  let queryURL = "https://www.wikidata.org/w/api.php?";
  queryURL += "action=query";
  queryURL += "&origin=*";
  queryURL += "&list=search";
  queryURL += "&srlimit=" + QueryGraph.Config.wikidataSearch.nbResult; // Limit of get element
  queryURL += "&format=json";
  queryURL += "&srsearch="  + searchValue;

  me.launchQuery(queryURL, function(data)
  {
    let searchResults = data["query"]["search"];

    let totalQuery = searchResults.length;
    let queryCount = 0;
    
    for(let i = 0; i < searchResults.length; i++)
    {
      let title = searchResults[i]["title"];

      let queryURL = "https://www.wikidata.org/w/api.php?"
      queryURL += "action=wbgetentities";
      queryURL += "&origin=*";
      queryURL += "&props=labels|descriptions"; // Get labels and descriptions
      queryURL += "&ids="  + title;             // 
      queryURL += "&format=json"; 
      queryURL += "&languages=" + QueryGraph.Config.wikidataSearch.language;

      me.launchQuery(queryURL, function(data)
      {
        queryCount ++;
        
        let label = "";
        let description = "";
        
        if(data["entities"][title]["labels"][QueryGraph.Config.wikidataSearch.language] != undefined)
        {
          label = data["entities"][title]["labels"][QueryGraph.Config.wikidataSearch.language]["value"];
        }
        if(data["entities"][title]["descriptions"][QueryGraph.Config.wikidataSearch.language] != undefined)
        {
          description = data["entities"][title]["descriptions"][QueryGraph.Config.wikidataSearch.language]["value"];
        }
        
        result[title] = {};
        result[title]["label"] = label;
        result[title]["description"] = description;
        result[title]["uri"] = "wd:" + title;

        if(queryCount >= totalQuery)
        {
          callback(result);
        }
        
      });
    }

  });
};