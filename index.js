var Chart = require('chart.js')
var streamdata = require('streamdata.io-events')
var bytesCounter = require('bytes-counter')

var ctx = document.getElementById("chart").getContext("2d");

//linear-gradient(to right, rgba(253,0,17,1) 0%, rgba(234,30,179,1) 100%);
var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
gradientStroke.addColorStop(0, 'rgba(234,30,179,1)')
gradientStroke.addColorStop(1, 'rgba(253,0,17,1)')

var chart = new Chart(ctx, {
  // The type of chart we want to create
  type: "line",
  // The data for our dataset
  data: {
    datasets: [
      {
        label: "With Streamdata.io",
        backgroundColor: "transparent",
        borderColor: gradientStroke,
        data: [0, 1]
      },
      {
        label: "without Streamdata.io",
        fillColor: "rgba(0,0,0,0)",
        strokeColor: "#526773",
        borderColor: "#526773",
        data: [0, 1]
      },
    ]
  },

  // Configuration options go here
  options: {
    responsive: true,
    maintainAspectRatio: true,
    scaleFontColor: "#fff",
    layout: {
       padding: {
          left: 15,
          right: 15,
          top: 15,
          bottom: 15
      }
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Data Consumption',
          fontColor: '#fff',
          fontSize: 16,
        },
        gridLines: {
           color: "rgba(255, 255, 255, 0.3)",
        },
        ticks: {
          fontColor: "#fff",
          callback: function(value, index, values) {
            return parseFloat(value, 10) + 'kb'
          }
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Time Consumption',
          fontColor: '#fff',
          fontSize: 16
        },
        gridLines: {
           color: "#fff",
        },
        ticks: {
          fontColor: "#fff"
        }
      }]
    },
    legend: {
      display: false,
      position: 'bottom',
      labels: {
        fontColor: '#fff',
        defaultFontColor: '#fff',
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    legendCallback: function (chart) {
      return `<div class="chart__legend">
                <div class="chart__legendKey">
                  <svg class="chart__legendIcon">
                     <circle cx='10' cy='10' r='5' fill='#FD0010'></circle>
                  </svg>
                  <p class="chart__legendCopy">With Streamdata.io</p>
                </div>
                <div class="chart__legendKey">
                  <svg class="chart__legendIcon">
                     <circle cx='10' cy='10' r='5' fill='#526773'></circle>
                  </svg>
                  <p class="chart__legendCopy">Without Streamdata.io</p>
                </div>
              </div>`
    }
  }
})

var legend = chart.generateLegend()
document.querySelector('.chart__legendContainer').innerHTML = legend

var first = true
var URL = 'http://stockmarket.streamdata.io/v2/prices'
var APPKEY = 'ODRlZDNmYmUtMDAxZC00NWJmLTgwMzQtNTkzMWJiYjFhYjVj'
var SSE = streamdata(URL, APPKEY)

SSE
  .on('data', function (data) {
    if (!first) return
    var bytes = bytesCounter.count(JSON.stringify(data))
    var bytesAdded = chart.data.datasets[0].data.reduce(function (acc, total) {
      return acc + total
    }, 0)
    var dataset = chart.data.datasets[0].data
    dataset.push(parseInt(bytesAdded + (bytes / 1000), 10))
    chart.update()
    first = false
  })
  .on('patch', function (patch) {
    chart.update()
    var bytes = bytesCounter.count(JSON.stringify(patch))
    var bytesAdded = chart.data.datasets[0].data.reduce(function (acc, total) {
      return acc + total
    }, 0)
    var dataset = chart.data.datasets[0].data
    dataset[1] = (parseInt(bytesAdded + (bytes / 1000), 10))
    
  })

setInterval(function () {
  fetch('https://dog.ceo/api/breeds/image/random').then(function (res) {
    return res.json()
  }).then(function (json) {
    var bytes = bytesCounter.count(JSON.stringify(json))
    var bytesAdded = chart.data.datasets[1].data.reduce(function (acc, total) {
      return acc + total
    }, 0)
    var dataset = chart.data.datasets[1].data
    dataset[1] = (parseInt(bytesAdded + (bytes / 1000), 10))
    
    chart.update()
    // console.log('fetch', dataset)
  })
}, 1000)

// var i = 1
// setInterval(function () {
//   chart.data.datasets[0].data[1] = i *= 1.3
//   chart.update()
// }, 500)
