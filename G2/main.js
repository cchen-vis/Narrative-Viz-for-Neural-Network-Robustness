var img = 0;
var epoch = 0;

// Create SVG containers
var imgSelectG = d3.select("#G2").append("svg")
    .attr("id", "imgSelect")
    .attr("width", "200px")
    .attr("height", "500px");

var chartG = d3.select("#G2").append("svg")
    .attr("id", "stackedBarChart")
    .attr("width", "800px")
    .attr("height", "600px");

var imgG = d3.select("#G2")
    .append("svg")
    .attr("id", "images")
    .attr("width", "1000px")
    .attr("height", "200px")

// Global constants
var margin_G2 = 200;
var chartWidth = parseInt(chartG.attr("width")) - margin_G2;
var chartHeight = parseInt(chartG.attr("height")) - margin_G2;
var axisPadding = margin_G2/2;
var barWidth = 50;
var imageOffsetX = 550;

// Scales
var cScale = d3.scaleOrdinal(d3.schemeTableau10);
var hScale = d3.scaleLinear()
    .domain([0,1])
    .range([chartHeight, 1]);
var xScale = d3.scaleBand()
    .domain(["airplane", "automobile", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"])
    .range([0, chartWidth]);

// Axis Rendering
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(hScale);

var xAxisG = chartG.append('g')
    .attr('class', 'x_axis')
    .attr('transform', 'translate('+[axisPadding, chartHeight+axisPadding]+')')
    .call(xAxis);
var yAxisG = chartG.append('g')
    .attr('class', 'y_axis')
    .attr("transform", 'translate('+[axisPadding, axisPadding]+')')
    .call(yAxis);
xAxisG.append('text')
    .attr('class', 'x label')
    .attr('transform', 'translate(300,25)')
    .text('Class Label');

// Axis labels
chartG.append('text')
    .attr('class', 'axis_label')
    .attr('transform', 'translate('+[axisPadding/2 + chartWidth/2, chartHeight+axisPadding + 50]+')')
    .text('Image label');
chartG.append('text')
    .attr('class', 'axis_label')
    .attr('transform', 'rotate(270)translate('+[-chartHeight/2 - axisPadding/2 - 100, 50]+')')
    .text("Probability of prediction");

d3.json("../Datasets/stepWiseProb_NT.json").then(prob_data => {

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
        .style("float", "left")
        // .style("margin-right", "150px")
        .style("position", "relative")
        .style("top", "-15px")
        .html("PGD Step: "+ epoch);

    // Initialize bar chart
    data_G2 = prob_data[epoch][img];

    var bars = chartG.selectAll(".rect")
        .data(data_G2);

    var barsEnter = bars.enter()
        .append("g")
        .attr("class", "bar");

    barsEnter
        .append("rect")
        .attr("width", barWidth)
        .attr("height", (d,i) => hScale(0) - hScale(d))
        .attr("x", (d,i) => xScale(convertLabel(i)) + axisPadding + 5)
        .attr("y", (d,i) => hScale(d) + axisPadding)
        .style("fill", (d,i) => cScale(i));

    // Initialize images
    var imgOrig = imgG
        .append("svg:image")
        .attr("xlink:href", function() {return "../Datasets/images/img00.png"})
        .attr("width", 100)
        .attr("height", 100)
        .attr("transform", "translate(" + imageOffsetX + ",0)");

    var imgCurr = imgG
    .append("svg:image")
        .attr("xlink:href", function() {return "../Datasets/images/img00.png"})
        .attr("x", 150)
        .attr("width", 100)
        .attr("height", 100)
        .attr("transform", "translate(" + imageOffsetX + ",0)");

    imgG.append("text")
        .text("Original Image")
        .attr("transform", "translate(" + imageOffsetX + ",125)");

    imgG.append("text")
        .text("Adversarial Image")
        .attr("transform", "translate(" + (imageOffsetX+140) + ",125)");

    // Initialize image select
    for (i = 0; i < 10; i++) {
        filepath = "../Datasets/images/img" + i +"0.png"
        // x = (i%2)*50
        // y = Math.floor(i/2)*50
    
        imgSelectG.append("svg")
            .attr("x", (i%2)*50)
            .attr("y", Math.floor(i/2)*50)
            .attr("width", 50)
            .attr("height", 50)
            .on("click", onImgSelect)
            .append("svg:image")
                .attr("xlink:href", function() {return filepath})
                .attr("width", 50)
                .attr("height", 50);
    }

    // Event callback
    function onSlide() {
        epoch = this.value;
        d3.select("#slider_text")
            .html("PGD Step: "+ epoch);
    
        data_G2 = prob_data[epoch][img];
        var svg = d3.select("#stackedBarChart");
        var barRect = svg.selectAll(".bar rect");

        barRect
            .data(data_G2)
            .attr("height", (d,i) => hScale(0) - hScale(d))
            .attr("y", (d,i) => hScale(d) + axisPadding)
            .style("fill", (d,i) => cScale(i));   
            
        imgCurr.attr("xlink:href", function() {return getImageCurr()})
        // imgRed.attr("xlink:href", function() {return getImageR()})
        // imgGreen.attr("xlink:href", function() {return getImageG()})
        // imgBlue.attr("xlink:href", function() {return getImageB()})
    }

    function onImgSelect() {
        let thisXAttr = d3.select(this).attr("x");
        let thisyAttr = d3.select(this).attr("y");
        epoch = 0;
        d3.select("#epoch_slider").attr("value", 0);
        img = 2*(thisyAttr/50) + (thisXAttr/50);

        data_G2 = prob_data[epoch][img];
        var svg = d3.select("#stackedBarChart");
        var barRect = svg.selectAll(".bar rect");

        barRect
            .data(data_G2)
            .attr("height", (d,i) => hScale(0) - hScale(d))
            .attr("y", (d,i) => hScale(d) + axisPadding)
            .style("fill", (d,i) => cScale(i));   

        imgCurr.attr("xlink:href", function() {return getImageCurr()})
        imgOrig.attr("xlink:href", function() {return getImageOrig()})
    }
})

function convertLabel(i) {
    switch(i) {
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

function getImageOrig() {
    return "../Datasets/images/img" + String(img) + String(0) + ".png"
}

function getImageCurr() {
    return "../Datasets/images/img" + String(img) + String(epoch) + ".png"
}

function getImageR() {
    return "../Datasets/image_diffs/img" + String(img) + String(epoch) + "r.png"
}

function getImageG() {
    return "../Datasets/image_diffs/img" + String(img) + String(epoch) + "g.png"
}

function getImageB() {
    return "../Datasets/image_diffs/img" + String(img) + String(epoch) + "b.png"
}