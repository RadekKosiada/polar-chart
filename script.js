var app = new Vue({
    el: '#app',
    data: {
        numberOfInputs: 11,
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
            'AI publications': 41,   
        },
        firstInput: 80,
        secondInput: 25,        
        thirdInput: 100,       
        fourthInput: 58,        
        fifthInput: 45,        
        sixthInput: 12,     
        seventhInput: 62,  
        eighthInput: 80,        
        ninthInput: 60,    
        tenthInput: 89,       
        eleventhInput: 41,
        firstNm: 'Industrial',
        secondNm: 'Core AI',
        thirdNm: 'VCs', 
        fourthNm: 'CVCs',
        fifthNm: 'Acc/includ',
        sixthNm: 'Meetups',
        seventhNm: 'Corp. RCs',
        eighthNm: 'Non-corp. RCs',
        ninthNm: 'Top unis',
        tenthNm: 'Students',
        eleventhNm: 'AI publications'

    }, 
    methods: {
        handleFirstInput(firstValue) {this.firstInput = firstValue; },
        handleSecondInput(secondValue) {this.secondInput = secondValue;},
        handleThirdInput(thirdValue) {this.thirdInput = thirdValue;},
        handleFourthInput(fourthValue) {this.fourthInput = fourthValue;},
        handleFifthInput(fifthValue) { this.fifthInput = fifthValue; },
        handleSixthInput(sixthValue) {this.sixthInput = sixthValue; },
        handleSeventhInput(seventhValue) { this.seventhInput = seventhValue; },
        handleEighthInput(eighthValue) { this.eighthInput = eighthValue; },
        handleNinthInput(ninthValue) { this.ninthInput = ninthValue; },
        handleTenthInput(tenthValue) {this.tenthInput = tenthValue; },
        handleEleventhInput(eleventhValue) {this.eleventhInput = eleventhValue; },

        handleFirstName(name1) {this.firstNm = name1},
        handleSecondName(name2) {this.secondNm = name2},
        handleThirdName(name3) {this.thirdNm = name3},
        handleFourthName(name4) {this.fourthNm = name4},
        handleFifthName(name5) {this.fifthNm = name5},
        handleSeixthName(name6) {this.sixthNm = name6},
        handleSeventhName(name7) { this.seventhNm = name7},
        handleEightName(name8) { this.eighthNm = name8},
        handleNinthName(name9) { this.ninthNm = name9},
        handleTenthName(name10) {this.tenthNm = name10},
        handleEleventhName(name11) {this.eleventhNm = name11},

    }, 

    mounted() {
        console.log("", this.numberOfInputs)
        console.log("chartData", this.chartData);
        console.log(Object.values(this.chartData)[0])

        Object.values(this.chartData)[0] = this.firstInput;
    },

    updated() {
            this.chartData= {
                'Industrial': this.firstInput,
                // console.log(app["Core AI"])
                'Core AI': this.secondInput,
                'VCs': this.thirdInput,
                'CVCs': this.fourthInput,
                'Acc/includ': this.fifthInput,
                'Meetups': this.sixthInput,
                'Corp. RCs': this.seventhInput,
                'Non-corp. RCs': this.eighthInput,
                'Top unis': this.ninthInput,
                'Students': this.tenthInput,
                'AI publications': this.eleventhInput,   
            },
            Object.keys(this.chartData)[10] = this.eleventhNm;

            this.allCharts = document.getElementsByTagName("svg");
            console.log(Object.keys(this.chartData)[0])
            
            if(this.allCharts.length =1) {
                d3.select("svg").remove();
                drawPolarChart(polarChartOptions, this.chartData);
            }    
    }   
})

// console.log(app._data.chartData);
// console.log(Object.keys(app._data.chartData))
// console.log(Object.keys(app._data.chartData).length)

function drawPolarChart(options, appData) {
    // console.log(options, appData);
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
    // console.log(outerRadius);
    // console.log(appData.CVCs)

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

    //finding the highest bar hight for the scale; 
    var theHighestBar = Math.max(...barsHeights);

    ////// CHARTSCALE &  BARS /////////////////////////

    var chartScale  = d3.scaleLinear()
        //passing data => min and max heights of the bars;
        .domain([0, theHighestBar])
        //passing the size of chart => min and max of the chart; boundaries within the data will transformed;
        .range([0, options.size / 2]);
  
    //https://d3indepth.com/shapes/
    //defining function that will create arcs/bars;
    var createBars = d3.arc()
        .innerRadius(innerRadius)
        .startAngle(function (d, i) { return (i * 2 * Math.PI) / numberOfBars; })
        .endAngle(function (d, i) { return ((i + 1) * 2 * Math.PI) / numberOfBars; })
        // .outerRadius(function (d, i) { console.log(d); return chartScale(d+(theHighestBar/options.levels)); })
        .outerRadius(function (d, i) { console.log(d); return chartScale(d); })
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
    var firstLevel = 0;
    var lastLevelIndex = options.levels;
    console.log(lastLevelIndex);
    
    //creating an array consisting of integers for every single circle;
    function creatingAllCirclesArr() {
        var allCirclesArr = [];
        //adding 2 due to indexing from 0;
        for(var i = 0; i < lastLevelIndex + 2; i++) {
            allCirclesArr.push(i);
        }
        return allCirclesArr;
    }
    var allCirclesLevels = creatingAllCirclesArr();

    // https://www.dashingd3js.com/svg-basic-shapes-and-d3js
    svg.selectAll(".x-circle")
        //appending data to circles;
        //creating an array from 0 to the last level +2;
        .data(allCirclesLevels)
        .enter()
        .append("circle")
        .attr("class", "x-circle")
        .attr("id", function(d, i) { return "x-circle-" + i;})
        .attr("r", function (d, i) {
            return (options.size / 2) / options.levels * i;
        })
        //adding margin*1 to center the circles;
        .attr("cx", options.size / 2 + options.margin)
        .attr("cy", options.size / 2 + options.margin)
        .attr("stroke", options.c.grey)
        .attr("stroke-dasharray", options.dashesLength)
        .attr("stroke-width", options.dashesWidth)
        .attr("fill", "none")
        .attr("opacity", options.circlesOpacity)

    //STYLING FIRST CIRCLES (not 0 which has radius = 0 and is not visible anyway, but 1, radius = (options.size / 2) / options.levels)
    var firstCircle = document.getElementById("x-circle-1");    
    firstCircle.setAttribute("stroke", "none")

    //HIDING EVERY SECOND CIRCLES IF THEIR NUMBER IS > 15;
    var circles = document.querySelectorAll(".x-circle");

    if(allCirclesLevels.length > 12) {
        for(var i = 0; i < circles.length; i++) {
            if (i%2) {
                circles[i].setAttribute("display", "none");
                // circles[circles.length-1].setAttribute("display", "block")
            }
        }
    }

    ///////// LABELS //////////////////////////////////////////////

    // function that will create another arc to append text elements to it;
    var labelsArc = d3.arc()
        .innerRadius(innerRadius * (options.levels+1))
        .outerRadius(innerRadius * (options.levels+2))
        .startAngle(function (d, i) { return (i * 2 * Math.PI) / numberOfBars; })
        .endAngle(function (d, i) { return ((i + 1) * 2 * Math.PI) / numberOfBars; })

    // http://bl.ocks.org/nbremer/bf6d15082ea81ce69b55
    //creating another arc => anchor for labels;
    var labelsContainers = svg.selectAll(".labels-arc")
        .data(barsLabels)
        .enter()
        .append("path")
        .attr("class", "labels-container")
        //id will be the anchor fot the texPath later;
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
        //appending "textpath" to "text"
        .append("textPath") 
        .attr("font-size", options.labelFontSize)        
        //! 
        .attr("xlink:href", function (d, i) { return "#label-arc-" + i; })
        .attr("fill", options.c.grey)
        .attr("text-anchor", "beginning")
        .text(function (d, i) { return d; })

        //defining an array of all labels;
        // console.log(document.getElementsByClassName("text-labels"))
        var labelsArray = labels._groups[0];
        //defining an array of all paths = containers of labels;
        var labelsContainersArr = labelsContainers._groups[0];
        // console.log("labels", labelsArray);
        // console.log("ALL", labelsContainersArr);

        //Test for rotating the labelss
        // labelsArray[0].style.transform = "scale(+1, -1)";
        // labelsContainersArr[0].style.transform = "scale(+1, -1)";
      
        labelsArray.forEach(function(elem) {
            // console.log((elem.getComputedTextLength()));
            elem.setAttribute("x", (Math.PI*2/barsLabels.length/2 + elem.getComputedTextLength()/2))
            // elem.style.transform ="rotate(180deg)";
            // console.log(elem)
        })
    /// AXIS /////////////////////////////////

    // https://www.dashingd3js.com/d3js-axes
    var chartScaleReversed = d3.scaleLinear()
        //heights of the bars
        .domain([0, theHighestBar])
        //size of svg
        .range([0, -options.size / 2]);

    var yAxis = d3.axisLeft()
        .scale(chartScaleReversed)

    var yAxisReverse = d3.axisLeft()
    //using chartScale defined before for bars;
        .scale(chartScale)
    // for ticks https://github.com/d3/d3-axis
    // .ticks()

    var yAxisGroup = svg.append("g")
        .attr("class", "y-axis-container")
        //substracting innerRadius from y attribute to move axis upwards;
        .attr("transform", "translate(" + (options.size / 2 + options.margin ) + "," + (options.size / 2 + options.margin - innerRadius) + ")")
        .call(yAxis);

    var yAxisGroupReverse = svg.append("g")
    .attr("class", "y-axis-container")   
     //adding innerRadius from y attribute to move axis downwards;
    .attr("transform", "translate(" + (options.size / 2 + options.margin ) + "," + (options.size / 2 + options.margin + innerRadius) + ")")
    .call(yAxisReverse);

    //STYLING AXIS 
    var axisNodes = document.getElementsByClassName("domain")
    for(var i = 0; i < axisNodes.length; i++) {
        axisNodes[i].setAttribute("display", "none")
    }

    //STYLING AXIS TICKS
    var axisTicks = document.querySelectorAll("line")
    for(var i =0; i < axisTicks.length; i++) {
        axisTicks[i].setAttribute("display", "none")
    }

    // STYLING AXIS NUMBERS
    var ticksContainers = document.querySelectorAll(".tick");
    console.log(ticksContainers[0].childNodes[1])

    for(var i = 0; i < ticksContainers.length; i++) {
        ticksContainers[i].childNodes[1].setAttribute("fill", options.c.black);
        ticksContainers[i].childNodes[1].setAttribute("font-size", options.legendFontSize);
        ticksContainers[i].childNodes[1].setAttribute("fill-opacity", options.legendOpacity);
        ticksContainers[i].childNodes[1].setAttribute("text-anchor", "middle");
        ticksContainers[i].childNodes[1].setAttribute("x", "-2");
        //hiding both 0s on scale;
        ticksContainers[0].childNodes[1].setAttribute("display", "none");
        ticksContainers[0+ticksContainers.length/2].childNodes[1].setAttribute("display", "none");
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
        // heightsArr.push(data[key])
        heightsArr.push(data[key])
    }
    return heightsArr;
}

var barsHeights = getBarsHeight(app._data.chartData);
var theHighestBar = Math.max(...barsHeights);

 polarChartOptions = {
    margin: margin,
    // size will work for both width and height;
    //adding margin to the size;
    size: 400 + margin,
    //how many x-circles there will be
    //the number of levels will adjust to the height highest Bar
    levels: Math.round(theHighestBar/10),
    dashesWidth: 2,
    dashesLength: 2,
    padAngle: 0.2, //specifies padding in radians (the angle of the padding) of the bars;
    padRadius: 20, //defines the linear distance between the bars; 
    legendOpacity: 0.8,
    circlesOpacity: 0.5,
    //to make font more flexible I could write an function counting it and passing to the object;
    //i.e. options.size/40;
    legendFontSize: 10,
    labelFontSize: 10,
    c: {
        black: "black",
        grey: "rgb(142, 154, 175)",
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
// console.log(barsArray)
labelsArray = document.querySelectorAll("textpath");
// console.log(labelsArray)

function animateBars() {
    for(var i = 0; i < barsArray.length; i++) {       
            barsArray[i].addEventListener("mouseover", mouseOverBar.bind(barsArray[i], i ));
            barsArray[i].addEventListener("mouseout", mouseOutBar.bind(barsArray[i], i));         
    }
}
animateBars();

var toolTip = document.querySelector(".tooltip");

function mouseOverBar(index, event) {
    console.log("!!!!!!", arguments[1], )
    //this = barsArray[i]; as event listener is added to the bar;
    this.classList.add("activate")     
    labelsArray[index].classList.add("active-title")
    // barsHeights[index]
    toolTip.innerHTML="Value: " + barsHeights[index];
    toolTip.classList.remove("hide");

    //event.clientY
    //event.clientX




}

function mouseOutBar(index) {
    this.classList.remove("activate")
    labelsArray[index].classList.remove("active-title")
    toolTip.innerHTML= "";
    toolTip.classList.add("hide");
}



