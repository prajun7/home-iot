var axios = require("axios").default;
const { DateTime } = require('luxon');

const tz = DateTime.now().zoneName;
const start = DateTime.now().toISODate();
const end = DateTime.now().toISODate();

var options = {
  method: 'GET',
  url: 'https://meteostat.p.rapidapi.com/stations/hourly',
  params: {station: '10637', start: start, end: end, tz: tz},
  headers: {
    'x-rapidapi-host': 'meteostat.p.rapidapi.com',
    'x-rapidapi-key': 'ecedde975bmshd68d593407c0634p1e90c2jsn8f1f0f5c5e2d'
  }
};

function CtoF(c) {
    let f = (c * (9/5)) + 32;
    return f;
}

function getExteriorTemp(){
axios.request(options).then(function (response) {
  var date = new Date();
  var current_hour = date.getHours();
  //current_hour will give the current hours starting from (1 to 24)

    // console.log(current_hour);  
    var tem = response.data.data[current_hour].temp; 
    //console.log(`Current temperature in Celcius: ${tem}`);  
    //console.log(`Current temperature in Farenheit: ${CtoF(tem)}`);  
    console.log( CtoF(tem));
     // If we want to get the temperature of the midnight the index should be 0
     // Change the index to 1,2,3...23 to get the temperature at different hours
     // We need to increase the index from 0 to 23 to get the data at the different hours.

}).catch(function (error) {
	console.error(error);
});
}
console.log(tz);
console.log(start);
console.log(end);
getExteriorTemp();

