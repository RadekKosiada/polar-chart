var app = new Vue({
    el: '#app',
    data: {
        numberOfInputs: 1,
        chartData: {
            'Industrial 80': 80,
            // console.log(app["Core AI"])
            'Core AI 25': 25,
            'VCs 100': 100,
            'CVCs 58': 58,
            'Acc/includ 45': 45,
            'Meetups 12': 12,
            'Corp. RCs 62': 62,
            'Non-corp. RCs 80': 80,
            'Top unis 60': 60,
            'Students 89': 89,
            'AI publications 41': 41
        }
    }
})

console.log(app._data.chartData);
console.log(Object.keys(app._data.chartData))
console.log(Object.keys(app._data.chartData).length)

function drawPolarChart(options, appData) {
    console.log(options, appData);
    //creating an svg node
    var svg = d3.select("#app")
        .append("svg")
        .attr("class", "polar-chart")
        //adding margins*2 for left&right;
        .attr("width", options.size + options.margin * 2)
        // for top&bottom;
        .attr("height", options.size + options.margin * 2)

    //drawing circles on svg
    svg.selectAll(".levels")
        //appending data to circles
        .data(d3.range(0, options.levels + 2))
        .enter()
        .append("circle")
        .attr("class", "x-circle")
        .attr("r", function (d, i) {
            return (options.size / 2) / options.levels * d;
        })
        //adding margin*1 to center the circles;
        .attr("cx", options.size / 2 + options.margin)
        .attr("cy", options.size / 2 + options.margin)
        .attr("stroke", options.strokeColor)
        .attr("stroke-dasharray", options.dashesLength)
        .attr("stroke-width", options.dashesWidth)
        .attr("fill", "none");

    var numberOfBars = Object.keys(appData).length;
    // array with names of all dimensions
    var nameOfBars = Object.keys(appData);
    var innerRadius = options.size / options.levels / 2;
    var outerRadius = 50;
    console.log(outerRadius);
    console.log(appData.CVCs)

    function returnsBarsIndex() {
        nameOfBars.forEach(function (elem, i) {
            // console.log(i)
            return i;
        });
    }
    returnsBarsIndex();

    function getBarsHeight() {
        var heightsArr = [];
        for (var key in appData) {
            // console.log("VaLUES:", appData[key])
            // I am adding here innerRadius, 
            //as the bars start from it and not 0 (middle of the svg);
            heightsArr.push(appData[key])
        }
        return heightsArr;
    }

    var barsHeights = getBarsHeight();
    console.log(barsHeights);

    function getBarsLabels() {
        var labelsArr = [];
        console.log("KEYS: ", key)
        for (var key in appData) {
            labelsArr.push(key)
        }
        return labelsArr;
    }

    var barsLabels = getBarsLabels();
    // console.log(barsLabels);

    //finding the highest bar hight for the scale; 
    var theHighestBar = Math.max(...barsHeights);
    console.log(theHighestBar)

    var chartScale  = d3.scaleRadial()
        .domain([0, theHighestBar])
        .range([0, options.size / 2]);
  

    //https://d3indepth.com/shapes/
    var createBars = d3.arc()
        .innerRadius(innerRadius)
        .startAngle(function (d, i) { return (i * 2 * Math.PI) / numberOfBars; })
        .endAngle(function (d, i) { return ((i + 1) * 2 * Math.PI) / numberOfBars; })
        .outerRadius(function (d, i) { return chartScale(d); })
        .padAngle(options.padAngle)
        .padRadius(options.padRadius);

    var bars = svg.selectAll("path")
        .data(barsHeights)
        .enter()
        .append("path")
        .attr("fill", "grey")
        .attr("fill-opacity", "0.85")
        .attr("d", createBars)
        //adding margin*1 to x & y attributes to center the bars;
        .attr("transform", "translate(" + (options.size / 2 + options.margin )+ "," + (options.size / 2 + options.margin) + ")")

    // function that will create another arc to append text elements to it;
    var labelsArc = d3.arc()
        .innerRadius(innerRadius * options.levels)
        .outerRadius(innerRadius * options.levels)
        .startAngle(function (d, i) { return (i * 2 * Math.PI) / numberOfBars; })
        .endAngle(function (d, i) { return ((i + 1) * 2 * Math.PI) / numberOfBars; })

    // https://www.visualcinnamon.com/2015/09/placing-text-on-arcs.html
    //creating another arc => anchor for labels;
    var labelsContainers = svg.selectAll(".labels-arc")
        .data(barsHeights)
        .enter()
        .append("path")
        .attr("class", "labels-container")
        .attr("id", function (d, i) { return "label-arc-" + i; })
        // .attr("id", "labels-arc-id")
        .attr("transform", "translate(" + (options.size / 2 + options.margin )+ "," + (options.size / 2 + options.margin) + ")")
        .attr("fill", "black")
        .attr("fill-opacity", 0.4)
        .attr("d", labelsArc);

    var labels = svg.selectAll(".text-labels")
        .data(barsLabels)
        .enter().append("text")
        .attr("class", "text-labels")  
        //needs to be centered: endAngle - startAngle/2 * half of the string in pixels          
        .attr("x", 40)
        .attr("dy", 25)
        .append("textPath") 
        //! 
        .attr("xlink:href", function (d, i) { return "#label-arc-" + i; })
        .attr("fill", "black")
        .attr("text-anchor", "beginning")
        .text(function (d, i) { return d; })

    /// AXIS /////////////////////////////////

    // https://www.dashingd3js.com/d3js-axes
    var axisScale = d3.scaleLinear()
        //heights of the bars
        .domain([0, theHighestBar])
        //size of svg
        .range([0, -options.size / 2]);

    var yAxis = d3.axisLeft()
        .scale(axisScale)
    //https://github.com/d3/d3-axis
    // .ticks()

    console.log(innerRadius)
    var yAxisGroup = svg.append("g")
        .attr("class", "y-axis")
        //substracting innerRadius from y attribute to move axis upwards;
        .attr("transform", "translate(" + (options.size / 2 + options.margin )+ "," + (options.size / 2 + options.margin) + ")")
        .attr("transform", "translate(" + (options.size / 2 + options.margin ) + "," + (options.size / 2 + options.margin - innerRadius) + ")")
        .call(yAxis);
}

//defining margin of svg;
var margin = 600 * 10/100;
// storing all the options of the chart in an object;
// for easy access, if need to change;
// will be passed to function that draws the chart together with data;

var polarChartOptions = {
    margin: margin,
    // size will work for both width and height;
    //adding margin to the size;
    size: 600 + margin,
    strokeColor: "grey",
    //how many x-circles there will be
    //the number should be fixed, no matter how high the bars
    levels: 10,
    dashesWidth: 2,
    dashesLength: 2,
    padAngle: 0.2, //specifies padding in radians (the angle of the padding) of the bars;
    padRadius: 20, //defines the linear distance between the bars; 
}

drawPolarChart(polarChartOptions, app._data.chartData);