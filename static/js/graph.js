
// COSTS BAR GRAPH
var options = {
  series: [{
  //data: [21, 22, 10] //import data array here
}],
  chart: {
  height: 322,
  type: 'bar',
  events: {
    click: function(chart, w, e) {
      // console.log(chart, w, e)
    }
  }
},
colors: ['#081BFF','#00FAE7' ,'#FF083C'],
plotOptions: {
  bar: {
    columnWidth: '45%',
    columnHeight: '10%',
    distributed: true,
  }
},
dataLabels: {
  enabled: false
},
legend: {
  show: false
},
xaxis: {
  categories: [
    ['Electricity'],
    ['Water'],
    ['HVAC'],

  ],
  labels: {
    style: {
      colors: ['#081BFF','#00FAE7' ,'#FF083C'],
      fontSize: '12px'
    }
  }
}
};

var bars = new ApexCharts(document.querySelector("#bars"), options);
bars.render();


