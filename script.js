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
    var svg = d3.select("#chart")
        .append("svg")
        .attr("class", "polar-chart")
        //adding margins*2 for left&right;
        .attr("width", options.size + options.margin * 2)
        // for top&bottom;
        .attr("height", options.size + options.margin * 2)

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

    var barsHeights = getBarsHeight(appData);
    console.log(barsHeights);

    function getBarsLabels() {
        var labelsArr = [];
        for (var key in appData) {
            labelsArr.push(key)
        }
        return labelsArr;
    }

    var barsLabels = getBarsLabels();
    // console.log(barsLabels);

    //finding the highest bar hight for the scale; 
    var theHighestBar = Math.max(...barsHeights);

    ////// CHARTSCALE &  BARS /////////////////////////

    var chartScale  = d3.scaleLinear()
        .domain([0, theHighestBar])
        .range([0, options.size / 2]);
  
    //https://d3indepth.com/shapes/
    var createBars = d3.arc()
        .innerRadius(innerRadius)
        .startAngle(function (d, i) { return (i * 2 * Math.PI) / numberOfBars; })
        .endAngle(function (d, i) { return ((i + 1) * 2 * Math.PI) / numberOfBars; })
        .outerRadius(function (d, i) { return chartScale(d+(theHighestBar/options.levels)); })
        .padAngle(options.padAngle)
        .padRadius(options.padRadius);

    var bars = svg.selectAll("path")
        .data(barsHeights)
        .enter()
        .append("path")
        .attr("class", "bars")
        .attr("d", createBars)
        //adding margin*1 to x & y attributes to center the bars;
        .attr("transform", "translate(" + (options.size / 2 + options.margin )+ "," + (options.size / 2 + options.margin) + ")")

    //////// COLORS ///////////////////////////////////////////////
    var numColors = Object.keys(options.c).length;
    var barsArr = document.getElementsByClassName("bars")
   
    var counter = 0;
    var num = barsArr.length/numColors
    for(var i = 0; i < barsArr.length; i++) {
        if(i < 2) {
            counter++;
            barsArr[i].setAttribute("fill", options.c.orange);
            // console.log("0", counter);
        } else if (i < 4) {
            counter++;
            barsArr[i].setAttribute("fill", options.c.green);    
            // console.log("1", counter);        
        } else if(i<8) {
            counter++;
            barsArr[i].setAttribute("fill", options.c.blue);  
            // console.log("2", counter);          
        } else {
            counter++;
            barsArr[i].setAttribute("fill", options.c.purple);
            // console.log("3", counter);
        }        
    }
   
    ////// CIRCLES ///////////////////////
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
        .attr("fill", "none")
        .attr("opacity", options.circlesOpacity)


    ///////// LABELS //////////////////////////////////////////////

    // function that will create another arc to append text elements to it;
    var labelsArc = d3.arc()
        .innerRadius(innerRadius * (options.levels+2))
        .outerRadius(innerRadius * (options.levels+1))
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
        .attr("fill", "none")
        .attr("d", labelsArc);

    var labels = svg.selectAll(".text-labels")
        .data(barsLabels)
        .enter().append("text")
        .attr("class", "text-labels")  
        //needs to be centered: endAngle - startAngle/2 * half of the string in pixels          
        .attr("x", 80)
        .attr("dy", 15)
        .append("textPath") 
        .attr("font-size", options.labelFontSize)
        //! 
        .attr("xlink:href", function (d, i) { return "#label-arc-" + i; })
        .attr("fill", options.strokeColor)
        .attr("text-anchor", "beginning")
        .text(function (d, i) { return d; })

        //defining an array of all labels
        var labelsArray = labels._groups[0];
      
        labelsArray.forEach(function(elem) {
            // console.log((elem.getComputedTextLength()));
            elem.setAttribute("x", (Math.PI*2/barsLabels.length/2 + elem.getComputedTextLength()/2))
    
        })
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

    var yAxisReverse = d3.axisLeft()
    //using chartScale defined before for bars;
        .scale(chartScale)
    //https://github.com/d3/d3-axis
    // .ticks()

    var yAxisGroup = svg.append("g")
        .attr("class", "y-axis-container")
        .attr("transform", "translate(" + (options.size / 2 + options.margin )+ "," + (options.size / 2 + options.margin) + ")")
        //substracting innerRadius from y attribute to move axis upwards;
        .attr("transform", "translate(" + (options.size / 2 + options.margin ) + "," + (options.size / 2 + options.margin - innerRadius) + ")")
        .call(yAxis);

    var yAxisGroupReverse = svg.append("g")
    .attr("class", "y-axis-container")   
    .attr("transform", "translate(" + (options.size / 2 + options.margin )+ "," + (options.size / 2 + options.margin) + ")")
     //adding innerRadius from y attribute to move axis downwards;
    .attr("transform", "translate(" + (options.size / 2 + options.margin ) + "," + (options.size / 2 + options.margin + innerRadius) + ")")
    .call(yAxisReverse);

    //STYLING AXIS 
    var axisNodes = document.getElementsByClassName("domain")
    for(var i = 0; i < axisNodes.length; i++) {
        axisNodes[i].setAttribute("stroke", "none")
    }

    //STYLING AXIS TICKS
    var axisTicks = document.querySelectorAll("line")
    for(var i =0; i < axisTicks.length; i++) {
        axisTicks[i].setAttribute("display", "none")
    }

    // var whatever = document.querySelectorAll(".labels-container");
    // console.log(whatever)

    var ticksContainers = document.querySelectorAll(".tick");
    console.log(ticksContainers[0].childNodes[1])

    for(var i = 0; i < ticksContainers.length; i++) {
        ticksContainers[i].childNodes[1].setAttribute("fill", options.strokeColor);
        ticksContainers[i].childNodes[1].setAttribute("font-size", options.legendFontSize);
        ticksContainers[i].childNodes[1].setAttribute("fill-opacity", options.legendOpacity);
        ticksContainers[i].childNodes[1].setAttribute("text-anchor", "middle");
        ticksContainers[i].childNodes[1].setAttribute("x", "-2");
    }
 
}

//defining margin of svg;
var margin = 80;
// storing all the options of the chart in an object;
// for easy access, if need to change;
// will be passed to function that draws the chart together with data;


function getBarsHeight(data) {
    var heightsArr = [];
    for (var key in data) {
        // console.log("VaLUES:", appData[key])
        // I am adding here innerRadius, 
        //as the bars start from it and not 0 (middle of the svg);
        heightsArr.push(data[key])
    }
    return heightsArr;
}

var barsHeights = getBarsHeight(app._data.chartData);
var theHighestBar = Math.max(...barsHeights);

var polarChartOptions = {
    margin: margin,
    // size will work for both width and height;
    //adding margin to the size;
    size: 400 + margin,
    strokeColor: "rgb(142, 154, 175)",
    //how many x-circles there will be
    //the number of levels will adjust to the height highest Bar
    levels: Math.round(theHighestBar/10),
    dashesWidth: 2,
    dashesLength: 2,
    padAngle: 0.2, //specifies padding in radians (the angle of the padding) of the bars;
    padRadius: 20, //defines the linear distance between the bars; 
    legendOpacity: 0.8,
    circlesOpacity: 0.5,
    legendFontSize: 10,
    labelFontSize: 10,
    c: {
        orange: "rgb(255, 96, 17)",
        green: "rgb(151, 216, 157)",
        blue: "rgb(51, 140, 204)", 
        darkblue: "rgb(41, 47, 104)",
        purple: "rgb(162, 136, 227)"
    }
}

drawPolarChart(polarChartOptions, app._data.chartData);

// MOUSE EFFECTS
var barsArray = document.getElementsByClassName("bars");
console.log(barsArray)
labelsArray = document.querySelectorAll("textpath");
console.log(labelsArray)

function animateBars() {
    for(var i = 0; i < barsArray.length; i++) {
        for(var j =0;  j < labelsArray.length; j++) {
            barsArray[i].addEventListener("mouseover", mouseOver);
            barsArray[i].addEventListener("mouseout", mouseOut);
            if(i===j)  {
            labelsArray[j].addEventListener("mouseover", mouseOver)
            labelsArray[j].addEventListener("mouseout", mouseOut);
            }
        }
        
    }
}
animateBars();

function mouseOver() {
    this.setAttribute("class", "activate now") 
    fn1()  
}

function mouseOut() {
    this.setAttribute("class", "deactivate now")
}


function fn1() {
    console.log("fn fired")
    for(var i=0; i < barsArray.length; i++) {
        if(barsArray[i].classList.contains("activate")) {
            console.log("Fired!!!!")
            labelsArray[i].classList.add("active-title")
            break;
        }
    } 
}


