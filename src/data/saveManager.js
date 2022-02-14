
/**
 * Class for menage query save in localstorage
 */
QueryGraph.Data.SaveManager = class SaveManager 
{

  constructor() 
  {
    /**
     * @property {QueryGraph.Data.LoadManager}             loadManager              Loading manager
     */
    this.loadManager = null;
  }

  /**
   * @property {String}             SAVE_BUTTON_HTML_ID             Button of save
   */
  static SAVE_BUTTON_HTML_ID = "saveDataButton";

  /**
   * Init the Save actions, menage save button action
   * @param {QueryGraph.Data.Graph}             graph              The graphe manager
   * @param {Object}                       loadManager        Loading manager
   */
  init(graph, loadManager)
  {
    var me = this;
    me.loadManager = loadManager;

    $("#" + QueryGraph.Data.SaveManager.SAVE_BUTTON_HTML_ID).click(function() 
    {
      var newName = prompt(QueryGraph.Dictionary.Dictionary.get("SAVE_BUTTON_CHOISE_NAME") , "");

      if (newName != null && newName != "") 
      {
        newName += "@sav";

        if(Object.keys(localStorage).includes(newName))
        {
          var r = confirm(QueryGraph.Dictionary.Dictionary.get("SAVE_BUTTON_FILE_ALREADY_EXIST"));
          if (r == true) 
          {
            me.addNewSave(newName, graph);
          }
          else 
          {
            
          }
        }
        else
        {
          me.addNewSave(newName, graph);
        }
      }
    });
  }

  /**
   * Add a new save in localStorage
   * @param {Object}                       newName            Name of the save
   * @param {QueryGraph.Data.Graph}             graph              The graphe manager
   */
  addNewSave(newName, graph)
  {
    localStorage.setItem(newName, graph.toJson());

    this.loadManager.load();

    alert(QueryGraph.Dictionary.Dictionary.get("SAVE_BUTTON_OK"));
  }
}