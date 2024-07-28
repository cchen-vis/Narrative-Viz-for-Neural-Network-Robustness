const EpsLetter = "\u03F5";
const svg_g5 = d3
  .select("#G5")
  .attr("width", width + margin.left + margin.right + padding)
  .attr("height", height + margin.top + margin.bottom + padding)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("width", width)
  .attr("height", height);

// Scales and Axes
const x_g5 = d3.scaleLinear().range([0, width]);
const y_g5 = d3.scaleLinear().range([height, 0]);

d3.csv("../Datasets/clean_adv_tradeoff4different_eps.csv").then((data_g5) => {
  x_g5.domain([
    Math.min(...data_g5.map((d) => parseFloat(d.clean_acc))) - 5,
    Math.max(...data_g5.map((d) => parseFloat(d.clean_acc))) + 5,
  ]);
  y_g5.domain([
    Math.min(...data_g5.map((d) => parseFloat(d.adv_acc))) - 5,
    Math.max(...data_g5.map((d) => parseFloat(d.adv_acc))) + 5,
  ]);
  const xAxis_g5 = d3.axisBottom(x_g5);
  const yAxis_g5 = d3.axisLeft(y_g5);

  // Add on axes and axis labels
  svg_g5
    .append("g")
    .attr("class", "g5-xaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis_g5);
  svg_g5.append("g").attr("class", "g5-yaxis").call(yAxis_g5);
  svg_g5
    .append("text")
    .attr("class", "g5-yaxis-label")
    .attr("y", 6)
    .attr("dy", -35)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end")
    .text("Adversarial Accuracy (%)");
  svg_g5
    .append("text")
    .attr("class", "g5-xaxis-label")
    .attr("x", width)
    .attr("dy", height + 35)
    .style("text-anchor", "end")
    .text("Clean Accuracy (%)");

  // var tooltip_g5 = d3.select("#div4G5")
  //     .append("div")
  //     .style("position", "absolute")
  //     .style("visibility", "hidden")
  //     .text("I'm a tooltip!");

  svg_g5
    .selectAll(".g5-text")
    .data(data_g5)
    .enter()
    .append("text")
    .attr(
      "x",
      (d) => x_g5(parseFloat(d.clean_acc)) + 100 * Math.sqrt(parseFloat(d.eps))
    )
    .attr(
      "y",
      (d) => y_g5(parseFloat(d.adv_acc)) - 100 * Math.sqrt(parseFloat(d.eps))
    )
    .text((d) =>
      d.eps == "0.0000"
        ? null
        : EpsLetter +
          "=" +
          (d.eps == "0.0000"
            ? "0"
            : d.eps == "0.0039"
            ? "1/255"
            : d.eps == "0.0078"
            ? "2/255"
            : d.eps == "0.0157"
            ? "4/255"
            : d.eps == "0.0314"
            ? "8/255"
            : "16/255")
    );

  svg_g5
    .selectAll(".g5-mark")
    .data(data_g5)
    .enter()
    .append("rect")
    .attr("class", "g5-mark")
    .attr("width", (d) => 100 * Math.sqrt(parseFloat(d.eps)))
    .attr("height", (d) => 100 * Math.sqrt(parseFloat(d.eps)))
    .attr(
      "x",
      (d) => x_g5(parseFloat(d.clean_acc)) - 50 * Math.sqrt(parseFloat(d.eps))
    )
    .attr(
      "y",
      (d) => y_g5(parseFloat(d.adv_acc)) - 50 * Math.sqrt(parseFloat(d.eps))
    )
    .attr("opacity", 0.6)
    .attr("fill", "#ff8c00")
    .attr("stroke", "black")
    .attr("stroke-width", 0.3)
    .on("mouseover", function (d, i) {
      d3.select(this).attr("opacity", 1).attr("stroke-width", 2);
      // tooltip_g5.style("visibility", "visible");
      // tooltip_g5.style("top", d3.select(this).attr("cy") + "px")
      //        .style("left", d3.select(this).attr("cx") + "px")
      //        .text(EpsLetter + "=" + (d.eps == "0.0000" ? "0" : d.eps == "0.0039" ? "1/255" : d.eps == "0.0078" ? "2/255" : d.eps == "0.0157" ? "4/255" : d.eps == "0.0314" ? "8/255" : "16/255"));
      svg_g5
        .append("line")
        .attr("class", "g5-hoverAddOn")
        .attr("x1", x_g5(parseFloat(d.clean_acc)))
        .attr("x2", x_g5(parseFloat(d.clean_acc)))
        .attr("y1", y_g5(parseFloat(d.adv_acc)))
        .attr("y2", height)
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "20,10,5,5,5,10");
      svg_g5
        .append("line")
        .attr("class", "g5-hoverAddOn")
        .attr("x1", 0)
        .attr("x2", x_g5(parseFloat(d.clean_acc)))
        .attr("y1", y_g5(parseFloat(d.adv_acc)))
        .attr("y2", y_g5(parseFloat(d.adv_acc)))
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "20,10,5,5,5,10");
      svg_g5
        .append("text")
        .attr("class", "g5-hoverAddOn")
        .attr("x", x_g5(parseFloat(d.clean_acc)) + 5)
        .attr("y", height - 5)
        .text(d.clean_acc + "%")
        .attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("fill", "green");
      svg_g5
        .append("text")
        .attr("class", "g5-hoverAddOn")
        .attr("x", 5)
        .attr("y", y_g5(parseFloat(d.adv_acc)) + 15)
        .text(d.adv_acc + "%")
        .attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("fill", "red");
    })
    .on("mouseout", function (d, i) {
      d3.select(this).attr("opacity", 0.6).attr("stroke-width", 0.3);
      // tooltip_g5.style("visibility", "hidden");
      svg_g5.selectAll(".g5-hoverAddOn").remove();
    })
    .on("click", (d) => {});
});
