if (typeof QueryGraph.Data == 'undefined') {
  QueryGraph.Data = {};
}

/**
 * Sort type
 */
QueryGraph.Data.ParamsSortType = 
{
  INCREASING: "insc",
  DECREASING: "desc"
}

/**
 * Class for menage a query params
 */
QueryGraph.Data.Params = class Params
{
  constructor()
  {
    /**
     * @property {Boolean}                                 sortEnable         True is sort is enable
     * @property {String}                                  sortVar            Sort selected vars
     * @property {QueryGraph.Data.ParamsSortType}          sortType           Sort type 
     * @property {Boolean}                                 limitEnable        True is limit is enable
     * @property {Number}                                  limitVal           Limit value
     * @property {Object[]}                                visibility         Visibility state of an element
     */
    this.sortEnable = false;
    this.sortVar = "";
    this.sortType = QueryGraph.Data.ParamsSortType.INCREASING;

    this.limitEnable = false;
    this.limitVal = 100;

    if(QueryGraph.Config.Config.main.limit)
    {
      this.limitEnable = true;
      this.limitVal = QueryGraph.Config.Config.main.limit;
    }

    this.visibility = [];
  }

  /**
   * Update the visibility list of element from var infos in the query select
   * @property {Object[]}             selectVars         var infos in the query select
   */
  updateVisiblityInfosList(selectVars)
  {
    // Adding missing elements
    for(let i = 0; i < selectVars.length; i++)
    {
      let selectVisibility = this.visibility.filter(visibility => visibility.name == selectVars[i].value);
      if(selectVisibility == null || selectVisibility.length == 0)
      {
        this.visibility.push({"name" : selectVars[i].value, "visibility" : true, "label": false});
      }

      // Get label 
      if(QueryGraph.Config.Config.label.enable && (QueryGraph.Config.Config.label.properties || QueryGraph.Config.Config.main.tripleStore == QueryGraph.Config.TripleStoreType.WIKIDATA) && selectVars[i].elementType != QueryGraph.Data.ElementType.EDGE)
      {
        // Check if property label
        let propertyLabel = this.getPropertyLabel(selectVars[i].typeUri);

        if(propertyLabel != "" || QueryGraph.Config.Config.main.tripleStore == QueryGraph.Config.TripleStoreType.WIKIDATA)
        {
          let selectVisibility = this.visibility.filter(visibility => visibility.name == selectVars[i].label);
          if(selectVisibility == null || selectVisibility.length == 0)
          {
            this.visibility.push({"name" : selectVars[i].label, "visibility" : true, "label": true});
          }
        }
      }
    }

    // Removal of excess elements
    for(let i = 0; i < this.visibility.length; i++)
    {
      let selectVisibility = selectVars.filter(selectVar => (this.visibility[i].name == selectVar.value) || (this.visibility[i].name == selectVar.label));
      if(selectVisibility == null || selectVisibility.length == 0)
      {
        this.visibility.splice(i,1);
        i--;
      }
    }
  }

  /**
   * retrieves the property corresponding to the label 
   * @property {String}             typeUri         URI of type of node
   */
  getPropertyLabel(typeUri)
  {
    let propertyLabel = "";

    if(QueryGraph.Config.Config.label.enable && QueryGraph.Config.Config.label.properties)
    {
      if(typeUri.includes("http:"))
      {
        if(typeUri.startsWith('<'))
        {
          typeUri = typeUri.substr(1, typeUri.length - 2);
        }
        
        for (const prop in QueryGraph.Config.Config.prefix) 
        {
          typeUri = typeUri.replace(QueryGraph.Config.Config.prefix[prop], prop + ":");
        }
      }

      if(QueryGraph.Config.Config.label.properties.hasOwnProperty(typeUri))
      {
        propertyLabel = QueryGraph.Config.Config.label.properties[typeUri];
      }
      else if(QueryGraph.Config.Config.label.properties.hasOwnProperty("*"))
      {
        propertyLabel = QueryGraph.Config.Config.label.properties["*"];
      }
    }
    return propertyLabel;
  }

  /**
   * Update the visibility list order
   * @property {String}             name         Name of the element that will be moved
   * @property {Boolean}            up           True for Up move, false for down move
   */
  updateVisibilityOrder(name, up)
  {
    let index = this.visibility.findIndex(visibility => visibility.name == name);
    let visibilityEl = this.visibility[index];

    // get label of the element
    let visibilityElLabel = null;
    if(this.visibility.length > index+1 && this.visibility[index+1].label)
    {
      visibilityElLabel = this.visibility[index+1];
    }

    // remove elements
    if(visibilityElLabel != null)
        this.visibility.splice(index, 2); 
      else
        this.visibility.splice(index, 1)

    if(up)
    {
      if(index > 0 && this.visibility[index-1].label)
      {
        if(visibilityElLabel != null)
          this.visibility.splice(index-2, 0, visibilityEl, visibilityElLabel); // add elements
        else
          this.visibility.splice(index-2, 0, visibilityEl); // add element
      }
      else
      {
        if(visibilityElLabel != null)
          this.visibility.splice(index-1, 0, visibilityEl, visibilityElLabel); // add elements
        else
          this.visibility.splice(index-1, 0, visibilityEl); // add element
      }
    }
    else
    {
      if(this.visibility.length > index+1 && this.visibility[index+1].label)
      {
        if(visibilityElLabel != null)
          this.visibility.splice(index+2, 0, visibilityEl, visibilityElLabel); // add elements
        else
          this.visibility.splice(index+2, 0, visibilityEl); // add element
      }
      else
      {
        if(visibilityElLabel != null)
          this.visibility.splice(index+1, 0, visibilityEl, visibilityElLabel); // add elements
        else
          this.visibility.splice(index+1, 0, visibilityEl); // add element
      }
    }
  }

  /**
   * Get visibility information for a display element
   * @param {String}                       name                The name of the element
   */
  getVisiblityInfos(name)
  {
    let info = null;

    info = this.visibility.filter(visibility => visibility.name == name)[0];
    let index = this.visibility.findIndex(visibility => visibility.name == name);
    info.order = index;

    return info;
  }

  /**
   * Check if all element are invisible
   */
  checkAllInvisible()
  {
    var allInvisible = true;

    for(let i = 0; i < this.visibility.length; i++)
    {
      if(this.visibility[i].visibility)
        allInvisible = false;
    }

    return allInvisible;
  }

  /**
   * Export the graph params to a json object
   * @return {Object}                      Json params data 
   */
  toJson()
  {
    let params = {};

    params["sortEnable"] = this.sortEnable;
    params["sortVar"] = this.sortVar;
    params["sortType"] = this.sortType;
    params["limitEnable"] = this.limitEnable;
    params["limitVal"] = this.limitVal;
    params["visibility"] = this.visibility;

    return params;
  }

  /**
   * Import graph params from a saved query
   * @param {Object}            data          Params data export object
   */
  fromJson(data)
  {
    this.sortEnable = data["sortEnable"];
    this.sortVar = data["sortVar"];
    this.sortType = data["sortType"];

    this.limitEnable = data["limitEnable"];
    this.limitVal = data["limitVal"];

    if(data.hasOwnProperty("visibility"))
    {
      this.visibility = data["visibility"];
    }
    
  }
}