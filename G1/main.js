let data_G1;
let steps;

const margin = {top: 20, right: 80, bottom: 20, left: 80},
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom,
      padding = 100;
const graph = d3.select("#G1")
    .attr("width", 2 * width + margin.left + margin.right + padding)
    .attr("height", 2 * height + margin.top + margin.bottom + padding)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("width", width)
    .attr("height", height);
const map = d3.select("#G1")
    .append("g")
    .attr("transform", "translate(" + (margin.left + width + padding) + "," + margin.top + ")")
    .attr("width", width)
    .attr("height", height);

// Scales and Axes
const x = d3.scaleLinear()
    .domain([1, 100])
    .range([0, width]);
const yLoss = d3.scaleLinear()
    .domain([0, 2.03])
    .range([height, 0]);
const yAcc = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);
const color = d3.scaleOrdinal()
    .domain(["accuracy", "loss"])
    .range(d3.schemeSet2);
const heat = d3.interpolateRdBu;  // Already domain [0, 1]
const xAxis_G1 = d3.axisBottom(x);
const yLossAxis = d3.axisLeft(yLoss);
const yAccAxis = d3.axisRight(yAcc);

// Building the image selection and the heatmap
const gallery = map.append("g");
const imgSize = 70;
const imgMargin = 5;
let currentEpoch = 1;
const categories = ["airplane", "automobile", "bird", "cat", "deer",
                    "dog", "frog", "horse", "ship", "truck"];
const heatmap = map.append("g")
    .attr("class", "g1-heatmap")
    .attr("transform", "translate(0,300)")
function selectImage() {
    d3.select(".g1-selected-image")
        .classed("g1-selected-image", false);
    this.setAttribute("class", "g1-selected-image");
    updateHeat();
}
gallery.selectAll(".g1-heatmap-img")
    .data(categories)
    .enter()
    .append("image")
    .attr("class", "g1-heatmap-img")
    .classed("g1-selected-image", (d, i) => i == 0)
    .attr("data-index", (d, i) => i)
    .attr("href", (d, i) => "../Datasets/Images/img" + i + "0.png")
    .attr("width", imgSize)
    .attr("height", imgSize)
    .attr("x", (d, i) => (i % 5) * (imgSize + imgMargin))
    .attr("y", (d, i) => Math.floor(i / 5) * (imgSize + imgMargin))
    .on("click", selectImage);
heatmap.selectAll(".g1-heatmap-square")
    .data(categories)
    .enter()
    .append("rect")
    .attr("class", "g1-heatmap-square")
    .attr("width", imgSize)
    .attr("height", imgSize)
    .attr("x", (d, i) => (i % 5) * (imgSize + imgMargin))
    .attr("y", (d, i) => Math.floor(i / 5) * (imgSize + imgMargin))
    .attr("stroke", "black")
heatmap.selectAll(".g1-heatmap-label")
    .data(categories)
    .enter()
    .append("text")
    .attr("class", "g1-heatmap-label")
    .attr("x", (d, i) => (i % 5) * (imgSize + imgMargin) + (imgSize / 2))
    .attr("y", (d, i) => Math.floor(i / 5) * (imgSize + imgMargin) + (imgSize / 2))
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("font-family", "sans-serif")
    .style("fill", "white")
    .text(d => d);
heatmap.selectAll(".g1-heatmap-measure")
    .data(categories)
    .enter()
    .append("text")
    .attr("class", "g1-heatmap-measure")
    .attr("x", (d, i) => (i % 5) * (imgSize + imgMargin) + (imgSize / 2))
    .attr("y", (d, i) => Math.floor(i / 5) * (imgSize + imgMargin) + (imgSize / 8 * 7))
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .style("font-size", "10px")
    .style("font-family", "sans-serif")
    .style("fill", "white");
function updateHeat() {
    const chosenImg = d3.select(".g1-selected-image").attr("data-index");
    heatmap.selectAll(".g1-heatmap-square")
        .attr("fill", (d, i) => heat(steps[currentEpoch][chosenImg][i]));
    heatmap.selectAll(".g1-heatmap-measure")
        .text((d, i) => (steps[currentEpoch][chosenImg][i] * 100).toFixed(2) + "%");
}

d3.csv("../Datasets/clean_and_adversarial_acc_NT_model.csv").then(dataset => {
    data_G1 = dataset;

    // Add on axes and axis labels
    const axes = graph.append("g")
        .attr("id", "g1-graph-axes")
    axes.append("g")
        .attr("class", "g1-xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis_G1)
    axes.append("g")
        .attr("class", "g1-loss-yaxis")
        .call(yLossAxis)
        .select(".domain")
        .attr("stroke", color("loss"))
    axes.append("text")
        .attr("class", "g1-loss-yaxis-label")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .text("Loss");
    axes.append("g")
        .attr("class", "g1-acc-yaxis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAccAxis)
        .select(".domain")
        .attr("stroke", color("accuracy"))
    axes.append("text")
        .attr("class", "g1-acc-yaxis-label")
        .attr("y", width - 20)
        .attr("x", 6)
        .attr("dy", ".71em")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .text("Accuracy (%)");

    // Lines
    const line = d3.line()
        .x(d => x(d.epoch))
        .y(d => y(d.acc))

    graph.append("path")
        .datum(data_G1)
        .attr("class", "g1-loss-line g1-line")
        .attr("d", d3.line()
            .x(d => x(d.epoch_num))
            .y(d => yLoss(d.loss))
        )
        .attr("stroke", color("loss"))
        .attr("stroke-width", 1.5)
        .attr("fill", "none")
    graph.append("path")
        .datum(data_G1)
        .attr("class", "g1-acc-line g1-line")
        .attr("d", d3.line()
            .x(d => x(d.epoch_num))
            .y(d => yAcc(d.clean_acc))
        )
        .attr("stroke", color("accuracy"))
        .attr("stroke-width", 1.5)
        .attr("fill", "none")
    
    // Points
    graph.selectAll(".g1-loss-circle")
        .data(data_G1)
        .enter()
        .append("circle")
        .attr("class", "g1-loss-circle g1-circle")
        .attr("r", 1)
        .attr("cx", d => x(d.epoch_num))
        .attr("cy", d => yLoss(d.loss))
        .style("fill", color("loss"))
    graph.selectAll(".g1-acc-circle")
        .data(data_G1)
        .enter()
        .append("circle")
        .attr("class", "g1-acc-circle g1-circle")
        .attr("r", 1)
        .attr("cx", d => x(d.epoch_num))
        .attr("cy", d => yAcc(d.clean_acc))
        .style("fill", color("accuracy"))

    // Step two is to load the other data
    return d3.json("../Datasets/examplesOutputProbPerEpoch_NT.json");
}).then(dataset => {
    steps = dataset;
    updateHeat();
}).then(() => {
    // Hover line
    // Added at the end so it's on top of everything else
    const mouse = graph.append("g")
        .attr("class", "g1-mouse-over-effects");
    mouse.append("path")
        .attr("class", "g1-mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");
    const epochLabel = mouse.append("text")
        .attr("id", "g1-epoch-label")
        .attr("transform", "translate(0,20)")
        .style("text-anchor", "middle");
    // Horizontal hover lines
    mouse.append("path")
        .attr("class", "g1-axis-line g1-mouse-loss-line")
        .style("stroke", color("loss"))
        .style("stroke-width", "1px")
        .style("opacity", "0")
    mouse.append("path")
        .attr("class", "g1-axis-line g1-mouse-acc-line")
        .style("stroke", color("accuracy"))
        .style("stroke-width", "1px")
        .style("opacity", "0")

    // Hover labels
    const mousePerLine = mouse.selectAll(".g1-mouse-per-line")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("class", "g1-mouse-per-line");
    mousePerLine.append("circle")
        .attr("r", 7)
        .style("stroke", d => color(d))
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");
    mousePerLine.append("text")
        .attr("transform", "translate(10,-10)");

    // Add on the hover events when we have the data and stuff
    const lines = document.getElementsByClassName("g1-line");
    mouse.append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("mouseout", () => {
            d3.select(".g1-mouse-line").style("opacity", "0");
            d3.selectAll(".g1-axis-line").style("opacity", "0");
            d3.selectAll(".g1-mouse-per-line circle").style("opacity", "0");
            d3.selectAll(".g1-mouse-per-line text").style("opacity", "0");
        })
        .on("mouseover", () => {
            d3.select(".g1-mouse-line").style("opacity", "1");
            d3.selectAll(".g1-axis-line").style("opacity", "0.5");
            d3.selectAll(".g1-mouse-per-line circle").style("opacity", "1");
            d3.selectAll(".g1-mouse-per-line text").style("opacity", "1");
        })
        .on("mousemove", function() {
            let mouse = d3.mouse(this);
            const epoch = Math.round(x.invert(mouse[0]));
            d3.select(".g1-mouse-line")
                .attr("d", function() {
                    let d = "M" + x(epoch) + "," + height;  // draw from (x, top)
                    d += " " + x(epoch) + "," + 0;          // down to   (x, bottom)
                    return d;
                });
            d3.select(".g1-mouse-loss-line")
                .attr("d", function() {
                    let d = "M0," + yLoss(data_G1[epoch - 1].loss);
                    d += " " + x(epoch) + "," + yLoss(data_G1[epoch - 1].loss);
                    return d;
                });
            d3.select(".g1-mouse-acc-line")
                .attr("d", function() {
                    let d = "M" + x(epoch) + "," + yAcc(data_G1[epoch - 1].clean_acc);
                    d += " " + width + "," + yAcc(data_G1[epoch - 1].clean_acc);
                    return d;
                });
            d3.selectAll(".g1-mouse-per-line")
                .attr("transform", function(d) {
                    if (d === "loss") {
                        d3.select(this).select("text")
                            .text(data_G1[epoch - 1].loss);
                        return "translate(" + x(epoch) + "," + yLoss(data_G1[epoch - 1].loss) + ")";
                    } else {
                        d3.select(this).select("text")
                            .text(data_G1[epoch - 1].clean_acc + "%");
                        return "translate(" + x(epoch) + "," + yAcc(data_G1[epoch - 1].clean_acc) + ")";
                    }
                });
            d3.select("#g1-epoch-label")
                .attr("transform", function(d, i) {
                    d3.select(this).text("Epoch " + epoch);
                    return "translate(" + mouse[0] + "," + (height + 30) + ")";
                });
            currentEpoch = epoch;
            updateHeat();
        });
});