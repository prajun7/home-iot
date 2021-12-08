/* Code by An Nguyen
Data generation for electrical objects in smart house 

Calculating electricals:
Same for everything using electricity (see electric2 table)
electric.usage = (electric.secondson / 3600) * (electric.watt / 1000)
electric.cost = electric.usage * 0.12 
Add up all of them at the end to get the total electric cost
*/

const client = require('../../config/db');  //Exporting the db module from config folder

client.connect();

const fs = require("fs");

var tf = "electric.txt"

fs.writeFile(tf, '', function(err) {
  if (err) {
      return console.error(err);
  }
});

function writy(strng) {
  fs.appendFile(tf, strng+="\n", function(err) {
    if (err) {
      return console.error(err);
    }
  });
}

function rangedom(n1, n2) { //n1 = min random number range; n2 = max random number range 
  return ((Math.floor(Math.random() * (n2 - n1 + 1))) + n1);
}

function weekend(i) { //Checks if the day id is on a weekend
  let day = i % 7; //Data generation starts on a Friday, so every 2nd and 3rd step in the week cycle will be Saturday and Sunday
  if(day === 2 || day === 3) {
    return true;
  } else {
    return false;
  }
}

function washday(i) { //Determines if it's one of the 4 days of the week to run the dishwasher, clothes washer, and clothes dryer 
  let day = i % 7; //Data generation starts on a Friday; 1 -> 6 -> 0 = Friday -> Wednesday -> Thursday
  if(day === 2 || day === 3 || day === 5 || day === 0) { //Cleaning days: Saturday, Sunday, Tuesday, Thursday
    return true;
  } else {
    return false;
  }
}

function cale(min, e, i) {
  if(e.id === 1) {
    min *= 15;
  }
  const hor = min / 60;
  const usa = (hor * (e.watt/1000)); //toFixed(n): Round to the nth decimal place
  const cos = (usa * 0.12);
  
  e.hourson += Number(hor);
  e.usage += Number(usa);
  e.cost += Number(cos);

  e.dailyuse += Number(hor);
  e.dailycost += Number(cos);
  
  var day = days[i%7];
  //writy(`${i}, ${day}, ${e.object}: ${min}, ${cos.toFixed(2)}`); //Uncomment these line to get the output for the usage and cost of each individual item 
}

function updata(ele) {
  for(let n = 0; n < 12; n++) {
    client.query(`Update electric2 Set hourson = ${ele[n].hourson.toFixed(2)}, usage = ${ele[n].usage.toFixed(2)}, cost = ${ele[n].cost.toFixed(2)} Where id = ${ele[n].id}`, (erro, ress) => { //toFixed(n): Round to the nth decimal place
      if(erro) {
        console.log(erro.message);
        client.end();
        return;
      }
    });
  }
}

function elecday(ele, i) { //Total time of use and cost of usage of electricals for the day 
  var tott = 0;
  var totc = 0;
  for(let j = 0; j < 12; j++) { 
    totc += Number(ele[j].dailycost); 
    tott += Number(ele[j].dailyuse);    
    ele[j].dailyuse = 0; //Reset daily stats after they are added up so that they are zero on the next day
    ele[j].dailycost = 0; 
  }
  writy(`${i}, ${tott.toFixed(2)}, ${totc.toFixed(2)}`);
}

function electot(elecArr) { //Total time, usage, and cost of electricals for all days 
  var totc = 0;
  var totu = 0;
  var toth = 0;
  for(let i = 0; i < 12; i++) { 
    totc += Number(elecArr[i].cost); 
    totu += Number(elecArr[i].usage);   
    toth += Number(elecArr[i].hourson);     
  }
  const statement = `UPDATE electric2 SET hourson = ${toth.toFixed(2)}, usage = ${totu.toFixed(2)}, cost = ${totc.toFixed(2)} WHERE id = 13`;
  client.query(statement, (err,res) => {
    if (err) {
      console.log(err.message);
      return;
    }
    //writy(`\nAll ${t} days: electrical update completed :)`);
    writy(`Electric - Total time on: ${toth.toFixed(2)} hours | Total electrical cost: ${totc.toFixed(2)}`);
    client.end();
    console.log("Electrical update completed :)");
  });
}

let elecs = [ //Array of electrical objects and their properties; all lightbulbs and bath exhaust fans each combined into one object for simplicity
  {
    object: "Light Bulb",
    id: 1,
    watt: 60,
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Bath Exhaust Fan",
    id: 2,
    watt: 30,
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Master Bedroom TV",
    id: 3,
    watt: 100,
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Living Room TV",
    id: 4,
    watt: 636,
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Refrigerator",
    id: 5,
    watt: 150,
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Microwave",
    id: 6,
    watt: 1100,
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Stove",
    id: 7,
    watt: 3500,
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Oven",
    id: 8,
    watt: 4000,
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Dishwasher",
    id: 9,
    watt: 1800,
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Clothes Washer",
    id: 10,
    watt: 500,
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Clothes Dryer",
    id: 11,
    watt: 3000,
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "HVAC",
    id: 12,
    watt: 3500,
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  }
]; //Object count: 12

const days = ["Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];
let t = 60; //Desired number of days

for(let i = 1; i <= t; i++) { //Day cycles (Day 1-59; Jan 1 - Feb 28)
  let n = 0; //Light
  if(weekend(i)) {
    cale(rangedom(60, 1050), elecs[n], i); //Light use range on weekends: 60 minutes - 17.5 hours per day; Schedule - family awake and stay home from work/school: 5:00-22:30 = 63000 max seconds of light use
  } else {
    cale(rangedom(30, 540), elecs[n], i); //Light use range on weekdays: 30 minutes - 9 hours per day; Schedule - family home and awake: 5:00-7:30 (150 min) + 16:00-22:30 (390 min) = 540 max minutes of light use
  }
    
  n = 1; //Fan
  if(weekend(i)) {
    cale(180, elecs[n], i); //Fan use on weekends: 180 minutes; 30 minutes per bath/shower; 3 baths and 3 showers per weekend
  } else {
    cale(120, elecs[n], i); //Fan use on weekdays: 120 minutes; 30 minutes per bath/shower; 2 baths and 2 showers per weekend
  }
    
  n = 2; //Master Bedroom TV
  if(weekend(i)) {
    cale(240, elecs[n], i); //Bedroom TV use on weekends: 4 hours per day (240 min)
  } else {
    cale(120, elecs[n], i); //Bedroom TV use on weekdays: 2 hours per day (120 min)
  }
    
  n = 3; //Living Room TV
  if(weekend(i)) {
    cale(480, elecs[n], i); //Livingroom TV use on weekends: 8 hours per day (480 min)
  } else {
    cale(240, elecs[n], i); //Livingroom TV use on weekdays: 4 hours per day (240 min)
  }
    
  n = 4; //Refrigerator
  cale(1439, elecs[n], i); //Refrigerator use: Always on (00:00-23:59; 1439 min per day)
    
  n = 5; //Microwave
  if(weekend(i)) {
    cale(30, elecs[n], i); //Microwave use on weekends: 30 minutes per day
  } else {
    cale(20, elecs[n], i); //Microwave use on weekdays: 20 minutes per day
  }

  n = 6; //Stove
  if(weekend(i)) {
    cale(30, elecs[n], i); //Stove use on weekends: 30 minutes per day
  } else {
    cale(15, elecs[n], i); //Stove use on weekdays: 15 minutes per day
  }

  n = 7; //Oven
  if(weekend(i)) {
    cale(60, elecs[n], i); //Stove use on weekends: 60 minutes per day
  } else {
    cale(45, elecs[n], i); //Stove use on weekdays: 45 minutes per day
  }

  n = 8; //Dishwasher
  if(washday(i)) {
    cale(45, elecs[n], i); //Dishwasher use: 45 minutes per load; 4 loads in a week (Washdays: Tuesday, Thursday, Saturday, Sunday)
  } 

  n = 9; //Clothes Washer
  if(washday(i)) {
    cale(30, elecs[n], i); //Clothes Washer use: 30 minutes per load; 4 loads in a week
  } 

  n = 10; //Clothes Dryer
  if(washday(i)) {
    cale(30, elecs[n], i, n); //Clothes Dryer use: 30 minutes per load; 4 loads in a week
  } 

  n = 11; //HVAC
  cale(1439, elecs[n], i, n); //HVAC use: Always on (00:00-23:59; 1439 min per day)

  elecday(elecs, i);

  if(i === t) { //End state
    updata(elecs);
    electot(elecs);
  }
}
