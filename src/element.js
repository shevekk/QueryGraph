
QueryGraph.Element = function()
{

}

/*
 * @property {QueryGraph.Edge.Type}                type                  Type of the edge
 * @property {String}                              id                    Id of the edge
 */
QueryGraph.Element.prototype.type;
QueryGraph.Element.prototype.id;

QueryGraph.Element.TYPE = {
  NODE: "NODE",
  EDGE: "EDGE"
}

/**
 * Set the type of the element and init design from type
 * @param {QueryGraph.Edge.Type}                  type                   New type of the edge
 * @param {QueryGraph.Graph}                      graph                  The graphe manager
 */
QueryGraph.Element.prototype.setType = function(type, graph)
{

};