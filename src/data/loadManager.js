if (typeof QueryGraph.Data == 'undefined') {
  QueryGraph.Data = {};
}

/**
 * Class for menage data loading of stored query in file and in localstorage
 */
QueryGraph.Data.LoadManager = class LoadManager 
{
  constructor() 
  {
    /**
     * @property {Object}             dataFileContent              Data loaded from data.json file
     */
    this.dataFileContent = {};
  }

  /**
   * @property {String}             LOAD_BUTTON_HTML_ID             Button of loading
   * @property {String}             LOAD_SELECT_HTML_ID             Loading select
   */
  static LOAD_BUTTON_HTML_ID = "loadDataButton";
  static LOAD_SELECT_HTML_ID = "loadingSelect";

  /**
   * Init the Loading actions, load select content and menage load button action
   * @param {QueryGraph.Data.Graph}             graph              The graphe manager
   */
  init(graph)
  {
    let me = this; 

    this.load();

    // menage load button action
    $("#" + QueryGraph.Data.LoadManager.LOAD_BUTTON_HTML_ID).click(function()
    {
      let name = $("#" + QueryGraph.Data.LoadManager.LOAD_SELECT_HTML_ID).val();

      if(name.endsWith("@sav"))
      {
        // Load from localstorage 
        let str = localStorage.getItem(name);
        let jsonObject = JSON.parse(str) || {};

        graph.fromJson(jsonObject); 
      }
      else
      {
        // Load from data file
        graph.fromJson(me.dataFileContent[name].data); 
      }
    });
  }

  /**
   * Load select content from data file and localstorage
   */
  load()
  {
    let me = this;

    $("#" + QueryGraph.Data.LoadManager.LOAD_SELECT_HTML_ID).html("");

    let jqxhr = $.getJSON("data/data.json", null)
    .done(function(content)
    {
      me.dataFileContent = content;

      // Get data in the json 
      for (const key in content)
      {
        $("#" + QueryGraph.Data.LoadManager.LOAD_SELECT_HTML_ID).append(new Option(content[key].title, key));
      }

      // Get local saves
      let keys = Object.keys(localStorage);
      for(let i = 0; i < keys.length; i++)
      {
        if(keys[i].endsWith("@sav"))
        {
          $("#" + QueryGraph.Data.LoadManager.LOAD_SELECT_HTML_ID).append(new Option(keys[i].replace('@sav', ''), keys[i]));
        }
      }
    })
    .fail(function(d, textStatus, error)
    {
      console.error("getJSON failed, status: " + textStatus + ", error: "+error);
    })
    .always(function()
    {

    });
  }
}