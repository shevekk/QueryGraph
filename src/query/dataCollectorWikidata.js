
if (typeof QueryGraph.Query == 'undefined') {
  QueryGraph.Query = {};
}

/**
 * Class for menage get data for graph creation
 */
QueryGraph.Query.DataCollectorWikidata = class DataCollectorWikidata extends QueryGraph.Query.DataCollector
{
  /**
   * Get edge types possible for the linked node type
   * @param {String}           linkedNodeType          Type of the linked node
   * @param {String}           linkedNodeUri           URI of the linked node
   * @param {Function}         callback                Callback with type URI and type label
   */
  getEdges(linkedNodeType, linkedNodeUri, callback)
  {
    let me = this;
    let query = "";

    if(linkedNodeType != "")
    {
      query = 'SELECT ?link ?linkLabel ';
      query += 'WHERE { ';
      query += ' '+linkedNodeType+' wdt:P1963 ?link ';
      query += ' SERVICE wikibase:label { bd:serviceParam wikibase:language "'+QueryGraph.Config.Config.getQueryLanguage()+'". } ';
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
      let queryURL = QueryGraph.Config.Config.endPoint + "?" + "query="+encodeURI(query) + "&format=json";

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
  }

  /**
   * Retrieve the labels corresponding to the link values
   * @param {String[]}         edgesValues          List of edges values
   * @param {Function}         callback             Callback with array of label in params
   */
  getEdgesLabels(edgesValues, callback)
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
      let id = linkSplit[linkSplit.length - 1];

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

    /**
     * Retrieve the labels corresponding to the link values
     * @param {String}           idsStr            List of ids in string
     * @param {Number[]}         idsList           List of ids in array
     * @param {Number}           num               The number of the list
     * @param {Number}           listNumber        Total number of lists
     */
    function getData(idsStr, idsList, num, listNumber)
    {
      let queryURL = "https://www.wikidata.org/w/api.php?"
      queryURL += "action=wbgetentities";
      queryURL += "&origin=*";
      queryURL += "&props=labels"; // Get labels
      queryURL += "&ids=" + idsStr;          
      queryURL += "&format=json";
      queryURL += "&languages=" + QueryGraph.Config.Config.getSearchLanguage();

      me.launchQuery(queryURL, function(data)
      {
        edgesLabelsArrays[num] = [];
        for(let i = 0; i < idsList.length; i++)
        {
          if(data["entities"][idsList[i]] != undefined && data["entities"][idsList[i]]["labels"][QueryGraph.Config.Config.getSearchLanguage()] != undefined)
          {
            let label = data["entities"][idsList[i]]["labels"][QueryGraph.Config.Config.getSearchLanguage()]["value"];
            edgesLabelsArrays[num].push(label);
          }
          else
          {
            edgesLabelsArrays[num].push("");
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
  }

  /**
   * Get the list of types of nodes
   * @param {Function}         callback             Callback with values keys list and values list in params
   */
  getNodesTypesList(callback)
  {
    let keysList = [];
    let valuesList = [];

    for (const key in QueryGraph.Config.Config.getNodeTypes())
    {
      let value = QueryGraph.Config.Config.getNodeTypes()[key];

      valuesList.push(value);
      keysList.push(key);
    }

    callback(keysList, valuesList);
  };

  /**
   * Get types of nodes from a text value
   * @param {String}           searchValue          The target search value
   * @param {Function}         callback             Callback with search result in params
   */
  getNodesTypes(searchValue, callback)
  {
    this.search(searchValue, function(result)
    {
      callback(result);
    });
  }

  /**
   * Get data of nodes from a text value
   * @param {String}           searchValue          The target search value
   * @param {Function}         callback             Callback with  search result in params
   */
  getNodesData(searchValue, callback)
  {
    this.search(searchValue, function(result)
    {
      callback(result);
    });
  }

  /**
   * Search from a text value
   * @param {String}           searchValue          The target search value
   * @param {Function}         callback             Callback with search result in params
   */
  search(searchValue, callback)
  {
    let me = this;
    let result = {};
    let limit = 15;

    let queryURL = "https://www.wikidata.org/w/api.php?";
    queryURL += "action=query";
    queryURL += "&origin=*";
    queryURL += "&list=search";
    queryURL += "&srlimit=" + QueryGraph.Config.Config.wikidataSearch.nbResult; // Limit of get element
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
        queryURL += "&languages=" + QueryGraph.Config.Config.getSearchLanguage();

        me.launchQuery(queryURL, function(data)
        {
          queryCount ++;
          
          let label = "";
          let description = "";
          
          if(data["entities"][title]["labels"][QueryGraph.Config.Config.getSearchLanguage()] != undefined)
          {
            label = data["entities"][title]["labels"][QueryGraph.Config.Config.getSearchLanguage()]["value"];
          }
          if(data["entities"][title]["descriptions"][QueryGraph.Config.Config.getSearchLanguage()] != undefined)
          {
            description = data["entities"][title]["descriptions"][QueryGraph.Config.Config.getSearchLanguage()]["value"];
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
  }
}





