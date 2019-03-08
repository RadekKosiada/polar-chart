var app = new Vue({
    el: '#app',
    data: {
        numberOfInputs: 1,
        chartData: {
            'Industrial 80': 80,
            // console.log(app["Core AI"])
            'Core AI': 25,
            'VCs': 100,
            'CVCs': 58,
            'Acc/includ': 45,
            'Meetups': 12,
            'Corp. RCs': 62,
            'Non-corp. RCs': 80,
            'Top unis': 60,
            'Students': 89,
            'AI publications': 41
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
        .attr("width", options.size)
        .attr("height", options.size)

    //drawing circles on svg
    svg.selectAll(".levels")
        //appending data to circles
        .data(d3.range(1, options.levels + 1))
        .enter()
        .append("circle")
        .attr("class", "x-circle")
        .attr("r", function (d, i) {
            // console.log(i)
            return (options.size / 2) / options.levels * d;
        })
        .attr("cx", options.size / 2)
        .attr("cy", options.size / 2)
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
        .attr("transform", "translate(" + options.size / 2 + "," + options.size / 2 + ")")

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
        .attr("transform", "translate(" + options.size / 2 + "," + options.size / 2 + ")")
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


    ///////////////// LABELS 2.approach ///////////////

    // var labelGroup = svg.append("g")
    //     .attr("class", "label-group")
    //     .attr("transform", "translate(" + options.size/2 + "," + options.size/2 + ")")
        
    // var labels = labelGroup.selectAll(".label-rotate")
    //     .data(barsLabels)
    //     .enter().append("g")
    //     .attr("class", "label-rotate")
    //     // .attr("transform", "translate(" + options.size/2 + "," + options.size/2 + ")")
    //     .attr("transform", function(d, i) { return "rotate(" + (i * 360 / barsLabels.length) + ")"; });

    // labelGroup.selectAll(".label-rotate").append("text")
    //     // 20 is 
    //     .attr("x", 40)
    //     //0.25 is an arbitrary value
    //     .attr("y", -((options.size/2)-options.size/options.levels*0.25))
    //     // .attr("text-anchor", "beginning")
    //     .text(function(d) {return d;});


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
        .attr("transform", "translate(" + options.size / 2 + "," + ((options.size / 2) - innerRadius) + ")")
        .call(yAxis);


}


// storing all the options of the chart in an object;
// for easy access, if need to change;
// will pass it later to function that draws the chart together with data;
//also changing the data structure won't require additional work;

var polarChartOptions = {
    // size will work for both width and height;
    size: 600,
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