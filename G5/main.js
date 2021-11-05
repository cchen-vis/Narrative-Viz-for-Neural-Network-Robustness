let samples;

const margin = {top: 20, right: 80, bottom: 20, left: 80},
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom,
      padding = 100;
const svg = d3.select("#G4")
    .attr("width", width + margin.left + margin.right + padding)
    .attr("height", height + margin.top + margin.bottom + padding)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("width", width)
    .attr("height", height);

// Scales and Axes
const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);
const color = d3.scaleOrdinal().range(d3.schemeSet1);

Promise.all([
    d3.csv("../Datasets/clean_adv_tradeoff4different_eps.csv")
]).then(data => {
    let at_acc = data[0];
    let nt_acc = data[1];
    let acc = [];
    let clean, adv;

    for (let i = 0; i < nt_acc.length; i++) {
        acc.push({
            epoch: nt_acc[i].epoch_num,
            nt_clean: nt_acc[i].clean_acc,
            nt_adv: nt_acc[i].adv_acc,
            at_clean: at_acc[i].clean_acc,
            at_adv: at_acc[i].adv_acc
        });
    }
    
    samples = d3.keys(acc[0]).filter(key => key !== "epoch").map(name => {
        return {
            name: name,
            values: acc.map(d => {return {epoch: d.epoch, acc: +d[name]}})
        };
    });

    color.domain(["at", "nt"]);
    x.domain([1, 100]);
    y.domain([0, 100]);
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Add on axes and axis labels
    svg.append("g")
        .attr("class", "g4-xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
    svg.append("g")
        .attr("class", "g4-yaxis")
        .call(yAxis)
    svg.append("text")
        .attr("class", "g4-yaxis-label")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .text("Accuracy (%)");

    let sample = svg.selectAll(".g4-sample")
        .data(samples)
        .enter()
        .append("g")
        .attr("class", "g4-sample")
        .attr("data-sample", d => d.name);

    const line = d3.line()
        .x(d => x(d.epoch))
        .y(d => y(d.acc))

    // Build a legend
    const legend = svg.selectAll(".g4-legend")
        .data(samples)
        .enter()
        .append("g")
        .attr("class", "g4-legend")
        .attr("transform", (d, i) => "translate(0," + (450 + i * 20) + ")");
    legend.append("line")
        .attr("x1", width - 28)
        .attr("y1", 10)
        .attr("x2", width)
        .attr("y2", 10)
        .style("stroke-dasharray", d => {
            if (d.name.split("_")[1] === "adv") return "4"
        })
        .style("stroke", d => color(d.name.split("_")[0]))
    legend.append("text")
        .attr("x", width - 44)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => {
            switch (d.name) {
                case "nt_clean": return "Normal model on Clean images";
                case "nt_adv": return "Normal model on Adversarial images";
                case "at_clean": return "Adversarially-trained model on Clean images";
                case "at_adv": return "Adversarially-trained model on Adversarial images";
            }
        });

    // Lines
    sample.append("path")
        .attr("class", "g4-line")
        .attr("d", d => line(d.values))
        .attr("stroke", d => color(d.name.split("_")[0]))
        .attr("fill", "none")
        .attr("stroke-dasharray", d => {
            if (d.name.split("_")[1] === "adv") return "4"
        })
    
    // Points
    sample.selectAll(".g4-circle")
        .data(d => d.values)
        .enter()
        .append("circle")
        .attr("class", "g4-circle")
        .attr("r", 1)
        .attr("cx", d => x(d.epoch))
        .attr("cy", d => y(d.acc))
        .style("fill", function(d, i) {
            const model = this.parentNode.getAttribute("data-sample");
            return color(model.split("_")[0]);
        });
}).then(() => {
    // Hover line
    // Added at the end so it's on top of everything else
    const mouse = svg.append("g")
        .attr("class", "g4-mouse-over-effects");
    mouse.append("path")
        .attr("class", "g4-mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");
    const epochLabel = mouse.append("text")
        .attr("id", "g4-epoch-label")
        .attr("transform", "translate(0,20)")
        .style("text-anchor", "middle");

    // Hover labels
    const mousePerLine = mouse.selectAll(".g4-mouse-per-line")
        .data(samples)
        .enter()
        .append("g")
        .attr("class", "g4-mouse-per-line");
    mousePerLine.append("circle")
        .attr("r", 7)
        .style("stroke", d => color(d.name.split("_")[0]))
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");
    mousePerLine.append("text")
        .attr("transform", "translate(10,-10)");

    // Add on the hover events when we have the data and stuff
    const lines = document.getElementsByClassName("g4-line");
    mouse.append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("mouseout", () => {
            d3.select(".g4-mouse-line").style("opacity", "0");
            d3.selectAll(".g4-mouse-per-line circle").style("opacity", "0");
            d3.selectAll(".g4-mouse-per-line text").style("opacity", "0");
        })
        .on("mouseover", () => {
            d3.select(".g4-mouse-line").style("opacity", "1");
            d3.selectAll(".g4-mouse-per-line circle").style("opacity", "1");
            d3.selectAll(".g4-mouse-per-line text").style("opacity", "1");
        })
        .on("mousemove", function() {
            let mouse = d3.mouse(this);
            const epoch = Math.round(x.invert(mouse[0]));
            d3.select(".g4-mouse-line")
                .attr("d", function() {
                    let d = "M" + x(epoch) + "," + height;  // draw from (x, top)
                    d += " " + x(epoch) + "," + 0;          // down to   (x, bottom)
                    return d;
                });
            d3.selectAll(".g4-mouse-per-line")
                .attr("transform", function(d, i) {
                    d3.select(this).select("text")
                        .text(d.values[epoch - 1].acc + "%");
                    return "translate(" + x(epoch) + "," + y(d.values[epoch - 1].acc) + ")";
                });
            d3.select("#g4-epoch-label")
                .attr("transform", function(d, i) {
                    d3.select(this).text("Epoch " + epoch);
                    return "translate(" + mouse[0] + "," + (height + 30) + ")";
                });
        });
});
