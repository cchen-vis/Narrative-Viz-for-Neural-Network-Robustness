var epoch = 0;
var alpha = 0.8;

var container = d3.select("#G2");
var chartG = container
  .append("svg")
  .attr("id", "stackedBarChart")
  .attr("width", width)
  .attr("height", "600")
  .attr("transform", "translate(40, 0)");

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

for (let i = 0; i < 6; i++) {
  d3.select("#image-g2-" + i)
    .attr("src", "images_AT/image_" + i + "_" + pad(chosenImg, 3) + ".png")
    .on("click", () => {
      onSlide(i);
    });
}
onSlide(0);

function onImgSelect_g2() {
  for (let i = 0; i < 6; i++) {
    d3.select("#image-g2-" + i)
      .attr("src", "images_AT/image_" + i + "_" + pad(chosenImg, 3) + ".png")
      .on("click", () => {
        onSlide(i);
      });
  }
  onSlide(0);
}

d3.json("Datasets/stepWiseProb_NT.json").then((prob_data) => {
  // Initialize bar chart
  data_G2 = prob_data[epoch][chosenImg];

  var bars = chartG.selectAll(".rect").data(data_G2);

  var barsEnter = bars.enter().append("g").attr("class", "bar");

  barsEnter
    .append("rect")
    .attr("width", barWidth)
    .attr("height", (d, i) => hScale(0) - hScale(d))
    .attr("class", "g2-bar")
    .attr(
      "x",
      (d, i) =>
        xScale(convertLabel(i)) +
        axisPadding +
        xScale.bandwidth() / 2 -
        barWidth / 2
    )
    .attr("y", (d, i) => hScale(d) + axisPadding)
    .style("fill", (d, i) => cScale(i))
    .on("mouseover", (d, i) => {
      chartG
        .append("text")
        .attr("class", "g2-hoverAddOn")
        .attr(
          "x",
          xScale(convertLabel(i)) + axisPadding + xScale.bandwidth() / 2
        )
        .attr("y", hScale(d) + axisPadding - 5)
        .text(d >= 0.001 ? d.toFixed(3) : "< 0.001")
        .attr("font-family", "Arial, Helvetica, sans-serif")
        .style("text-anchor", "middle");
    })
    .on("mouseout", (d, i) => {
      chartG.selectAll(".g2-hoverAddOn").remove();
    });
});

// Event callback
function onSlide(AT_step) {
  d3.json("Datasets/stepWiseProb_NT.json").then((prob_data) => {
    d3.select("#stackedBarChart")
      .selectAll(".bar rect")
      .data(prob_data[AT_step][chosenImg])
      .transition()
      .attr("height", (d, i) => hScale(0) - hScale(d))
      .attr("y", (d, i) => hScale(d) + axisPadding)
      .style("fill", (d, i) => cScale(i));

    // make the parent div of the image of id "image-g2-${AT_step}" have a grey border
    for (let i = 0; i < 6; i++) {
      document.getElementById("image-g2-" + i).parentNode.style.outline =
        "none";
    }
    document.getElementById("image-g2-" + AT_step).parentNode.style.outline =
      "2px solid grey";
  });
}

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
