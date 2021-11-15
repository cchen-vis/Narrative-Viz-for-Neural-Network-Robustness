var img_g3 = 0;

// Create SVG containers
var imgSelectG_g3 = d3.select("#G3").append("svg")
    .attr("id", "imgSelect")
    .attr("width", "200px")
    .attr("height", "600px");

var chartG_g3 = d3.select("#G3").append("svg")
    .attr("id", "groupedBarChart")
    .attr("width", "800px")
    .attr("height", "600px");

var ribbonG_g3 = d3.select("#G3").append("svg")
    .attr("id", "ribbonChart")
    .attr("width", "800px")
    .attr("height", "600px");

// Global constants
var margin_g3 = 200;
var chartWidth_g3 = parseInt(chartG_g3.attr("width")) - margin_g3;
var chartHeight_g3 = parseInt(chartG_g3.attr("height")) - margin_g3;
var axisPadding_g3 = margin_g3/2;
var barWidth_g3 = 20;
var selectOffsetX_g3 = 25;
var selectOffsetY_g3 = 150;
var keys = ["airplane", "automobile", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"];

// Scales
var hScale_g3 = d3.scaleLinear()
    .domain([0,100])
    .range([chartHeight_g3, 1]);
var XScale0_g3 = d3.scaleLinear()
    .domain([5,105])
    .range([0, chartWidth_g3]);
var xScaleRibbon_g3 = d3.scaleLinear()
    .domain([-0.5,10.5])
    .range([0, chartWidth_g3]);
var yScaleRibbon_g3 = d3.scaleLinear()
    .domain([0, 1])
    .range([chartHeight_g3, 0]);
var cScaleRibbon_g3 = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeTableau10)

// Legends
var cLegendRibbon_g3 = d3.legendColor()
    .scale(cScaleRibbon_g3);
ribbonG_g3.append("g")
    .attr("transform", 'translate('+[chartWidth_g3 + axisPadding_g3, 100]+')')
    .call(cLegendRibbon_g3)


// Axis Rendering
var xAxis_g3 = d3.axisBottom(XScale0_g3);
var yAxis_g3 = d3.axisLeft(hScale_g3);

var xAxisG_g3 = chartG_g3.append('g')
    .attr('class', 'x_axis')
    .attr('transform', 'translate('+[axisPadding_g3, chartHeight_g3+axisPadding_g3]+')')
    .call(xAxis_g3);
var yAxisG_g3 = chartG_g3.append('g')
    .attr('class', 'y_axis')
    .attr("transform", 'translate('+[axisPadding_g3, axisPadding_g3]+')')
    .call(yAxis_g3);

var xAxis_g3 = d3.axisBottom(xScaleRibbon_g3);
var yAxis_g3 = d3.axisLeft(yScaleRibbon_g3);

ribbonG_g3.append('g')
    .attr('class', 'x_axis')
    .attr('transform', 'translate('+[axisPadding_g3, chartHeight_g3+axisPadding_g3]+')')
    .call(xAxis_g3);
ribbonG_g3.append('g')
    .attr('class', 'y_axis')
    .attr("transform", 'translate('+[axisPadding_g3, axisPadding_g3]+')')
    .call(yAxis_g3);

// Axis labels
chartG_g3.append('text')
    .attr('class', 'axis_label')
    .attr('transform', 'translate('+[axisPadding_g3/2 + chartWidth_g3/2, chartHeight_g3+axisPadding_g3 + 50]+')')
    .text('Epoch of training');
chartG_g3.append('text')
    .attr('class', 'axis_label')
    .attr('transform', 'rotate(270)translate('+[-chartHeight_g3/2 - axisPadding_g3/2 - 250, 50]+')')
    .text("Model's performance on adversarial examples during training");

ribbonG_g3.append('text')
    .attr('class', 'axis_label')
    .attr('transform', 'translate('+[axisPadding_g3/2 + chartWidth_g3/2, chartHeight_g3+axisPadding_g3 + 50]+')')
    .text('Step of PGD');
ribbonG_g3.append('text')
    .attr('class', 'axis_label')
    .attr('transform', 'rotate(270)translate('+[-chartHeight_g3/2 - axisPadding_g3/2 - 225, 50]+')')
    .text("AT model's prediction probabilites for current image");

// d3.json("../Datasets/stepWiseProb_NT.json").then(nt_data => {
d3.csv("../Datasets/clean_and_adversarial_acc_AT_model.csv").then(train_at => {
    d3.json("../Datasets/stepWiseProb_AT.json").then(at_data => {
        // Initialize bar chart
        data_g3 = getData();

        var bars = chartG_g3.selectAll(".rect")
            .data(data_g3);

        var barsEnter = bars.enter()
            .append("g")
            .attr("class", "bar");

        barsEnter
            .append("rect")
            .attr("width", barWidth_g3)
            .attr("height", (d,i) => hScale_g3(0) - hScale_g3(d*100))
            .attr("x", (d,i) => XScale0_g3((i+1)*10) + axisPadding_g3 - barWidth_g3/2)
            .attr("y", (d,i) => hScale_g3(d*100) + axisPadding_g3)
            .style("fill", (d,i) => "red")
            .on("mouseover", (d,i) => {
                chartG_g3.append("text")
                .attr("class", "g3-hoverAddOn")
                .attr("x", xScale(convertLabel(i)) + axisPadding + 30)
                .attr("y", hScale(d) + axisPadding - 5)
                .text((d*100).toFixed(2) + "%")
                .attr("font-family", "Arial, Helvetica, sans-serif")
                .style("text-anchor", "middle");
            })
            .on("mouseout", function(d, i) {
                chartG_g3.selectAll(".g3-hoverAddOn").remove()
            })

        // Initialize image select
        for (i = 0; i < 10; i++) {
            filepath = "../Datasets/images/img" + i +"0.png"
    
            imgSelectG_g3.append("image")
                .attr("x", (i%2)*55 + 5)
                .attr("y", Math.floor(i/2)*55 + 5)
                .on("click", onImgSelect)
                .attr("xlink:href", function() {return filepath})
                .attr("width", 50)
                .attr("height", 50)
                .attr("class", i == 0 ? "G3_image_selected" : "G3_image")
                .style("outline", i ==0 ? "5px solid gold" : "none")
        }

        // Initialize ribbon chart
        ribbonG_g3
            .selectAll("mypoints")
            .data(getStackedData())
            .enter()
            .append("path")
            .style("fill", function(d) { return cScaleRibbon_g3(d.key); })
            .attr("d", d3.area()
                .x(function(d, i) { return xScaleRibbon_g3(d.data.step) + axisPadding_g3; })
                .y0(function(d) { return yScaleRibbon_g3(d[0]) + axisPadding_g3; })
                .y1(function(d) { return yScaleRibbon_g3(d[1]) + axisPadding_g3; })
            );

        for (j = 1; j < 10; j++) {
            points = [[xScaleRibbon_g3(j) + axisPadding_g3, yScaleRibbon_g3(0) + axisPadding_g3], 
            [xScaleRibbon_g3(j) + axisPadding_g3, yScaleRibbon_g3(1) + axisPadding_g3]]
            ribbonG_g3.append("path")
                .attr("d", d3.line()(points))
                .style("stroke", "black")
        }
        
        function onImgSelect() {
            let thisXAttr = d3.select(this).attr("x");
            let thisYAttr = d3.select(this).attr("y");
            img_g3 = 2*((thisYAttr-5)/55)  + ((thisXAttr-5)/55);
            console.log(img_g3);

            data_g3 = getData();
            var svg = d3.select("#groupedBarChart");
            var barRect = svg.selectAll(".bar rect");

            d3.select(".G3_image_selected")
                .style("outline", "none")
                .attr("class", "G3_image");
            d3.select(this)
                .style("outline", "5px solid gold")
                .attr("class", "G3_image_selected");

            barRect
                .data(data_g3)
                .attr("height", (d,i) => hScale_g3(0) - hScale_g3(d*100))
                .attr("y", (d,i) => hScale_g3(d*100) + axisPadding_g3)
                .style("fill", (d,i) => "red");

            ribbonG_g3
                .selectAll("mypoints")
                .data(getStackedData())
                .enter()
                .append("path")
                .style("fill", function(d) { return cScaleRibbon_g3(d.key); })
                .attr("d", d3.area()
                    .x(function(d, i) { return xScaleRibbon_g3(d.data.step) + axisPadding_g3; })
                    .y0(function(d) { return yScaleRibbon_g3(d[0]) + axisPadding_g3; })
                    .y1(function(d) { return yScaleRibbon_g3(d[1]) + axisPadding_g3; })
                );

            for (j = 1; j < 10; j++) {
                points = [[xScaleRibbon_g3(j) + axisPadding_g3, yScaleRibbon_g3(0) + axisPadding_g3], 
                [xScaleRibbon_g3(j) + axisPadding_g3, yScaleRibbon_g3(1) + axisPadding_g3]]
                ribbonG_g3.append("path")
                    .attr("d", d3.line()(points))
                    .style("stroke", "black")
            }
        }

        // Return data from left-to-right order, i.e. NT step 0, AT step 0, NT step 1, ...
        // Get data for every 10th iteration
        function getData() {
            arr = Array();
            for (i = 1; i <= 10; i++) {
                arr.push(train_at[10*i - 1]["adv_acc"] / 100)
            }
            return arr;
        }

        // Uses d3.stack to get data in format for stacked area chart
        function getStackedData() {
            ribbonData = Array();
            for (i = 0; i <= 10; i++) {
                dict = {step: i};
                for (j = 0; j < 10; j++) {
                    dict[convertLabel(j)] = at_data[String(i)][img_g3][j];
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
    return "../Datasets/images/img" + String(img_g3) + String(0) + ".png"
}

function getImageCurr() {
    return "../Datasets/images/img" + String(img_g3) + String(epoch) + ".png"
}