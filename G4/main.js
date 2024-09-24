let samples;

const svg_g4 = d3
  .select("#G4")
  .attr("width", 0.6 * width + margin.left + margin.right + padding)
  .attr("height", height + margin.top + margin.bottom + padding)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("width", width)
  .attr("height", height);

// Scales and Axes
const x_g4 = d3.scaleLinear().range([0, 0.6 * width]);
const y_g4 = d3.scaleLinear().range([height, 0]);
const color_g4 = d3.scaleOrdinal().range(d3.schemeSet1);

Promise.all([
  d3.csv("Datasets/clean_and_adversarial_acc_AT_8.csv"),
  d3.csv("Datasets/clean_and_adversarial_acc_NT_model.csv"),
]).then((data_g4) => {
  let at_acc = data_g4[0];
  let nt_acc = data_g4[1];
  let acc = [];

  for (let i = 0; i < nt_acc.length; i++) {
    acc.push({
      epoch: nt_acc[i].epoch_num,
      nt_clean: nt_acc[i].clean_acc,
      nt_adv: nt_acc[i].adv_acc,
      at_clean: at_acc[i].clean_acc,
      at_adv: at_acc[i].adv_acc,
    });
  }

  samples = d3
    .keys(acc[0])
    .filter((key) => key !== "epoch")
    .map((name) => {
      return {
        name: name,
        values: acc.map((d) => {
          return { epoch: d.epoch, acc: +d[name] };
        }),
      };
    });
  //   console.log(samples);

  color_g4.domain(["at", "nt"]);
  x_g4.domain([1, 100]);
  y_g4.domain([0, 100]);
  const xAxis_g4 = d3.axisBottom(x_g4);
  const yAxis_g4 = d3.axisLeft(y_g4);

  // Add on axes and axis labels
  svg_g4
    .append("g")
    .attr("class", "g4-xaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis_g4);
  svg_g4.append("g").attr("class", "g4-yaxis").call(yAxis_g4);
  svg_g4
    .append("text")
    .attr("class", "g4-yaxis-label")
    .attr("y", 6)
    .attr("dy", ".71em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end")
    .text("Accuracy (%)");

  let sample = svg_g4
    .selectAll(".g4-sample")
    .data(samples)
    .enter()
    .append("g")
    .attr("class", "g4-sample")
    .attr("data-sample", (d) => d.name);

  const line = d3
    .line()
    .x((d) => x_g4(d.epoch))
    .y((d) => y_g4(d.acc));

  // Build a legend
  const legend = svg_g4
    .selectAll(".g4-legend")
    .data(samples)
    .enter()
    .append("g")
    .attr("class", "g4-legend")
    .attr("transform", (d, i) => "translate(0," + (450 + i * 20) + ")");
  legend
    .append("line")
    .attr("x1", 0.6 * width - 28)
    .attr("y1", -79)
    .attr("x2", 0.6 * width)
    .attr("y2", -79)
    .style("stroke-dasharray", (d) => {
      if (d.name.split("_")[1] === "adv") return "4";
    })
    .style("stroke", (d) => color_g4(d.name.split("_")[0]));
  legend
    .append("text")
    .attr("x", 0.6 * width - 35)
    .attr("y", -75)
    .style("text-anchor", "end")
    .text((d) => {
      switch (d.name) {
        case "nt_clean":
          return "Regular-trained model on Clean images";
        case "nt_adv":
          return "Regular-trained model on Adversarial images";
        case "at_clean":
          return "Adversarial-trained model on Clean images";
        case "at_adv":
          return "Adversarial-trained model on Adversarial images";
      }
    });

  // Lines
  sample
    .append("path")
    .attr("class", "g4-line")
    .attr("d", (d) => line(d.values))
    .attr("stroke", (d) => color_g4(d.name.split("_")[0]))
    .attr("fill", "none")
    .attr("stroke-dasharray", (d) => {
      if (d.name.split("_")[1] === "adv") return "4";
    });

  // Points
  sample
    .selectAll(".g4-circle")
    .data((d) => d.values)
    .enter()
    .append("circle")
    .attr("class", "g4-circle")
    .attr("r", 1)
    .attr("cx", (d) => x_g4(d.epoch))
    .attr("cy", (d) => y_g4(d.acc))
    .style("fill", function (d, i) {
      const model = this.parentNode.getAttribute("data-sample");
      return color_g4(model.split("_")[0]);
    });
});
//   .then(() => {
//     // Hover line
//     // Added at the end so it's on top of everything else
//     const mouse = svg_g4.append("g").attr("class", "g4-mouse-over-effects");
//     mouse
//       .append("path")
//       .attr("class", "g4-mouse-line")
//       .style("stroke", "black")
//       .style("stroke-width", "1px")
//       .style("opacity", "0");
//     const epochLabel = mouse
//       .append("text")
//       .attr("id", "g4-epoch-label")
//       .attr("transform", "translate(0,20)")
//       .style("text-anchor", "middle");

//     // Hover labels
//     const mousePerLine = mouse
//       .selectAll(".g4-mouse-per-line")
//       .data(samples)
//       .enter()
//       .append("g")
//       .attr("class", "g4-mouse-per-line");
//     mousePerLine
//       .append("circle")
//       .attr("r", 7)
//       .style("stroke", (d) => color_g4(d.name.split("_")[0]))
//       .style("fill", "none")
//       .style("stroke-width", "1px")
//       .style("opacity", "0");
//     mousePerLine.append("text").attr("transform", "translate(10,-10)");

//     // Add on the hover events when we have the data and stuff
//     const lines = document.getElementsByClassName("g4-line");
//     mouse
//       .append("svg:rect")
//       .attr("width", width)
//       .attr("height", height)
//       .attr("fill", "none")
//       .attr("pointer-events", "all")
//       .on("mouseout", () => {
//         d3.select(".g4-mouse-line").style("opacity", "0");
//         d3.selectAll(".g4-mouse-per-line circle").style("opacity", "0");
//         d3.selectAll(".g4-mouse-per-line text").style("opacity", "0");
//       })
//       .on("mouseover", () => {
//         d3.select(".g4-mouse-line").style("opacity", "1");
//         d3.selectAll(".g4-mouse-per-line circle").style("opacity", "1");
//         d3.selectAll(".g4-mouse-per-line text").style("opacity", "1");
//       })
//       .on("mousemove", function () {
//         let mouse = d3.mouse(this);
//         const epoch = Math.round(x_g4.invert(mouse[0]));
//         d3.select(".g4-mouse-line").attr("d", function () {
//           let d = "M" + x_g4(epoch) + "," + height; // draw from (x, top)
//           d += " " + x_g4(epoch) + "," + 0; // down to   (x, bottom)
//           return d;
//         });
//         d3.selectAll(".g4-mouse-per-line").attr("transform", function (d, i) {
//           d3.select(this)
//             .select("text")
//             .text(d.values[epoch - 1].acc + "%");
//           return (
//             "translate(" +
//             x_g4(epoch) +
//             "," +
//             y_g4(d.values[epoch - 1].acc) +
//             ")"
//           );
//         });
//         d3.select("#g4-epoch-label").attr("transform", function (d, i) {
//           d3.select(this).text("Epoch " + epoch);
//           return "translate(" + mouse[0] + "," + (height + 30) + ")";
//         });
//       });
//   });

function showAcc(eps) {
  // Remove clicked class from all buttons
  document.querySelectorAll(".button4G4").forEach((button) => {
    button.classList.remove("clicked");
  });
  // Add clicked class to the clicked button, whose data-value is equal to eps
  document
    .querySelector(`.button4G4[data-value="${eps}"]`)
    .classList.add("clicked");

  Promise.all([
    d3.csv(`Datasets/clean_and_adversarial_acc_AT_${eps}.csv`),
    d3.csv("Datasets/clean_and_adversarial_acc_NT_model.csv"),
  ]).then((data_g4) => {
    let at_acc = data_g4[0];
    let nt_acc = data_g4[1];
    let acc = [];

    for (let i = 0; i < nt_acc.length; i++) {
      acc.push({
        epoch: nt_acc[i].epoch_num,
        nt_clean: nt_acc[i].clean_acc,
        nt_adv: nt_acc[i].adv_acc,
        at_clean: at_acc[i].clean_acc,
        at_adv: at_acc[i].adv_acc,
      });
    }

    samples = d3
      .keys(acc[0])
      .filter((key) => key !== "epoch")
      .map((name) => {
        return {
          name: name,
          values: acc.map((d) => {
            return { epoch: d.epoch, acc: +d[name] };
          }),
        };
      });

    const line = d3
      .line()
      .x((d) => x_g4(d.epoch))
      .y((d) => y_g4(d.acc));

    svg_g4
      .selectAll(".g4-line")
      .data(samples)
      .transition()
      .duration(500)
      .attr("d", (d) => line(d.values));
    svg_g4
      .selectAll(".g4-circle")
      .data(samples.map((d) => d.values).flat())
      .transition()
      .duration(500)
      .attr("cx", (d) => x_g4(d.epoch))
      .attr("cy", (d) => y_g4(d.acc));
  });
}
