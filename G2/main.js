var img = 0;
var epoch = 0;
var alpha = 0.8;

var container = d3.select("#G2");

var imgSelectG = container
  .append("svg")
  .attr("id", "imgSelect_g2")
  .attr("width", "210")
  .attr("height", "500")
  .style("position", "relative")
  .style("left", "calc(50% - 505px)")
  .style("top", "0%");
var chartG = container
  .append("svg")
  .attr("id", "stackedBarChart")
  .attr("width", "800")
  .attr("height", "600")
  .style("position", "relative")
  .style("left", "calc(50% - 505px)")
  .style("top", "-100px");

container.selectAll("svg").style("display", "block");

// Global constants
var margin_G2 = 200;
var chartWidth = parseInt(chartG.attr("width")) - margin_G2;
var chartHeight = parseInt(chartG.attr("height")) - margin_G2;
var axisPadding = margin_G2 / 2;
var barWidth = 50;
var imageOffsetX = 0;
var keys = [
  "airplane",
  "automobile",
  "bird",
  "cat",
  "deer",
  "dog",
  "frog",
  "horse",
  "ship",
  "truck",
];
// d3.schemeTableau10 but with transparency (for the ribbon chart)
var colors = [
  d3.rgb(78, 121, 167, alpha),
  d3.rgb(242, 142, 44, alpha),
  d3.rgb(225, 87, 89, alpha),
  d3.rgb(118, 183, 178, alpha),
  d3.rgb(89, 161, 79, alpha),
  d3.rgb(237, 201, 73, alpha),
  d3.rgb(175, 122, 161, alpha),
  d3.rgb(255, 157, 167, alpha),
  d3.rgb(156, 117, 95, alpha),
  d3.rgb(186, 176, 171, alpha),
];

// Scales
var cScale = d3.scaleOrdinal(d3.schemeTableau10);
var hScale = d3.scaleLinear().domain([0, 1]).range([chartHeight, 1]);
var xScale = d3
  .scaleBand()
  .domain([
    "airplane",
    "automobile",
    "bird",
    "cat",
    "deer",
    "dog",
    "frog",
    "horse",
    "ship",
    "truck",
  ])
  .range([0, chartWidth]);
var xScaleRibbon_g2 = d3
  .scaleLinear()
  .domain([-0.5, 10.5])
  .range([0, chartWidth]);
var yScaleRibbon_g2 = d3.scaleLinear().domain([0, 1]).range([chartHeight, 0]);
var cScaleRibbon_g2 = d3.scaleOrdinal().domain(keys).range(colors);
var cLegendRibbon_g2 = d3.legendColor().scale(cScaleRibbon_g2);

// Axis Rendering
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(hScale);

var xAxisG = chartG
  .append("g")
  .attr("class", "x_axis")
  .attr(
    "transform",
    "translate(" + [axisPadding, chartHeight + axisPadding] + ")"
  )
  .call(xAxis);
var yAxisG = chartG
  .append("g")
  .attr("class", "y_axis")
  .attr("transform", "translate(" + [axisPadding, axisPadding] + ")")
  .call(yAxis);
xAxisG
  .append("text")
  .attr("class", "x label")
  .attr("transform", "translate(300,25)")
  .text("Class Label");

var xAxis_g2 = d3.axisBottom(xScaleRibbon_g2);
var yAxis_g2 = d3.axisLeft(yScaleRibbon_g2);

// Axis labels
chartG
  .append("text")
  .attr("class", "axis_label")
  .attr(
    "transform",
    "translate(" +
      [axisPadding / 2 + chartWidth / 2, chartHeight + axisPadding + 50] +
      ")"
  )
  .text("Image label");
chartG
  .append("text")
  .attr("class", "axis_label")
  .attr(
    "transform",
    "rotate(270)translate(" +
      [-chartHeight / 2 - axisPadding / 2 - 100, 50] +
      ")"
  )
  .text("Predictive Probability");

d3.json("../Datasets/stepWiseProb_NT.json").then((prob_data) => {
  // Initialize slider and text
  d3.select("#epoch_slider")
    .attr("type", "range")
    .attr("min", 0)
    .attr("max", 10)
    .attr("value", epoch)
    .on("input", onSlide);

  d3.select("#slider_text")
    .style("width", "100px")
    .style("font-size", "1em")
    // .style("float", "left")
    // .style("margin-right", "150px")
    .style("position", "relative")
    .style("left", "25px")
    .style("top", "-26.5px")
    .html("PGD Step: " + epoch);

  // Initialize bar chart
  data_G2 = prob_data[epoch][img];

  var bars = chartG.selectAll(".rect").data(data_G2);

  var barsEnter = bars.enter().append("g").attr("class", "bar");

  barsEnter
    .append("rect")
    .attr("width", barWidth)
    .attr("height", (d, i) => hScale(0) - hScale(d))
    .attr("class", "g2-bar")
    .attr("x", (d, i) => xScale(convertLabel(i)) + axisPadding + 5)
    .attr("y", (d, i) => hScale(d) + axisPadding)
    .style("fill", (d, i) => cScale(i))
    .on("mouseover", (d, i) => {
      chartG
        .append("text")
        .attr("class", "g2-hoverAddOn")
        .attr("x", xScale(convertLabel(i)) + axisPadding + 30)
        .attr("y", hScale(d) + axisPadding - 5)
        .text(d >= 0.001 ? d.toFixed(3) : "< 0.001")
        .attr("font-family", "Arial, Helvetica, sans-serif")
        .style("text-anchor", "middle");
    })
    .on("mouseout", (d, i) => {
      chartG.selectAll(".g2-hoverAddOn").remove();
    });

  // Initialize images
  var imgOrig = imgSelectG
    .append("svg:image")
    .attr("xlink:href", function () {
      return "../Datasets/images/img00.png";
    })
    .attr("x", 40)
    .attr("y", 300)
    .attr("width", 75)
    .attr("height", 75)
    .attr("transform", "translate(" + imageOffsetX + ",0)");

  var imgCurr = imgSelectG
    .append("svg:image")
    .attr("xlink:href", function () {
      return "../Datasets/images/img00.png";
    })
    .attr("x", 120)
    .attr("y", 300)
    .attr("width", 75)
    .attr("height", 75)
    .attr("transform", "translate(" + imageOffsetX + ",0)");

  imgSelectG
    .append("text")
    .attr("x", 50)
    .attr("y", 330)
    .attr("font-size", "10px")
    .attr("font-weight", "bold")
    .text("Original Image")
    .attr("transform", "translate(" + (imageOffsetX - 15) + ",60)");

  imgSelectG
    .append("text")
    .attr("x", 50)
    .attr("y", 330)
    .attr("font-size", "10px")
    .attr("font-weight", "bold")
    .text("Adversarial Image")
    .attr("transform", "translate(" + (imageOffsetX + 65) + ",60)");

  // Initialize image select
  for (i = 0; i < 10; i++) {
    filepath = "../Datasets/images/img" + i + "0.png";

    imgSelectG
      .append("image")
      .attr("x", (i % 2) * 55 + 65)
      .attr("y", Math.floor(i / 2) * 55 + 5)
      .on("click", onImgSelect)
      .attr("xlink:href", function () {
        return filepath;
      })
      .attr("width", 50)
      .attr("height", 50)
      .attr("class", i == 0 ? "G2_image_selected" : "G2_image")
      .style("outline", i == 0 ? "5px solid gold" : "none");
  }

  // Event callback
  function onSlide() {
    epoch = this.value;
    d3.select("#slider_text").html("PGD Step: " + epoch);

    data_G2 = prob_data[epoch][img];
    var thisSvg = d3.select("#stackedBarChart");
    var barRect = thisSvg.selectAll(".bar rect");

    barRect
      .data(data_G2)
      .transition()
      .attr("height", (d, i) => hScale(0) - hScale(d))
      .attr("y", (d, i) => hScale(d) + axisPadding)
      .style("fill", (d, i) => cScale(i));

    imgCurr.attr("xlink:href", function () {
      return getImageCurr();
    });
  }

  function onImgSelect() {
    let thisXAttr = d3.select(this).attr("x");
    let thisyAttr = d3.select(this).attr("y");
    epoch = 0;
    img = 2 * ((thisyAttr - 5) / 55) + (thisXAttr - 65) / 55;

    d3.select(".G2_image_selected")
      .style("outline", "none")
      .attr("class", "G2_image");
    d3.select(this)
      .style("outline", "5px solid gold")
      .attr("class", "G2_image_selected");

    data_G2 = prob_data[epoch][img];
    var thisSvg = d3.select("#stackedBarChart");
    var barRect = thisSvg.selectAll(".bar rect");

    barRect
      .data(data_G2)
      .transition()
      .attr("height", (d, i) => hScale(0) - hScale(d))
      .attr("y", (d, i) => hScale(d) + axisPadding)
      .style("fill", (d, i) => cScale(i));

    imgCurr.attr("xlink:href", function () {
      return getImageCurr();
    });
    imgOrig.attr("xlink:href", function () {
      return getImageOrig();
    });

    d3.select("#epoch_slider").attr("max", 0).attr("max", 10);

    d3.select("#slider_text").html("PGD Step: " + 0);
  }

  // Uses d3.stack to get data in format for stacked area chart
  function getStackedData() {
    ribbonData = Array();
    for (i = 0; i <= 10; i++) {
      dict = { step: i };
      for (j = 0; j < 10; j++) {
        dict[convertLabel(j)] = prob_data[String(i)][img][j];
      }
      ribbonData.push(dict);
    }

    // Get data in format amenable to ribbon chart
    stackedData = d3
      .stack()
      .keys([
        "airplane",
        "automobile",
        "bird",
        "cat",
        "deer",
        "dog",
        "frog",
        "horse",
        "ship",
        "truck",
      ])
      .order(d3.stackOrderAscending)(ribbonData);

    // Create new data structure mimicking stackedData
    final_data = new Array(10);
    for (i = 0; i < 10; i++) {
      final_data[i] = { key: convertLabel(i), length: 11 };
    }

    // For all steps of PGD...
    for (j = 0; j < 11; j++) {
      diffs = [];
      // Calculate the difference in y values (i.e. the size of the area at each step of PGD)
      for (i = 0; i < 10; i++) {
        arr = stackedData[i][j];
        diffs.push(arr[1] - arr[0]);
      }

      // Sort data by decreasing area
      indices = new Array(10);
      for (k = 0; k < 10; ++k) indices[k] = k;
      indices.sort(function (a, b) {
        return diffs[a] > diffs[b] ? -1 : diffs[a] < diffs[b] ? 1 : 0;
      });

      // Convert stackedData to sorted order
      // Also converts raw data to pixel coordinates, so we can vertically shift areas as needed
      final_data[indices[0]][j] = [
        yScaleRibbon_g2(stackedData[indices[0]][j][0]) -
          yScaleRibbon_g2(stackedData[indices[0]][j][1]),
        0,
      ];
      for (l = 1; l < indices.length; l++) {
        final_data[indices[l]][j] = [
          final_data[indices[l - 1]][j][0] +
            yScaleRibbon_g2(stackedData[indices[l]][j][0]) -
            yScaleRibbon_g2(stackedData[indices[l]][j][1]),
          final_data[indices[l - 1]][j][0],
        ];
      }

      min_height = 2.5;
      for (l = 0; l < indices.length; l++) {
        arr = final_data[indices[l]][j];
        if (Math.abs(arr[0] - arr[1]) < min_height) {
          arr[1] = arr[0] - min_height;
          for (k = 1; k < l; k++) {
            final_data[indices[k]][j][0] -= min_height;
            final_data[indices[k]][j][1] -= min_height;
          }
          final_data[indices[0]][j][0] -= min_height;
        }
      }
    }
    return final_data;
  }

  function getImageOrig() {
    return "../Datasets/images/img" + String(img) + String(0) + ".png";
  }

  function getImageCurr() {
    return "../Datasets/images/img" + String(img) + String(epoch) + ".png";
  }
});

function convertLabel(i) {
  switch (i) {
    case 0:
      return "airplane";
    case 1:
      return "automobile";
    case 2:
      return "bird";
    case 3:
      return "cat";
    case 4:
      return "deer";
    case 5:
      return "dog";
    case 6:
      return "frog";
    case 7:
      return "horse";
    case 8:
      return "ship";
    case 9:
      return "truck";
  }
}
