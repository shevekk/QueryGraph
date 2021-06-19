if (typeof QueryGraph == 'undefined') {
  QueryGraph = {};
}

if (typeof QueryGraph.Chart == 'undefined') {
  QueryGraph.Chart = {};
}

/**
 * Main class 
 */
QueryGraph.Chart.Chart = class ChartManager
{
  /*
   * Class for display charts from query result data
   * @param {Object}                       graphJson                    Query graph informations
   * @param {Object[]}                     dataJson                     Data result information
   * @param {Chart}                        chart                        Chart element (of chart.js lib)
   */
  constructor(graphJson, dataJson)
  {
    this.baseGraph = JSON.parse(graphJson);
    this.data = JSON.parse(dataJson);
    this.chart = null;
  }

  /**
   * Init UI and manage chart lautch
   */
  init()
  {
    let me = this;

    // get var names
    let nodesVarNames = [];
    for(let i = 0; i < this.baseGraph.nodes.length; i++)
    {
      if(this.baseGraph.nodes[i].type == "Element")
      {
        nodesVarNames.push(this.baseGraph.nodes[i].name);
      }
    }
    for(let i = 0; i < this.baseGraph.edges.length; i++)
    {
      if(this.baseGraph.edges[i].type == "Variable")
      {
        nodesVarNames.push(this.baseGraph.edges[i].name);
      }
    }

    // Create html content of UI
    let htmlContent = "<label>"+QueryGraph.Dictionary.Dictionary.get("CHART_ELEMENT")+" : </label><select id='elementSelect'>";
    for(let i = 0; i < nodesVarNames.length; i++)
    {
      htmlContent += `   <option value="${nodesVarNames[i]}">${nodesVarNames[i]}</option>`;
    }
    htmlContent += "</select>";

    htmlContent += "<label>"+QueryGraph.Dictionary.Dictionary.get("CHART_DISPLAY_TYPE")+" : </label><select id='typeSelect'>";
    htmlContent += `   <option value="bar">${QueryGraph.Dictionary.Dictionary.get("CHART_TYPE_BAR")}</option>`;
    htmlContent += `   <option value="pie">${QueryGraph.Dictionary.Dictionary.get("CHART_TYPE_PIE")}</option>`;
    htmlContent += "</select>";

    htmlContent += `<button id="OkButton">${QueryGraph.Dictionary.Dictionary.get("CHART_LABEL_OK")}</button>`;
    $("#selectDiv").html(htmlContent);

    // Display chart
    $("#OkButton").click(function()
    {
      let elementVar = $("#elementSelect").val();
      let typeVar = $("#typeSelect").val();

      me.initChart(elementVar, typeVar);

      $("#nbResults").html(`${QueryGraph.Dictionary.Dictionary.get("CHART_ELEMENT_NUMBERS")} : ${me.getNbResult()}`)

      $("#selectDiv").css("display", "none");
      $("#chartDiv").css("display", "inline-block");

      $("#changePropDiv").html(`<button id="changePropButton">${QueryGraph.Dictionary.Dictionary.get("MAP_CHANGE_PROPERTIES")}</button>`);

      $("#changePropButton").click(function()
      {
        me.chart.destroy();
        $("#nbResults").html('');

        $("#selectDiv").css("display", "inline-block");
        $("#changePropDiv").html("");
        $("#chartDiv").css("display", "none");
      });
    });
  }

  /**
   * Init chart display
   * @param {String}                        elementVar                     Element var name
   * @param {String}                        chartType                      Type of chart
   */
  initChart(elementVar, chartType)
  {
    // Create list of element 
    let listElement = [];
    for(let i = 0; i < this.data.length; i++)
    {
      if(this.data[i].var == elementVar)
      {
        let el = listElement.filter(el => el.name == this.data[i].value)[0];

        if(!el)
        {
          listElement.push({name: this.data[i].value, label: this.data[i].label, number : 1})
        }
        else
        {
          el.number ++;
        }
      }
    }

    // Order elements
    listElement.sort((a, b) => {
        return a.number - b.number;
    });

    // Create data list
    let dataValues = [];
    let labelValues = [];
    for(let i = 0; i < listElement.length; i++)
    {
      dataValues.push(listElement[i].number);

      if(listElement[i].label)
      {
        labelValues.push(listElement[i].label);
      }
      else
      {
        labelValues.push(listElement[i].name);
      }
    }

    // Display chart
    var popCanvas = document.getElementById("chartCanvas");

    const data = {
      labels: labelValues,
      datasets: [{
        label: '',
        data: dataValues,
        backgroundColor: ['#309fdb', '#3caf85', '#fbce4a', '#e95b54', '#854e9b'],
        hoverOffset: 4
      }]
    };

    let options = {
      borderColor: "rgb(0.5, 0.5, 0.5, 0.2)"
    }

    this.chart = new Chart(popCanvas, {
        type: chartType,
        data: data,
        options: options
    });
  }

  getNbResult()
  {
    let nbElements = 0;
    for(let i = 0; i < this.data.length; i++)
    {
      if(this.data[i].lineNumber > nbElements)
      {
        nbElements = this.data[i].lineNumber;
      }
    }

    return nbElements;
  }
}
