
if (typeof QueryGraph.Query == 'undefined') {
  QueryGraph.Query = {};
}

/**
 * Class for menage data loading of stored query in file and in localstorage
 */
QueryGraph.Query.CheckDataValidity = class CheckDataValidity 
{
  /**
   * Check validity of graph data
   * @param {QueryGraph.Data.Graph}                     graph                     The graph manager
   */
  static check(graph)
  {
    let valid = true;
    let errorMessage = "";
    let namesList = [];
    let empty = true;

    // Nodes
    for(let i = 0; i < graph.nodes.length; i++)
    {
      if(graph.nodes[i].edges.length == 0 && graph.nodes[i].reverseEdges.length == 0)
      {
        valid = false;
        errorMessage = "L'un de vos noeuds n'est lié à aucun autre noeuds";
      }

      if(graph.nodes[i].type == QueryGraph.Data.NodeType.ELEMENT)
      {
        empty = false;

        // Nodes name
        let name = graph.nodes[i].elementInfos.name;
        if(name == "")
        {
          valid = false;
          errorMessage = "Le nom d'un de vos noeuds est vide";
        }
        else if(name.indexOf(' ') >= 0)
        {
          valid = false;
          errorMessage = "Le nom d'une de vos noeuds contient un espace";
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
      else if(graph.nodes[i].type == QueryGraph.Data.NodeType.DATA)
      {
        if(graph.nodes[i].dataInfos.uri == "")
        {
          valid = false;
          errorMessage = "L'URI d'un de vos noeud est vide";
        }
      }
      else if(graph.nodes[i].type == QueryGraph.Data.NodeType.FILTER)
      {
        if(graph.nodes[i].filterInfos.value == "")
        {
          valid = false;
          errorMessage = "L'un de vos noeuds filtre possède une valeur vide";
        }
      }
    }

    // Edges
    for(let i = 0; i < graph.edges.length; i++)
    {
      if(graph.edges[i].type == QueryGraph.Data.EdgeType.FIXED)
      {
        if(graph.edges[i].uri == "")
        {
          valid = false;
          errorMessage = "L'URI d'un de vos liens fixe est vide";
        }
        if(graph.edges[i].nodeStart.type == QueryGraph.Data.NodeType.FILTER && graph.edges[i].nodeEnd.type == QueryGraph.Data.NodeType.FILTER)
        {
          valid = false;
          errorMessage = "Impossible de liés deux noeuds de type Filter";
        }
        if(graph.edges[i].nodeStart.type == QueryGraph.Data.NodeType.DATA && graph.edges[i].nodeEnd.type == QueryGraph.Data.NodeType.FILTER)
        {
          valid = false;
          errorMessage = "Impossible de liés un noeud de type Donnée à un noeuds de type Filter";
        }
      }
      else if(graph.edges[i].type == QueryGraph.Data.EdgeType.VARIABLE)
      {
        empty = false;
        
        // Edges name
        let name = graph.edges[i].name;
        if(name == "")
        {
          valid = false;
          errorMessage = "Le nom d'un de vos liens est vide";
        }
        else if(name.indexOf(' ') >= 0)
        {
          valid = false;
          errorMessage = "Le nom d'un de vos liens contient un espace";
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

        if(graph.edges[i].nodeStart.type == QueryGraph.Data.NodeType.FILTER || graph.edges[i].nodeEnd.type == QueryGraph.Data.NodeType.FILTER)
        {
          valid = false;
          errorMessage = "Les liens avec un filtre doivent être de type fixe";
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
  }
}