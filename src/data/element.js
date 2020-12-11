if (typeof QueryGraph.Data == 'undefined') {
  QueryGraph.Data = {};
}

/**
 * Class for ui edge
 */
QueryGraph.Data.Element = class Element
{
  constructor()
  {
    /*
     * @property {QueryGraph.Data.EdgeType}                type                  Type of the edge
     * @property {String}                              id                    Id of the edge
     */

    this.type;
    this.id;
  }

  /**
   * Set the type of the element and init design from type
   * @param {QueryGraph.Data.EdgeType}                  type                   New type of the edge
   * @param {QueryGraph.Data.Graph}                      graph                  The graphe manager
   */
  setType(type, graph)
  {

  }
}