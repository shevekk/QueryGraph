if (typeof QueryGraph == 'undefined') {
  QueryGraph = {};
}

if (typeof QueryGraph.TimeLine == 'undefined') {
  QueryGraph.TimeLine = {};
}

/**
 * Main class 
 */
QueryGraph.TimeLine.TimeLine = class TimeLine 
{
  /*
   * Class for display map from query result data
   * @param {Object}                       graphJson                    Query graph informations
   * @param {Object[]}                     dataJson                     Data result information
   * @param {vis.DataSet}                  items                        Items of the timeline
   * @param {vis.Timeline}                 timeline                     Timeline
   */
  constructor(graphJson, dataJson)
  {
    this.baseGraph = JSON.parse(graphJson);
    this.data = JSON.parse(dataJson);

    let container = document.getElementById('timeLine');
    let options = {};
    this.items = new vis.DataSet([]);

    this.timeline = null;
  }

  /**
   * Init timeline and UI
   */
  init()
  {
    let me = this;

    let nodesVarNames = [];
    for(let i = 0; i < this.baseGraph.nodes.length; i++)
    {
      if(this.baseGraph.nodes[i].type == "Element")
      {
        nodesVarNames.push(this.baseGraph.nodes[i].name);
      }
    }

    // Create html content of UI
    let htmlContent = "<label>"+QueryGraph.Dictionary.Dictionary.get("TIMELINE_LABEL_DESCRIPTION")+" : </label><select id='descriptionSelect'><option value=''></option>";
    for(let i = 0; i < nodesVarNames.length; i++)
    {
      htmlContent += `   <option value="${nodesVarNames[i]}">${nodesVarNames[i]}</option>`;
    }
    htmlContent += "</select>";

    htmlContent += "<label>"+QueryGraph.Dictionary.Dictionary.get("TIMELINE_LABEL_START")+" : </label><select id='startSelect'><option value=''></option>";
    for(let i = 0; i < nodesVarNames.length; i++)
    {
      htmlContent += `   <option value="${nodesVarNames[i]}">${nodesVarNames[i]}</option>`;
    }
    htmlContent += "</select>";

    htmlContent += "<label>"+QueryGraph.Dictionary.Dictionary.get("TIMELINE_LABEL_END")+" : </label><select id='endSelect'><option value=''></option>";
    for(let i = 0; i < nodesVarNames.length; i++)
    {
      htmlContent += `   <option value="${nodesVarNames[i]}">${nodesVarNames[i]}</option>`;
    }
    htmlContent += "</select>";
    htmlContent += `<button id="OkButton">${QueryGraph.Dictionary.Dictionary.get("TIMELINE_LABEL_OK")}</button>`;

    $("#selectDiv").html(htmlContent);

    // Manage ok button
    $("#OkButton").click(function()
    {
      let descriptionVar = $("#descriptionSelect").val();
      let startSelect = $("#startSelect").val();
      let endSelect = $("#endSelect").val();

      me.drawTimeLine(descriptionVar, startSelect, endSelect);

      $("#selectDiv").css("display", "none");
      $("#timeLine").css("display", "inline");

      $("#changePropDiv").html(`<button id="changePropButton">${QueryGraph.Dictionary.Dictionary.get("MAP_CHANGE_PROPERTIES")}</button>`);

      $("#changePropButton").click(function()
      {
        $("#selectDiv").css("display", "inline-block");
        $("#changePropDiv").html("");
        $("#timeLine").css("display", "none");

        me.items = new vis.DataSet([]);
        me.timeline.destroy()
      });
    });
  }

  /**
   * Draw point of the map
   * @param {String}                   descriptionVar                The selected description variable
   * @param {String}                   startSelect                   The selected start date variable
   * @param {String}                   endSelect                     The selected end date variable
   */
  drawTimeLine(descriptionVar, startSelect, endSelect)
  {
    let me = this;

    // Create list of elements from data
    let listElement = [];
    let description = "";
    let descriptionLink = "";
    let start = "";
    let end = "";
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
      else if(this.data[i].var == startSelect)
      {
        start = this.data[i].value;
      }
      else if(this.data[i].var == endSelect)
      {
        end = this.data[i].value;
      }

      if(i == this.data.length-1 || this.data[i].lineNumber != this.data[i+1].lineNumber)
      {
        listElement.push({description: description, descriptionLink: descriptionLink, start: start, end: end});

        description = "";
        descriptionLink = "";
        start = "";
        end = "";
      }
    }

    // Create timeline items from list of elements
    for(let i = 0; i < listElement.length; i++)
    {
      if(listElement[i].end != "")
      {
        me.items.add(
          [
            {
              id: i,  
              content: listElement[i].description, 
              link: listElement[i].descriptionLink,
              start: me.convertDate(listElement[i].start),
              end: me.convertDate(listElement[i].end)
            }
          ]
        );
      }
      else if(listElement[i].start != "")
      {
        me.items.add(
          [
            {
              id: i,  
              content: listElement[i].description,
              link: listElement[i].descriptionLink,
              start: me.convertDate(listElement[i].start)
            }
          ]
        );
      }
    }

    let container = document.getElementById('timeLine');
    me.timeline = new vis.Timeline(container, me.items, {});

    // Click open page
    me.timeline.on('doubleClick', function (properties) 
    {
      if(properties.item != null)
      {
        let item = me.items.get(properties.item);

        window.open(item.link); 
      }
    });
  }

  /**
   * Convert a string date to a js date
   * @param {String}          dateStr             Wikidata date as a string
   */
  convertDate(dateStr)
  {
    let date = new Date();
    
    dateStr = dateStr.split("T")[0];
    
    if(dateStr.split("-")[0] == "")
    { 
      date.setFullYear('-' + dateStr.split("-")[1]);
      date.setMonth(dateStr.split("-")[2]);
      date.setDate(dateStr.split("-")[3]);
    }
    else
    {
      if(dateStr.split("-").length == 1)
      {
        date.setFullYear(dateStr);
      }
      else
      {
        date.setFullYear(dateStr.split("-")[0]);
        date.setMonth(dateStr.split("-")[1]);
        date.setDate(dateStr.split("-")[2]);
      }
    }
    
    return date; 
  };

}
