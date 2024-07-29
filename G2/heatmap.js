const heatmapWidth = 0.8 * width - margin.left - margin.right;
const heatmapHeight = 0.8 * height - margin.top - margin.bottom;

// Class labels
const classLabels = [
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

const realLabels = [
  3, 8, 8, 0, 6, 6, 1, 6, 3, 1, 0, 9, 5, 7, 9, 8, 5, 7, 8, 6, 7, 0, 4, 9, 5, 2,
  4, 0, 9, 6, 6, 5, 4, 5, 9, 2, 4, 1, 9, 5, 4, 6, 5, 6, 0, 9, 3, 9, 7, 6, 9, 8,
  0, 3, 8, 8, 7, 7, 4, 6, 7, 3, 6, 3, 6, 2, 1, 2, 3, 7, 2, 6, 8, 8, 0, 2, 9, 3,
  3, 8, 8, 1, 1, 7, 2, 5, 2, 7, 8, 9, 0, 3, 8, 6, 4, 6, 6, 0, 0, 7, 4, 5, 6, 3,
  1, 1, 3, 6, 8, 7, 4, 0, 6, 2, 1, 3, 0, 4, 2, 7, 8, 3, 1, 2, 8, 0, 8, 3, 5, 2,
  4, 1, 8, 9, 1, 2, 9, 7, 2, 9, 6, 5, 6, 3, 8, 7, 6, 2, 5, 2, 8, 9, 6, 0, 0, 5,
  2, 9, 5, 4, 2, 1, 6, 6, 8, 4, 8, 4, 5, 0, 9, 9, 9, 8, 9, 9, 3, 7, 5, 0, 0, 5,
  2, 2, 3, 8, 6, 3, 4, 0, 5, 8, 0, 1, 7, 2, 8, 8, 7, 8, 5, 1, 8, 7, 1, 3, 0, 5,
  7, 9, 7, 4, 5, 9, 8, 0, 7, 9, 8, 2, 7, 6, 9, 4, 3, 9, 6, 4, 7, 6, 5, 1, 5, 8,
  8, 0, 4, 0, 5, 5, 1, 1, 8, 9, 0, 3, 1, 9, 2, 2, 5, 3, 9, 9, 4, 0, 3, 0, 0, 9,
  8, 1, 5, 7, 0, 8, 2, 4, 7, 0, 2, 3, 6, 3, 8, 5, 0, 3, 4, 3, 9, 0, 6, 1, 0, 9,
  1, 0, 7, 9, 1, 2, 6, 9, 3, 4, 6, 0, 0, 6, 6, 6, 3, 2, 6, 1, 8, 2, 1, 6, 8, 6,
  8, 0, 4, 0, 7, 7, 5, 5, 3, 5, 2, 3, 4, 1, 7, 5, 4, 6, 1, 9, 3, 6, 6, 9, 3, 8,
  0, 7, 2, 6, 2, 5, 8, 5, 4, 6, 8, 9, 9, 1, 0, 2, 2, 7, 3, 2, 8, 0, 9, 5, 8, 1,
  9, 4, 1, 3, 8, 1, 4, 7, 9, 4, 2, 7, 0, 7, 0, 6, 6, 9, 0, 9, 2, 8, 7, 2, 2, 5,
  1, 2, 6, 2, 9, 6, 2, 3, 0, 3, 9, 8, 7, 8, 8, 4, 0, 1, 8, 2, 7, 9, 3, 6, 1, 9,
  0, 7, 3, 7, 4, 5, 0, 0, 2, 9, 3, 4, 0, 6, 2, 5, 3, 7, 3, 7, 2, 5, 3, 1, 1, 4,
  9, 9, 5, 7, 5, 0, 2, 2, 2, 9, 7, 3, 9, 4, 3, 5, 4, 6, 5, 6, 1, 4, 3, 4, 4, 3,
  7, 8, 3, 7, 8, 0, 5, 7, 6, 0, 5, 4, 8, 6, 8, 5, 5, 9, 9, 9, 5, 0, 1, 0, 8, 1,
  1, 8, 0, 2, 2, 0, 4, 6, 5, 4, 9, 4, 7, 9, 9, 4, 5, 6,
];

// Calculate maximum text width for y-axis labels
const maxTextWidth = 100;

// Load data
d3.json("./Datasets/stepWiseProb_NT.json").then((data) => {
  // Create confusion matrix with percentages
  const confusionMatrix = Array.from({ length: 10 }, () => Array(10).fill(0));
  const labelCounts = Array(10).fill(0);

  data["0"].forEach((imagePredictions, index) => {
    const realLabel = realLabels[index];
    const predictedLabel = imagePredictions.indexOf(
      Math.max(...imagePredictions)
    );
    labelCounts[realLabel]++;
    confusionMatrix[realLabel][predictedLabel]++;
  });

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      confusionMatrix[i][j] = (confusionMatrix[i][j] / labelCounts[i]) * 100;
    }
  }

  // Create SVG element
  const svg = d3
    .select("#heatmap")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Create scales
  const xScale = d3
    .scaleBand()
    .domain(classLabels)
    .range([0, heatmapWidth])
    .padding(0.01);

  const yScale = d3
    .scaleBand()
    .domain(classLabels)
    .range([heatmapHeight, 0])
    .padding(0.01);

  const colorScale = d3.scaleSequential(d3.interpolatePuBuGn).domain([0, 100]);

  // Draw heatmap cells
  svg
    .selectAll(".cell")
    .data(confusionMatrix.flat())
    .enter()
    .append("rect")
    .attr("y", (d, i) => yScale(classLabels[parseInt(i / 10)]))
    .attr("x", (d, i) => xScale(classLabels[i % 10]) + maxTextWidth)
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("id", (d, i) => `cell-${parseInt(i / 10)}-${i % 10}-${d}`)
    .attr("fill", (d) => colorScale(d))
    .attr("cursor", "pointer")
    .on("mouseover", function (event, d) {
      let thisPercentage = parseFloat(this.id.split("-")[3]);
      // Calculate the center of the cell
      const x = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
      const y = parseFloat(d3.select(this).attr("y")) + yScale.bandwidth() / 2;
      // Append a text element to display the data
      svg
        .append("text")
        .attr("class", "cell-tooltip")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", thisPercentage > 50 ? "white" : "black")
        .attr("mouse-event", "none")
        .text(`${thisPercentage.toFixed(2)}%`);
    })
    .on("mouseout", function () {
      // Remove the tooltip text when the mouse leaves the cell
      svg.selectAll(".cell-tooltip").remove();
    });

  // Add axes
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(${maxTextWidth}, ${heatmapHeight})`)
    .call(d3.axisBottom(xScale).tickFormat((d) => d));

  svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${maxTextWidth}, 0)`)
    .call(d3.axisLeft(yScale).tickFormat((d) => d));

  // Add labels
  svg
    .append("text")
    .attr(
      "transform",
      `translate(${heatmapWidth / 2 + maxTextWidth}, ${
        heatmapHeight + margin.bottom + margin.top
      })`
    )
    .style("text-anchor", "middle")
    .text("Predicted Label");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + maxTextWidth)
    .attr("x", -heatmapHeight / 2)
    .style("text-anchor", "middle")
    .text("Real Label");

  // Add color legend
  const legendWidth = 20;
  const legendHeight = heatmapHeight;
  const legendScale = d3
    .scaleLinear()
    .domain(colorScale.domain())
    .range([0, legendHeight]);

  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr(
      "transform",
      `translate(${maxTextWidth + heatmapWidth + margin.right / 2}, 0)`
    );

  legend
    .selectAll(".legend-rect")
    .data(d3.range(0, legendHeight, 1))
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d) => legendHeight - d)
    .attr("width", legendWidth)
    .attr("height", 1)
    .attr("fill", (d) => colorScale(legendScale.invert(d)));

  legend
    .append("text")
    .attr("class", "legend-label")
    .attr("x", legendWidth + 5)
    .attr("y", 0)
    .attr("dy", "1em")
    .text(d3.format(".1f")(colorScale.domain()[1]) + "%");

  legend
    .append("text")
    .attr("class", "legend-label")
    .attr("x", legendWidth + 5)
    .attr("y", legendHeight)
    .attr("dy", "0.32em")
    .text(d3.format(".1f")(colorScale.domain()[0]) + "%");
});

var step = 0; // Initial step
const maxSteps = 5; // Maximum number of steps

const stepText = document.getElementById("step-text");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

function updateStepText() {
  stepText.textContent = `after ${step} step(s) of adversarial attack`;
  updateG2Heatmap(step);
}

leftArrow.addEventListener("click", () => {
  if (step > 0) {
    step--;
    updateStepText();
    // Add code here to update the heatmap based on the new step
  }
});

rightArrow.addEventListener("click", () => {
  if (step < maxSteps) {
    step++;
    updateStepText();
    // Add code here to update the heatmap based on the new step
  }
});

function updateG2Heatmap(step) {
  // Add code here to update the heatmap based on the new step
  d3.json("./Datasets/stepWiseProb_NT.json").then((data) => {
    // Create confusion matrix with percentages
    const confusionMatrix = Array.from({ length: 10 }, () => Array(10).fill(0));
    const labelCounts = Array(10).fill(0);

    data[step.toString()].forEach((imagePredictions, index) => {
      const realLabel = realLabels[index];
      const predictedLabel = imagePredictions.indexOf(
        Math.max(...imagePredictions)
      );
      labelCounts[realLabel]++;
      confusionMatrix[realLabel][predictedLabel]++;
    });

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        confusionMatrix[i][j] = (confusionMatrix[i][j] / labelCounts[i]) * 100;
      }
    }

    // Create scales
    const svg = d3.select("#heatmap svg");

    const xScale = d3
      .scaleBand()
      .domain(classLabels)
      .range([0, heatmapWidth])
      .padding(0.01);

    const yScale = d3
      .scaleBand()
      .domain(classLabels)
      .range([heatmapHeight, 0])
      .padding(0.01);

    const colorScale = d3
      .scaleSequential(d3.interpolatePuBuGn)
      .domain([0, 100]);

    // Update the heatmap cells
    const cells = svg.selectAll(".cell").data(confusionMatrix.flat());
    cells
      .enter()
      .append("rect")
      .attr("class", "cell")
      .merge(cells)
      .attr("y", (d, i) => yScale(classLabels[parseInt(i / 10)]))
      .attr("x", (d, i) => xScale(classLabels[i % 10]) + maxTextWidth)
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("id", (d, i) => `cell-${parseInt(i / 10)}-${i % 10}-${d}`)
      .attr("fill", (d) => colorScale(d))
      .attr("cursor", "pointer")
      .on("mouseover", function (event, d) {
        let thisPercentage = parseFloat(this.id.split("-")[3]);
        // Calculate the center of the cell
        const x =
          parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
        const y =
          parseFloat(d3.select(this).attr("y")) + yScale.bandwidth() / 2;
        // Append a text element to display the data
        svg
          .append("text")
          .attr("class", "cell-tooltip")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .attr("fill", thisPercentage > 50 ? "white" : "black")
          .attr("mouse-event", "none")
          .text(`${thisPercentage.toFixed(2)}%`);
      })
      .on("mouseout", function () {
        svg.selectAll(".cell-tooltip").remove();
      });

    cells.exit().remove();
  });
}
