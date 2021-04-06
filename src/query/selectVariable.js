
if (typeof QueryGraph.Query == 'undefined') {
  QueryGraph.Query = {};
}

/**
 * Class for store select variable
 */
QueryGraph.Query.SelectVariable = class SelectVariable
{

  constructor(value, label, elementType) 
  {
    /**
     * @property {String}                             value                 Select name of the variable
     * @property {Boolean}                            visible               Visible state
     * @property {String}                             label                 Select name of the label variable
     * @property {Boolean}                            visibleLabel          Visible state of the label
     * @property {QueryGraph.Data.ElementType}        elementType           Type of the variable (node or edge)
     * @property {Number}                             order                 Order number
    */

    this.value = value;
    this.visible = true;
    this.label = label;
    this.visibleLabel = false;
    this.elementType = elementType;
    this.order = 0;
  }
}