const EpsLetter = "\u03F5";
const margin = {top: 20, right: 80, bottom: 20, left: 80},
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom,
      padding = 100;
const svg = d3.select("#G5")
    .attr("width", width + margin.left + margin.right + padding)
    .attr("height", height + margin.top + margin.bottom + padding)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("width", width)
    .attr("height", height);

// Scales and Axes
const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

d3.csv("../Datasets/clean_adv_tradeoff4different_eps.csv").then(data => {
    x.domain([Math.min(...data.map(d => parseFloat(d.clean_acc)))-5, Math.max(...data.map(d => parseFloat(d.clean_acc)))+5]);
    y.domain([Math.min(...data.map(d => parseFloat(d.adv_acc)))-5, Math.max(...data.map(d => parseFloat(d.adv_acc)))+5]);
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Add on axes and axis labels
    svg.append("g")
        .attr("class", "g5-xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
    svg.append("g")
        .attr("class", "g5-yaxis")
        .call(yAxis)
    svg.append("text")
        .attr("class", "g5-yaxis-label")
        .attr("y", 6)
        .attr("dy", -35)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .text("Adversarial Accuracy (%)");
    svg.append("text")
        .attr("class", "g5-xaxis-label")
        .attr("x", width)
        .attr("dy", height+35)
        .style("text-anchor", "end")
        .text("Clean Accuracy (%)");

    var tooltip = d3.select("#div-G5")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .text("I'm a circle!");

    svg.selectAll(".g5-mark")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "g5-mark")
        .attr("r", d => 100*Math.sqrt(parseFloat(d.eps)))
        .attr("cx", d => x(parseFloat(d.clean_acc)))
        .attr("cy", d => y(parseFloat(d.adv_acc)))
        .attr("opacity", 0.6)
        .attr("fill", "#C235CE")
        .attr("stroke", "black")
        .attr("stroke-width", 0.3)
        .on("mouseover", function(d, i) {
            d3.select(this).attr("opacity", 1).attr("stroke-width", 2);
            tooltip.style("visibility", "visible");
            tooltip.style("top", (y(parseFloat(d.adv_acc)))+"px")
                   .style("left",(x(parseFloat(d.clean_acc)) + 20)+"px")
                   .text(EpsLetter + "=" + (d.eps == "0.0000" ? "0" : d.eps == "0.0039" ? "1/255" : d.eps == "0.0078" ? "2/255" : d.eps == "0.0157" ? "4/255" : d.eps == "0.0314" ? "8/255" : "16/255"));
            svg.append("line")
               .attr("class", "g5-hoverAddOn")
               .attr("x1", x(parseFloat(d.clean_acc)))
               .attr("x2", x(parseFloat(d.clean_acc)))
               .attr("y1", y(parseFloat(d.adv_acc)))
               .attr("y2", height)
               .attr("stroke", "black")
               .attr("stroke-dasharray", "20,10,5,5,5,10");
            svg.append("line")
               .attr("class", "g5-hoverAddOn")
               .attr("x1", 0)
               .attr("x2", x(parseFloat(d.clean_acc)))
               .attr("y1", y(parseFloat(d.adv_acc)))
               .attr("y2", y(parseFloat(d.adv_acc)))
               .attr("stroke", "black")
               .attr("stroke-dasharray", "20,10,5,5,5,10");
            svg.append("text")
               .attr("class", "g5-hoverAddOn")
               .attr("x", x(parseFloat(d.clean_acc))+5)
               .attr("y", height-5)
               .text(d.clean_acc + "%")
               .attr("font-family", "Arial, Helvetica, sans-serif")
               .attr("fill", "green");
            svg.append("text")
               .attr("class", "g5-hoverAddOn")
               .attr("x", 5)
               .attr("y", y(parseFloat(d.adv_acc))+15)
               .text(d.adv_acc + "%")
               .attr("font-family", "Arial, Helvetica, sans-serif")
               .attr("fill", "red");
        })
        .on("mouseout", function(d, i) {
            d3.select(this).attr("opacity", 0.6).attr("stroke-width", 0.3);
            tooltip.style("visibility", "hidden");
            svg.selectAll(".g5-hoverAddOn").remove()
        })
        .on('click', d => {});
    
});
