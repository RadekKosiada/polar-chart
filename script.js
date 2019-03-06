var app = new Vue({
    el: '#app',
    data: {
        numberOfInputs: 1,
        chartData: {
            'Industrial': 80,
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
    console.log(appData.CVCs)

    function returnsBarsIndex() {
        nameOfBars.forEach(function (elem, i) {
            console.log(i)
            return i;
        });
    }
    returnsBarsIndex();

    function getBarsHeight() {
        var heightsArr = [];
        for (var key in appData) {
            console.log("VaLUES:", appData[key])
            // I am adding here innerRadius, 
            //as the bars start from it and not 0 (middle of the svg);
            heightsArr.push(appData[key] + innerRadius)
        }
        return heightsArr;
    }

    var barsHeights = getBarsHeight();


    function getBarsLabels() {
        var labelsArr = [];
        console.log("KEYS: ", key)
        for (var key in appData) {
            labelsArr.push(key)
        }
        return labelsArr;
    }

    var barsLabels = getBarsLabels();
    console.log(barsLabels);

    //https://d3indepth.com/shapes/
    var createBars = d3.arc()
        .innerRadius(innerRadius)
        .startAngle(function (d, i) { console.log("fired"); return (i * 2 * Math.PI) / numberOfBars; })
        .endAngle(function (d, i) { return ((i + 1) * 2 * Math.PI) / numberOfBars; })
        .outerRadius(function (d, i) { return d * 2; })
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

    bars.selectAll("text")
        .data(barsLabels)
        .enter()
        .append("text")
        .text(function (d, i) { return d; })

    var labelsGroup = svg.append("g");

    //function that will create another arc to append text elements to it;
    var labelsArc = d3.arc()
        .innerRadius(innerRadius * options.levels)
        .outerRadius(innerRadius * options.levels - innerRadius)
        .startAngle(0)
        .endAngle(2 * Math.PI);

    //creating another arc => anchor for labels;
    labelsGroup.append("path")
        .attr("class", "arc")
        .attr("transform", "translate(" + options.size / 2 + "," + options.size / 2 + ")")
        .attr("fill", "grey")
        .attr("fill-opacity", 0.4)
        .attr("d", labelsArc);

    labelsGroup.selectAll("text")
        .data(barsLabels)
        .enter()
        .append("text")
        .attr("class", "labels")
        .text(function (d, i) { return d; })

    var numbersGroup = svg.append("g")
        .attr("stroke", "red")
        .attr("fill", "red")
        .attr("transform", "translate(100, 100)")
        // .append("rect")
        // .attr("width", 100)
        // .attr("height", 100)
    
    numbersGroup.selectAll("text")
        .data(options.levels)
        .enter()
        .attr("class", "numbers")
        .append("text")
        .text(function (d, i) { return i; })

    var line = svg.append("line")
        .attr("x1", options.size / 2)
        .attr("y1", options.size / 2 - innerRadius)
        .attr("x2", options.size / 2)
        .attr("y2", 0)
        .attr("class", "line")
        .attr("stroke-width", 2)
        .attr("stroke", "black");


}


// storing all the options of the chart in an object;
// for easy access, if need to change;
// will pass it later to function that draws the chart together with data;
//also changing the data structure won't require additional work;

var polarChartOptions = {
    // size will work for both width and height;
    size: 800,
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