var img = 0;

// Create SVG containers
var imgSelectG = d3.select("#G2").append("svg")
    .attr("id", "imgSelect")
    .attr("width", "200px")
    .attr("height", "600px");

var chartG = d3.select("#G2").append("svg")
    .attr("id", "groupedBarChart")
    .attr("width", "800px")
    .attr("height", "600px");

var ribbonG = d3.select("#G2").append("svg")
    .attr("id", "ribbonChart")
    .attr("width", "800px")
    .attr("height", "600px");

// Global constants
var margin = 200;
var chartWidth = parseInt(chartG.attr("width")) - margin;
var chartHeight = parseInt(chartG.attr("height")) - margin;
var axisPadding = margin/2;
var barWidth = 20;
var selectOffsetX = 25;
var selectOffsetY = 150;
var keys = ["airplane", "automobile", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"];

// Scales
var hScale = d3.scaleLinear()
    .domain([0,1])
    .range([chartHeight, 1]);
var xScale0 = d3.scaleLinear()
    .domain([-0.5,10.5])
    .range([0, chartWidth]);
var xScale1 = d3.scaleLinear()
    .domain([0,1])
    .range([0,barWidth]);
var cScale = d3.scaleOrdinal()
    .domain(["NT", "AT"])
    .range(["blue", "red"])

var xScaleRibbon = d3.scaleLinear()
    .domain([-0.5,10.5])
    .range([0, chartWidth]);
var yScaleRibbon = d3.scaleLinear()
    .domain([0, 1])
    .range([chartHeight, 0]);
var cScaleRibbon = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeTableau10)

// Legends
var cLegend = d3.legendColor()
    .scale(cScale);
chartG.append("g")
    .attr("transform", 'translate('+[chartWidth + axisPadding, 100]+')')
    .call(cLegend)

var cLegendRibbon = d3.legendColor()
    .scale(cScaleRibbon);
ribbonG.append("g")
    .attr("transform", 'translate('+[chartWidth + axisPadding, 100]+')')
    .call(cLegendRibbon)


// Axis Rendering
var xAxis = d3.axisBottom(xScale0);
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

var xAxis = d3.axisBottom(xScaleRibbon);
var yAxis = d3.axisLeft(yScaleRibbon);

ribbonG.append('g')
    .attr('class', 'x_axis')
    .attr('transform', 'translate('+[axisPadding, chartHeight+axisPadding]+')')
    .call(xAxis);
ribbonG.append('g')
    .attr('class', 'y_axis')
    .attr("transform", 'translate('+[axisPadding, axisPadding]+')')
    .call(yAxis);

d3.json("../Datasets/stepWiseProb_NT.json").then(nt_data => {
    d3.json("../Datasets/stepWiseProb_AT.json").then(at_data => {

        // Initialize bar chart
        data = getData();

        var bars = chartG.selectAll(".rect")
            .data(data);

        var barsEnter = bars.enter()
            .append("g")
            .attr("class", "bar");

        barsEnter
            .append("rect")
            .attr("width", barWidth)
            .attr("height", (d,i) => hScale(0) - hScale(d))
            .attr("x", (d,i) => xScale0(Math.floor(i/2)) + xScale1(i%2) + axisPadding - barWidth)
            .attr("y", (d,i) => hScale(d) + axisPadding)
            .style("fill", (d,i) => cScale(convertToColor(i)));

        // Initialize image select
        for (i = 0; i < 10; i++) {
            filepath = "../Datasets/images/img" + i +"0.png"
            x = (i%2)*50
            y = Math.floor(i/2)*50
        
            imgSelectG.append("svg")
                .attr("x", x + selectOffsetX)
                .attr("y", y + selectOffsetY)
                .attr("width", 50)
                .attr("height", 50)
                .on("click", onImgSelect)
                .append("svg:image")
                    .attr("xlink:href", function() {return filepath})
                    .attr("width", 50)
                    .attr("height", 50);
        }

        // Initialize ribbon chart
        ribbonG
            .selectAll("mypoints")
            .data(getStackedData())
            .enter()
            .append("path")
            .style("fill", function(d) { return cScaleRibbon(d.key); })
            .attr("d", d3.area()
                .x(function(d, i) { return xScaleRibbon(d.data.step) + axisPadding; })
                .y0(function(d) { return yScaleRibbon(d[0]) + axisPadding; })
                .y1(function(d) { return yScaleRibbon(d[1]) + axisPadding; })
            );

        for (j = 1; j < 10; j++) {
            points = [[xScaleRibbon(j) + axisPadding, yScaleRibbon(0) + axisPadding], 
            [xScaleRibbon(j) + axisPadding, yScaleRibbon(1) + axisPadding]]
            ribbonG.append("path")
                .attr("d", d3.line()(points))
                .style("stroke", "black")
        }
        
        function onImgSelect() {
            x = d3.select(this).attr("x") - selectOffsetX;
            y = d3.select(this).attr("y") - selectOffsetY;
            img = 2*(y/50) + (x/50);

            data = getData();
            var svg = d3.select("#groupedBarChart");
            var barRect = svg.selectAll(".bar rect");

            barRect
                .data(data)
                .attr("height", (d,i) => hScale(0) - hScale(d))
                .attr("y", (d,i) => hScale(d) + axisPadding)
                .style("fill", (d,i) => cScale(i % 2));

            ribbonG
                .selectAll("mypoints")
                .data(getStackedData())
                .enter()
                .append("path")
                .style("fill", function(d) { return cScaleRibbon(d.key); })
                .attr("d", d3.area()
                    .x(function(d, i) { return xScaleRibbon(d.data.step) + axisPadding; })
                    .y0(function(d) { return yScaleRibbon(d[0]) + axisPadding; })
                    .y1(function(d) { return yScaleRibbon(d[1]) + axisPadding; })
                );

            for (j = 1; j < 10; j++) {
                points = [[xScaleRibbon(j) + axisPadding, yScaleRibbon(0) + axisPadding], 
                [xScaleRibbon(j) + axisPadding, yScaleRibbon(1) + axisPadding]]
                ribbonG.append("path")
                    .attr("d", d3.line()(points))
                    .style("stroke", "black")
            }
        }

        // Return data from left-to-right order, i.e. NT step 0, AT step 0, NT step 1, ...
        function getData() {
            arr = Array();
            for (i = 0; i <= 10; i++) {
                arr.push(nt_data[String(i)][img][img])
                arr.push(at_data[String(i)][img][img])
            }
            return arr;
        }

        // Uses d3.stack to get data in format for stacked area chart
        function getStackedData() {
            ribbonData = Array();
            for (i = 0; i <= 10; i++) {
                dict = {step: i};
                for (j = 0; j < 10; j++) {
                    dict[convertLabel(j)] = at_data[String(i)][img][j];
                }
                ribbonData.push(dict);
            }
    
            stackedData = d3.stack()
                .keys(["airplane", "automobile", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"])
                (ribbonData);

            return stackedData;
        }
    })
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

function convertToColor(i) {
    if (i % 2 == 0)
        return "NT";
    else
        return "AT";
}

function getImageOrig() {
    return "../Datasets/images/img" + String(img) + String(0) + ".png"
}

function getImageCurr() {
    return "../Datasets/images/img" + String(img) + String(epoch) + ".png"
}