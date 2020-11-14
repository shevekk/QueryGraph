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
 * @param {Function}         callback                Callback with type URI and type label
 */
QueryGraph.DataCollectorWikidata.prototype.getEdges = function(linkedNodeType, callback)
{
  let me = this;

  let query = 'SELECT ?link ?linkLabel ';
  query += 'WHERE { ';
  query += ' '+linkedNodeType+' wdt:P1963 ?link ';
  query += ' SERVICE wikibase:label { bd:serviceParam wikibase:language "'+QueryGraph.Config.language+'". } ';
  query += '}';

  let queryURL = QueryGraph.Config.endPoint + "?" + "query="+encodeURI(query) + "&format=json";

  me.launchQuery(queryURL, function(data)
  {
    let edgesValues = [];
    let edgesLabels = [];

    for(let i = 0; i < data.results.bindings.length; i++)
    {
      let link = data.results.bindings[i]["link"]["value"];
      let linkSplit = link.split("/");
      edgesValues.push("wdt:" + linkSplit[linkSplit.length - 1]);

      edgesLabels.push(data.results.bindings[i]["linkLabel"]["value"]);
    }

    callback(edgesValues, edgesLabels);
  });
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
        if(data["entities"][title]["labels"][QueryGraph.Config.wikidataSearch.language] != undefined)
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