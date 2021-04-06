
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
        errorMessage = QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_NODE_NO_EDGE");
      }

      if(graph.nodes[i].type == QueryGraph.Data.NodeType.ELEMENT)
      {
        empty = false;

        // Nodes name
        let name = graph.nodes[i].elementInfos.name;
        if(name == "")
        {
          valid = false;
          errorMessage = QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_NODE_NAME_EMPTY");
        }
        else if(name.indexOf(' ') >= 0)
        {
          valid = false;
          errorMessage = QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_NODE_NAME_WITH_SPACE");
        }
        else
        {
          if(namesList.indexOf(name) >= 0)
          {
            valid = false;
            errorMessage = QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_NODE_NAME_ALREADY_EXIST");
          }
          
          namesList.push(name);
        }
      }
      else if(graph.nodes[i].type == QueryGraph.Data.NodeType.DATA)
      {
        if(graph.nodes[i].dataInfos.uri == "")
        {
          valid = false;
          errorMessage = QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_NODE_URI_EMPTY");
        }
      }
      else if(graph.nodes[i].type == QueryGraph.Data.NodeType.FILTER)
      {
        if(graph.nodes[i].filterInfos.value == "")
        {
          valid = false;
          errorMessage = QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_NODE_FILTER_EMPTY_VALUE");
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
          errorMessage = QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_EDGE_URI_EMPTY");
        }
        if(graph.edges[i].nodeStart.type == QueryGraph.Data.NodeType.FILTER && graph.edges[i].nodeEnd.type == QueryGraph.Data.NodeType.FILTER)
        {
          valid = false;
          errorMessage = QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_TWO_NODE_FILTER_LINKED");
        }
        if(graph.edges[i].nodeStart.type == QueryGraph.Data.NodeType.DATA && graph.edges[i].nodeEnd.type == QueryGraph.Data.NodeType.FILTER)
        {
          valid = false;
          errorMessage = QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_NODE_FILTER_AND_DATA_LINKED");
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
          errorMessage = QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_EDGE_NAME_EMPTY");
        }
        else if(name.indexOf(' ') >= 0)
        {
          valid = false;
          errorMessage = QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_EDGE_NAME_WITH_SPACE");
        }
        else
        {
          if(namesList.indexOf(name) >= 0)
          {
            valid = false;
            errorMessage = QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_EDGE_NAME_ALREADY_EXIST");
          }
          
          namesList.push(name);
        }

        if(graph.edges[i].nodeStart.type == QueryGraph.Data.NodeType.FILTER || graph.edges[i].nodeEnd.type == QueryGraph.Data.NodeType.FILTER)
        {
          valid = false;
          errorMessage = QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_EDGE_WITH_FILTER_NO_FIXED");
        }
      }
    }

    if(empty)
    {
      valid = false;
      errorMessage = QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_EMPTY_QUERY");
    }
    else if(graph.params.checkAllInvisible())
    {
      valid = false;
      errorMessage = QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_ALL_EL_INVISIBLE");
    }

    // 
    if(valid == false)
    {
      alert(QueryGraph.Dictionary.Dictionary.get("QUERY_VALIDITY_BASE") + " : " + errorMessage);
    }

    return valid;
  }
}