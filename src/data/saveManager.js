
/**
 * Class for menage query save in localstorage
 */
QueryGraph.Data.SaveManager = function()
{

}

/**
 * @property {String}             SAVE_BUTTON_HTML_ID             Button of save
 */
QueryGraph.Data.SaveManager.SAVE_BUTTON_HTML_ID = "saveDataButton";

/**
 * @property {Object}             loadManager              Loading manager
 */
QueryGraph.Data.SaveManager.prototype.loadManager;


/**
 * Init the Save actions, menage save button action
 * @param {QueryGraph.Graph}             graph              The graphe manager
 * @param {Object}                       loadManager        Loading manager
 */
QueryGraph.Data.SaveManager.prototype.init = function(graph, loadManager)
{
  var me = this;
  me.loadManager = loadManager;

  $("#" + QueryGraph.Data.SaveManager.SAVE_BUTTON_HTML_ID).click(function() 
  {
    var newName = prompt("Entrer votre nom du fichier", "");

    if (newName != null && newName != "") 
    {
      newName += "@sav";

      if(Object.keys(localStorage).includes(newName))
      {
        var r = confirm("Une sauvegarde avec le même nom existe déja, voulez-vous l'écraser");
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
};

/**
 * Add a new save in localStorage
 * @param {Object}                       newName            Name of the save
 * @param {QueryGraph.Graph}             graph              The graphe manager
 */
QueryGraph.Data.SaveManager.prototype.addNewSave = function(newName, graph)
{
  localStorage.setItem(newName, graph.toJson());

  this.loadManager.load();

  alert("Votre requête a été sauvegardée");
}