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

// console.log(app._data.chartData)

function drawPolarChart(options, data) {
    console.log(options, data);
    //creating an svg node
    var svg = d3.select("#app")
        .append("svg")
        .attr("class", "polar-chart")
        .attr("width", options.width)
        .attr("height", options.height)
        .attr("stroke", options.fillColor)   
        .attr("fill", options.fillColor);  
        
    var g = d3.select(".polar-chart")
        .append("g");   
}

// storing all the options of the chart in an object;
// for easy access, if need to change;
// will pass it later to function that draws the chart together with data;
//also changing the data structure wont require additional work;
var polarChartOptions = {
    width: "800px",
    height: "800px",
    fillColor: "black"
}

drawPolarChart(polarChartOptions, app._data.chartData);