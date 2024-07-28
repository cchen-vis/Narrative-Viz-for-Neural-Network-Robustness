var epoch = 0;
var alpha = 0.8;

var container = d3.select("#G2");

// var imgSelectG = container
//   .append("svg")
//   .attr("id", "imgSelect_g2")
//   .attr("width", "210")
//   .attr("height", "500")
//   .attr("transform", "translate(0,0)");
var chartG = container
  .append("svg")
  .attr("id", "stackedBarChart")
  .attr("width", "800")
  .attr("height", "600")
  .attr("transform", "translate(0,-100)");

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

function onImgSelect_g2() {
  d3.json("../Datasets/stepWiseProb_NT.json").then((prob_data) => {
    d3.select("#stackedBarChart")
      .selectAll(".bar rect")
      .data(prob_data[0][chosenImg])
      .transition()
      .attr("height", (d, i) => hScale(0) - hScale(d))
      .attr("y", (d, i) => hScale(d) + axisPadding)
      .style("fill", (d, i) => cScale(i));

    // imgCurr.attr("xlink:href", function () {
    //   return getImageCurr();
    // });
    // imgOrig.attr("xlink:href", function () {
    //   return getImageOrig();
    // });

    d3.select("#epoch_slider").attr("max", 0).attr("max", 5);

    d3.select("#slider_text").html("PGD Step: " + 0);
  });
}

d3.json("../Datasets/stepWiseProb_NT.json").then((prob_data) => {
  // Initialize slider and text
  d3.select("#epoch_slider")
    .attr("type", "range")
    .attr("min", 0)
    .attr("max", 5)
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
  data_G2 = prob_data[epoch][chosenImg];

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

  // // Initialize images
  // var imgOrig = imgSelectG
  //   .append("svg:image")
  //   .attr("xlink:href", function () {
  //     return "../Datasets/images/img00.png";
  //   })
  //   .attr("x", 40)
  //   .attr("y", 300)
  //   .attr("width", 75)
  //   .attr("height", 75)
  //   .attr("transform", "translate(" + imageOffsetX + ",0)");

  // var imgCurr = imgSelectG
  //   .append("svg:image")
  //   .attr("xlink:href", function () {
  //     return "../Datasets/images/img00.png";
  //   })
  //   .attr("x", 120)
  //   .attr("y", 300)
  //   .attr("width", 75)
  //   .attr("height", 75)
  //   .attr("transform", "translate(" + imageOffsetX + ",0)");

  // imgSelectG
  //   .append("text")
  //   .attr("x", 50)
  //   .attr("y", 330)
  //   .attr("font-size", "10px")
  //   .attr("font-weight", "bold")
  //   .text("Original Image")
  //   .attr("transform", "translate(" + (imageOffsetX - 15) + ",60)");

  // imgSelectG
  //   .append("text")
  //   .attr("x", 50)
  //   .attr("y", 330)
  //   .attr("font-size", "10px")
  //   .attr("font-weight", "bold")
  //   .text("Adversarial Image")
  //   .attr("transform", "translate(" + (imageOffsetX + 65) + ",60)");

  // // Initialize image select
  // for (i = 0; i < 10; i++) {
  //   filepath = "../Datasets/images/img" + i + "0.png";

  //   imgSelectG
  //     .append("image")
  //     .attr("x", (i % 2) * 55 + 65)
  //     .attr("y", Math.floor(i / 2) * 55 + 5)
  //     .on("click", onImgSelect)
  //     .attr("xlink:href", function () {
  //       return filepath;
  //     })
  //     .attr("width", 50)
  //     .attr("height", 50)
  //     .attr("class", i == 0 ? "G2_image_selected" : "G2_image")
  //     .style("outline", i == 0 ? "5px solid gold" : "none");
  // }

  // Event callback
  function onSlide() {
    epoch = this.value;
    d3.select("#slider_text").html("PGD Step: " + epoch);

    data_G2 = prob_data[epoch][chosenImg];
    var thisSvg = d3.select("#stackedBarChart");
    var barRect = thisSvg.selectAll(".bar rect");

    barRect
      .data(data_G2)
      .transition()
      .attr("height", (d, i) => hScale(0) - hScale(d))
      .attr("y", (d, i) => hScale(d) + axisPadding)
      .style("fill", (d, i) => cScale(i));

    // imgCurr.attr("xlink:href", function () {
    //   return getImageCurr();
    // });
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
