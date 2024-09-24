// Create SVG containers
var ribbonG_g3 = d3
  .select("#G3")
  .append("svg")
  .attr("id", "ribbonChart")
  .attr("transform", "translate(0,0)")
  .attr("width", "50%")
  .attr("height", "600px");

var ribbonG_g2 = d3
  .select("#G3")
  .append("svg")
  .attr("id", "ribbonChart_g2")
  .attr("transform", "translate(0,0)")
  .attr("width", "50%")
  .attr("height", "600px");

// Global constants
var margin_g3 = 200;
var chartWidth_g3 = ribbonG_g3.node().getBoundingClientRect().width - margin_g3;
var chartHeight_g3 = parseInt(ribbonG_g3.attr("height")) - margin_g3;
var axisPadding_g3 = margin_g3 / 2;
var axisPadding = margin_g3 / 2;
var selectOffsetX_g3 = 25;
var selectOffsetY_g3 = 150;
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
  d3.rgb(78, 121, 167),
  d3.rgb(242, 142, 44),
  d3.rgb(225, 87, 89),
  d3.rgb(118, 183, 178),
  d3.rgb(89, 161, 79),
  d3.rgb(237, 201, 73),
  d3.rgb(175, 122, 161),
  d3.rgb(255, 157, 167),
  d3.rgb(156, 117, 95),
  d3.rgb(186, 176, 171),
];

// Scales

var xScaleRibbon_g3 = d3
  .scaleLinear()
  .domain([-0.5, 5.5])
  .range([0, chartWidth_g3]);
var yScaleRibbon_g3 = d3
  .scaleLinear()
  .domain([0, 1])
  .range([chartHeight_g3, 0]);
var cScaleRibbon_g3 = d3.scaleOrdinal().domain(keys).range(d3.schemeTableau10);
var xScaleRibbon_g2 = d3
  .scaleLinear()
  .domain([-0.5, 5.5])
  .range([0, chartWidth_g3]);
var yScaleRibbon_g2 = d3
  .scaleLinear()
  .domain([0, 1])
  .range([chartHeight_g3, 0]);
var cScaleRibbon_g2 = d3.scaleOrdinal().domain(keys).range(d3.schemeTableau10);
var cLegendRibbon_g2 = d3.legendColor().scale(cScaleRibbon_g2);
ribbonG_g2.append("g").attr("visibility", "hidden").call(cLegendRibbon_g2);

// Legends
var cLegendRibbon_g3 = d3.legendColor().scale(cScaleRibbon_g3);
ribbonG_g3
  .append("g")
  .attr(
    "transform",
    "translate(" + [chartWidth_g3 + axisPadding_g3 - 10, 100] + ")"
  )
  .call(cLegendRibbon_g3);

// Axis Rendering
var xAxis_g3 = d3
  .axisBottom(xScaleRibbon_g3)
  .tickValues([0, 1, 2, 3, 4, 5])
  .tickFormat(d3.format("d"));
var yAxis_g3 = d3.axisLeft(yScaleRibbon_g3);

ribbonG_g3
  .append("g")
  .attr("class", "x_axis")
  .attr(
    "transform",
    "translate(" + [axisPadding_g3, chartHeight_g3 + axisPadding_g3] + ")"
  )
  .call(xAxis_g3);

ribbonG_g3
  .append("g")
  .attr("class", "y_axis")
  .attr("transform", "translate(" + [axisPadding_g3, axisPadding_g3] + ")")
  .call(yAxis_g3);

var xAxis_g2 = d3
  .axisBottom(xScaleRibbon_g2)
  .tickValues([0, 1, 2, 3, 4, 5])
  .tickFormat(d3.format("d"));
var yAxis_g2 = d3.axisLeft(yScaleRibbon_g2);

ribbonG_g2
  .append("g")
  .attr("class", "x_axis")
  .attr(
    "transform",
    "translate(" + [axisPadding, chartHeight_g3 + axisPadding] + ")"
  )
  .call(xAxis_g2);
ribbonG_g2
  .append("g")
  .attr("class", "y_axis")
  .attr("transform", "translate(" + [axisPadding, axisPadding] + ")")
  .call(yAxis_g2);

// Axis labels
ribbonG_g3
  .append("text")
  .attr("class", "axis_label")
  .attr(
    "transform",
    "translate(" + [chartWidth_g3 / 2, axisPadding_g3 - 25] + ")"
  )
  .text("Adversarially Trained Network");
ribbonG_g3
  .append("text")
  .attr("class", "axis_label")
  .attr(
    "transform",
    "translate(" +
      [
        axisPadding_g3 / 2 + chartWidth_g3 / 2,
        chartHeight_g3 + axisPadding_g3 + 50,
      ] +
      ")"
  )
  .text("Step of PGD");
ribbonG_g3
  .append("text")
  .attr("class", "axis_label")
  .attr(
    "transform",
    "rotate(270)translate(" +
      [-chartHeight_g3 / 2 - axisPadding_g3 / 2 - 150, 50] +
      ")"
  )
  .text("Predictive Probabilites");

ribbonG_g2
  .append("text")
  .attr("class", "axis_label")
  .attr(
    "transform",
    "translate(" + [chartWidth_g3 / 2, axisPadding_g3 - 25] + ")"
  )
  .text("Regularly Trained Network");
ribbonG_g2
  .append("text")
  .attr("class", "axis_label")
  .attr(
    "transform",
    "translate(" +
      [
        axisPadding_g3 / 2 + chartWidth_g3 / 2,
        chartHeight_g3 + axisPadding_g3 + 50,
      ] +
      ")"
  )
  .text("Step of PGD");
// ribbonG_g2
//   .append("text")
//   .attr("class", "axis_label")
//   .attr(
//     "transform",
//     "rotate(270)translate(" +
//       [-chartHeight_g3 / 2 - axisPadding_g3 / 2 - 225, 50] +
//       ")"
//   )
//   .text("RT model's prediction probabilites for current image");

var swP_NT, swP_AT;
d3.json("Datasets/stepWiseProb_NT.json").then((nt_data) => {
  d3.json("Datasets/stepWiseProb_AT.json").then((at_data) => {
    swP_NT = nt_data;
    swP_AT = at_data;
    // Initialize ribbon chart
    ribbonG_g3
      .selectAll(".area_g3")
      .data(getStackedDataG3())
      .enter()
      .append("path")
      // .style("stroke", function(d) { return cScaleRibbon_g3(d.key); })
      .style("fill", function (d, i) {
        return colors[i];
      })
      .style("opacity", 0.6)
      .attr("class", "area_g3")
      .attr(
        "d",
        d3
          .area()
          .x((d, i) => xScaleRibbon_g3(i) + axisPadding_g3)
          .y0((d, i) => d[0] + axisPadding_g3)
          .y1((d, i) => d[1] + axisPadding_g3)
      )
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut);

    for (j = 1; j < 5; j++) {
      points = [
        [
          xScaleRibbon_g3(j) + axisPadding_g3,
          yScaleRibbon_g3(0) + axisPadding_g3,
        ],
        [
          xScaleRibbon_g3(j) + axisPadding_g3,
          yScaleRibbon_g3(1) + axisPadding_g3,
        ],
      ];
      ribbonG_g3
        .append("path")
        .attr("d", d3.line()(points))
        .style("stroke", "black");
    }

    ribbonG_g3.selectAll(".legendCells .cell .swatch").style("opacity", 0.6);

    ribbonG_g2
      .selectAll(".area_g2")
      .data(getStackedData())
      .enter()
      .append("path")
      // .style("stroke", function(d) { return cScaleRibbon_g2(d.key); })
      .style("fill", function (d, i) {
        return colors[i];
      })
      .style("opacity", 0.6)
      .attr("class", "area_g2")
      .attr(
        "d",
        d3
          .area()
          .x((d, i) => xScaleRibbon_g2(i) + axisPadding)
          .y0((d, i) => d[0] + axisPadding)
          .y1((d, i) => d[1] + axisPadding)
      )
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut);

    for (j = 1; j < 5; j++) {
      points = [
        [xScaleRibbon_g2(j) + axisPadding, yScaleRibbon_g2(0) + axisPadding],
        [xScaleRibbon_g2(j) + axisPadding, yScaleRibbon_g2(1) + axisPadding],
      ];
      ribbonG_g2
        .append("path")
        .attr("d", d3.line()(points))
        .style("stroke", "black");
    }

    ribbonG_g2.selectAll(".legendCells .cell .swatch").style("opacity", 0.6);

    function onMouseOver() {
      ribbonG_g3.selectAll(".area_g3").style("opacity", 0.3);
      ribbonG_g2.selectAll(".area_g2").style("opacity", 0.3);
      d3.select(this).style("opacity", 1);

      var targetFill = d3.select(this).style("fill");

      var legendColors = ribbonG_g3
        .selectAll(".legendCells .cell .swatch")
        .nodes();
      for (i = 0; i < 10; i++) {
        let rect = d3.select(legendColors[i]);
        if (rect.style("fill") == targetFill) {
          rect.style("opacity", 1);
          // make the sibling text also with opacity 1
          rect.node().nextSibling.style.opacity = 1;
        } else {
          rect.style("opacity", 0.3);
          rect.node().nextSibling.style.opacity = 0.3;
        }
      }

      if (d3.select(this).attr("class") == "area_g2") {
        areas = ribbonG_g3.selectAll(".area_g3").nodes();
      } else {
        areas = ribbonG_g2.selectAll(".area_g2").nodes();
      }

      for (i = 0; i < 10; i++) {
        var area = d3.select(areas[i]);
        if (area.style("fill") == targetFill) {
          area.style("opacity", 1);
        }
      }
    }

    function onMouseOut() {
      ribbonG_g3.selectAll(".area_g3").style("opacity", 0.6);
      ribbonG_g3.selectAll(".legendCells .cell .swatch").style("opacity", 1);
      ribbonG_g3.selectAll(".legendCells .cell .label").style("opacity", 1);
      ribbonG_g2.selectAll(".area_g2").style("opacity", 0.6);
    }
  });
});

// Uses d3.stack to get data in format for stacked area chart
function getStackedDataG3() {
  if (swP_AT == undefined) {
    return;
  }
  ribbonData = Array();
  for (i = 0; i <= 5; i++) {
    dict = { step: i };
    for (j = 0; j < 10; j++) {
      dict[convertLabel(j)] = swP_AT[String(i)][chosenImg][j];
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
    final_data[i] = [];
  }

  // For all steps of PGD...
  for (j = 0; j < 6; j++) {
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
      yScaleRibbon_g3(stackedData[indices[0]][j][0]) -
        yScaleRibbon_g3(stackedData[indices[0]][j][1]),
      0,
    ];
    for (l = 1; l < indices.length; l++) {
      final_data[indices[l]][j] = [
        final_data[indices[l - 1]][j][0] +
          yScaleRibbon_g3(stackedData[indices[l]][j][0]) -
          yScaleRibbon_g3(stackedData[indices[l]][j][1]),
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

function getStackedData() {
  if (swP_NT == undefined) {
    return;
  }
  ribbonData = Array();
  for (i = 0; i <= 5; i++) {
    dict = { step: i };
    for (j = 0; j < 10; j++) {
      dict[convertLabel(j)] = swP_NT[String(i)][chosenImg][j];
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
    final_data[i] = [];
  }

  // For all steps of PGD...
  for (j = 0; j < 6; j++) {
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

function onImgSelectG3() {
  ribbonG_g3
    .selectAll(".area_g3")
    .data(getStackedDataG3())
    .transition()
    .style("fill", function (d, i) {
      return colors[i];
    })
    .attr(
      "d",
      d3
        .area()
        .x((d, i) => xScaleRibbon_g3(i) + axisPadding_g3)
        .y0((d, i) => d[0] + axisPadding_g3)
        .y1((d, i) => d[1] + axisPadding_g3)
    );

  ribbonG_g2
    .selectAll(".area_g2")
    .data(getStackedData())
    .transition()
    .style("fill", function (d, i) {
      return colors[i];
    })
    .attr(
      "d",
      d3
        .area()
        .x((d, i) => xScaleRibbon_g2(i) + axisPadding)
        .y0((d, i) => d[0] + axisPadding)
        .y1((d, i) => d[1] + axisPadding)
    );
}
