/**
 * 
 */
QueryGraph.CheckDataValidity = function()
{

};

/**
 * Check validity of graph data
 * @param {QueryGraph.Graph}                     graph                     The graph manager
 */
QueryGraph.CheckDataValidity.Check = function(graph)
{
  let valid = true;
  let errorMessage = "";
  let namesList = [];
  let empty = true;

  // Nodes
  for(let i = 0; i < graph.nodes.length; i++)
  {
    if(graph.nodes[i].type == QueryGraph.Node.Type.ELEMENT)
    {
      empty = false;

      // Nodes name
      let name = graph.nodes[i].elementInfos.name;
      if(name == "")
      {
        valid = false;
        errorMessage = "Le nom d'un de vos noeuds est vide";
      }
      else
      {
        if(namesList.indexOf(name) >= 0)
        {
          valid = false;
          errorMessage = "Le nom d'un de vos noeuds existe deja";
        }
        
        namesList.push(name);
      }
    }
    else if(graph.nodes[i].type == QueryGraph.Node.Type.DATA)
    {
      if(graph.nodes[i].dataInfos.uri == "")
      {
        valid = false;
        errorMessage = "l'URI d'un de vos noeud est vide";
      }
    }
  }

  // Edges
  for(let i = 0; i < graph.edges.length; i++)
  {
    if(graph.edges[i].type == QueryGraph.Edge.Type.FIXE)
    {
      if(graph.edges[i].uri == "")
      {
        valid = false;
        errorMessage = "l'URI d'un de vos liens est vide";
      }
    }
    else if(graph.edges[i].type == QueryGraph.Edge.Type.VARIABLE)
    {
      empty = false;
      
      // Edges name
      let name = graph.edges[i].name;
      if(name == "")
      {
        valid = false;
        errorMessage = "Le nom d'un de vos liens est vide";
      }
      else
      {
        if(namesList.indexOf(name) >= 0)
        {
          valid = false;
          errorMessage = "Le nom d'un de vos liens existe deja";
        }
        
        namesList.push(name);
      }
    }
  }

  if(empty)
  {
    valid = false;
    errorMessage = "La requête est vide";
  }

  // 
  if(valid == false)
  {
    alert("Impossible de lancer la requête : " + errorMessage);
  }

  return valid;
};
