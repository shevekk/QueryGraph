if (typeof QueryGraph == 'undefined') {
  QueryGraph = {};
}

if (typeof QueryGraph.Map == 'undefined') {
  QueryGraph.Map = {};
}

/**
 * Main class 
 */
QueryGraph.Map.Map = class Map 
{
  /*
   * Class for display map from query result data
   * @param {Object}                       graphJson                    Query graph informations
   * @param {Object[]}                     dataJson                     Data result information
   * @param {L.map}                        map                          Map element
   * @param {L.markerClusterGroup}         pointLayer                   Layer of all markers
   */
  constructor(graphJson, dataJson)
  {
    this.map = null;
    this.baseGraph = JSON.parse(graphJson);
    this.data = JSON.parse(dataJson);

    this.pointLayer = new L.markerClusterGroup();
  }

  /**
   * Init map, UI and  
   */
  init()
  {
    let me = this;

    me.initMap();

    let nodesVarNames = [];
    for(let i = 0; i < this.baseGraph.nodes.length; i++)
    {
      if(this.baseGraph.nodes[i].type == "Element")
      {
        nodesVarNames.push(this.baseGraph.nodes[i].name);
      }
    }

    // Create html content of UI
    let htmlContent = "<label>"+QueryGraph.Dictionary.Dictionary.get("MAP_LABEL_DESCRIPTION")+" : </label><select id='descriptionSelect'>";
    for(let i = 0; i < nodesVarNames.length; i++)
    {
      htmlContent += `   <option value="${nodesVarNames[i]}">${nodesVarNames[i]}</option>`;
    }
    htmlContent += "</select>";

    htmlContent += "<label>"+QueryGraph.Dictionary.Dictionary.get("MAP_LABEL_COORDS")+" : </label><select id='coordsSelect'>";
    for(let i = 0; i < nodesVarNames.length; i++)
    {
      htmlContent += `   <option value="${nodesVarNames[i]}">${nodesVarNames[i]}</option>`;
    }
    htmlContent += "</select>";
    htmlContent += `<button id="OkButton">${QueryGraph.Dictionary.Dictionary.get("MAP_LABEL_OK")}</button>`;

    $("#selectDiv").html(htmlContent);

    // Display map
    $("#OkButton").click(function()
    {
      let coordsVar = $("#coordsSelect").val();
      let descriptionVar = $("#descriptionSelect").val();
      
      me.drawMap(descriptionVar, coordsVar);

      $("#selectDiv").css("display", "none");
      $("#map").css("display", "inline-block");

      $("#changePropDiv").html(`<button id="changePropButton">${QueryGraph.Dictionary.Dictionary.get("MAP_CHANGE_PROPERTIES")}</button>`);

      $("#changePropButton").click(function()
      {
        $("#selectDiv").css("display", "inline-block");
        $("#changePropDiv").html("");
        $("#map").css("display", "none");
      });
    });
  }

  /**
   * Init map display
   */
  initMap()
  {
    let me = this;

    me.map = L.map('map', {
      center: [46.7213889, 2.4011111],
      zoom: 6
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(me.map);

    $("#map").css("display", "none");

    me.map.addLayer(me.pointLayer);
  }

  /**
   * Draw point of the map
   * @param {String}                   descriptionVar                The selected description variable
   * @param {String}                   coordsVar                     The selected coordinates variable
   */
  drawMap(descriptionVar, coordsVar)
  {
    let me = this;

    let pointArray = [];

    me.pointLayer.clearLayers();

    // Create point from data
    let listElement = [];
    let numline = 0;
    let description = "";
    let descriptionLink = "";
    let coords = "";
    for(let i = 0; i < this.data.length; i++)
    {
      if(this.data[i].var == descriptionVar)
      {
        if(this.data[i].label)
        {
          description = this.data[i].label;
          descriptionLink = this.data[i].value;
        }
        else
        {
          description = this.data[i].value;
          descriptionLink = this.data[i].value;
        }
      }
      if(this.data[i].var == coordsVar)
      {
        coords = this.data[i].value;
      }

      if(i == this.data.length-1 || this.data[i].lineNumber != this.data[i+1].lineNumber)
      {
        listElement.push({description: description, descriptionLink: descriptionLink, coords: coords});
      }
    }

    for(let i = 0; i < listElement.length; i++)
    {
      let coords = listElement[i].coords;
      if(coords.startsWith('Point'))
      {
        coords = this.transformPoint(coords);
      }
      else if(typeof coords == "string")
      {
        coords = coords.split(" ");
      }

      if (coords.length == 2) 
      {
        try
        {
          let point = L.marker(coords).bindPopup(`<a href="${listElement[i].descriptionLink}" target="_blank">${listElement[i].description}</a>`);

          pointArray.push(point);

          me.pointLayer.addLayer(point);
        } 
        catch(err)
        {
        }
      }
    }

    // Modify bounds
    if(pointArray.length > 0)
    {
      me.map.fitBounds(L.featureGroup(pointArray).getBounds());
    }
  }

  /**
   * Draw point of the map
   * @param {String}                   wkt                The wkt cordonate content
   * @return {Array}                                      The coords array
   */
  transformPoint(wkt)
  {
    let str = wkt.replace('Point(', '').replace(')', '');
    let coords = str.split(' ');
    coords = coords.reverse();
    
    return coords;
  }
}
