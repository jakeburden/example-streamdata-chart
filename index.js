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
        data: [1, 2]
      },
      {
        label: "without Streamdata.io",
        fillColor: "rgba(0,0,0,0)",
        strokeColor: "#526773",
        borderColor: "#526773",
        data: [1, 2]
      },
    ]
  },

  // Configuration options go here
  options: {
    responsive: true,
    maintainAspectRatio: true,
    layout: {
      
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Data Consumption',
          fontColor: '#fff;'
        },
        gridLines: {
           color: "#fff",
        },
        ticks: {
          color: "#fff"
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Time Consumption',
          fontColor: '#fff;'
        },
        gridLines: {
           color: "#fff",
        },
        ticks: {
          color: "#fff"
        }
      }]
    },
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        fontColor: '#fff',
        defaultFontColor: '#fff',
        usePointStyle: true,
        pointStyle: 'circle'
      }
    }
  }
})

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
    dataset.push(bytesAdded + (bytes / 1000))
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
    dataset[1] = (bytesAdded + (bytes / 1000))
    
    console.log('patch', dataset)
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
    dataset[1] = (bytesAdded + (bytes / 1000))
    
    chart.update()
    // console.log('fetch', dataset)
  })
}, 1000)

// var i = 1
// setInterval(function () {
//   chart.data.datasets[0].data[1] = i *= 1.3
//   chart.update()
// }, 500)
