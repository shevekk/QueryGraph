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
     */
    this.sortEnable = false;
    this.sortVar = "";
    this.sortType = QueryGraph.Data.ParamsSortType.INCREASING;

    this.limitEnable = false;
    this.limitVal = 100;

    if(QueryGraph.Config.Config.limit)
    {
      this.limitEnable = true;
      this.limitVal = QueryGraph.Config.Config.limit;
    }
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
  }
}