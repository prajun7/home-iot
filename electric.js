/* Code by An Nguyen
Data generation for electrical objects in smart house

Calculating electricals:
Same for everything using electricity (see electric2 table)
electric.usage = (electric.secondson / 3600) * (electric.watt / 1000)
electric.cost = electric.usage * 0.12
Add up all of them at the end to get the total electric cost
*/

const client = require('./config/db');  //Exporting the db module from config folder

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

let t = 59; //Desired number of days

function light(min, e, i) {
  var tab = "electric2";
  var id = 1;
  var watt = 60;
  min *= 15; //15 lightbulbs throughout the house; 8 lamps and 7 overhead lights; accounts for average total light usage per day
  cale(min, tab, id, watt, e, i);
}

function fan(min, e, i) {
  var tab = "electric2";
  var id = 2;
  var watt = 30;
  cale(min, tab, id, watt, e, i);
}

function masterTV(min, e, i) {
  var tab = "electric2";
  var id = 3;
  var watt = 100;
  cale(min, tab, id, watt, e, i);
}

function livingTV(min, e, i) {
  var tab = "electric2";
  var id = 4;
  var watt = 636;
  cale(min, tab, id, watt, e, i);
}

function refrigerator(min, e, i) {
  var tab = "electric2";
  var id = 5;
  var watt = 150;
  cale(min, tab, id, watt, e, i);
}

function microwave(min, e, i) {
  var tab = "electric2";
  var id = 6;
  var watt = 1100;
  cale(min, tab, id, watt, e, i);
}

function stove(min, e, i) {
  var tab = "electric2";
  var id = 7;
  var watt = 3500;
  cale(min, tab, id, watt, e, i);
}

function oven(min, e, i) {
  var tab = "electric2";
  var id = 8;
  var watt = 4000;
  cale(min, tab, id, watt, e, i);
}

function dishWasher(min, e, i) {
  var tab = "electric2";
  var id = 9;
  var watt = 1800;
  cale(min, tab, id, watt, e, i);
}

function clothWasher(min, e, i) {
  var tab = "electric2";
  var id = 10;
  var watt = 500;
  cale(min, tab, id, watt, e, i);
}

function clothDryer(min, e, i) {
  var tab = "electric2";
  var id = 11;
  var watt = 3000;
  cale(min, tab, id, watt, e, i);
}

function hvac(min, e, i) {
  var tab = "electric2";
  var id = 12;
  var watt = 3500;
  cale(min, tab, id, watt, e, i);
}

function cale(min, tab, id, watt, e, i) {
  const hor = min / 60;
  const usa = ((min/60) * (watt/1000)); //toFixed(n): Round to the nth decimal place
  const cos = (usa * 0.12);

  e.hourson += Number(hor);
  e.usage += Number(usa);
  e.cost += Number(cos);

  e.dailyuse += Number(hor);
  e.dailycost += Number(cos);

  updata(tab, id, min, cos, e, i);
}

function updata(tab, id, min, cos, e, i) {
  client.query(`Update ${tab} Set hourson = ${e.hourson.toFixed(2)}, usage = ${e.usage.toFixed(2)}, cost = ${e.cost.toFixed(2)} Where id = ${id}`, (erro, ress) => { //toFixed(n): Round to the nth decimal place
    if(!erro) {
      var day = days[i%7];
      //writy(`${i}, ${day}, ${e.object}, ${min},  ${cos.toFixed(2)}`); //Uncomment this to see the usage and cost of each individual item 
    } else {
      console.log(erro.message);
      client.end();
      return;
    }
  });
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
  writy(`${i} ${tott.toFixed(2)} ${totc.toFixed(2)}`);
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
    //writy(`Electric - Total time on: ${toth.toFixed(2)} hours | Total usage: ${totu.toFixed(2)} watt | Total electrical cost: ${totc.toFixed(2)}`);
    client.end();
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

let elecs = [ //Array of electrical objects and their properties; all lightbulbs and bath exhaust fans each combined into one object for simplicity
  {
    object: "Light Bulb",
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Bath Exhaust Fan",
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Master Bedroom TV",
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Living Room TV",
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Refrigerator",
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Microwave",
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Stove",
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Oven",
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Dishwasher",
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Clothes Washer",
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "Clothes Dryer",
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  },
  {
    object: "HVAC",
    hourson: 0,
    cost: 0,
    usage: 0,
    dailyuse: 0,
    dailycost: 0
  }
]; //Object count: 12
const days = ["Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];
const func = [light, fan, masterTV, livingTV, refrigerator, microwave, stove, oven, dishWasher, clothWasher, clothDryer, hvac];

for(let i = 1; i <= t; i++) { //Day cycles (Day 1-59; Jan 1 - Feb 28)
  let n = 0; //Light
  if(weekend(i)) {
    func[n](rangedom(60, 1050), elecs[n], i, n); //Light use range on weekends: 60 minutes - 17.5 hours per day; Schedule - family awake and stay home from work/school: 5:00-22:30 = 63000 max seconds of light use
  } else {
    func[n](rangedom(30, 540), elecs[n], i, n); //Light use range on weekdays: 30 minutes - 9 hours per day; Schedule - family home and awake: 5:00-7:30 (150 min) + 16:00-22:30 (390 min) = 540 max minutes of light use
  }

  n = 1; //Fan
  if(weekend(i)) {
    func[n](180, elecs[n], i); //Fan use on weekends: 180 minutes; 30 minutes per bath/shower; 3 baths and 3 showers per weekend
  } else {
    func[n](120, elecs[n], i); //Fan use on weekdays: 120 minutes; 30 minutes per bath/shower; 2 baths and 2 showers per weekend
  }

  n = 2; //Master Bedroom TV
  if(weekend(i)) {
    func[n](240, elecs[n], i); //Bedroom TV use on weekends: 4 hours per day (240 min)
  } else {
    func[n](120, elecs[n], i); //Bedroom TV use on weekdays: 2 hours per day (120 min)
  }

  n = 3; //Living Room TV
  if(weekend(i)) {
    func[n](480, elecs[n], i); //Livingroom TV use on weekends: 8 hours per day (480 min)
  } else {
    func[n](240, elecs[n], i); //Livingroom TV use on weekdays: 4 hours per day (240 min)
  }

  n = 4; //Refrigerator
  func[n](1439, elecs[n], i); //Refrigerator use: Always on (00:00-23:59; 1439 min per day)

  n = 5; //Microwave
  if(weekend(i)) {
    func[n](30, elecs[n], i); //Microwave use on weekends: 30 minutes per day
  } else {
    func[n](20, elecs[n], i); //Microwave use on weekdays: 20 minutes per day
  }

  n = 6; //Stove
  if(weekend(i)) {
    func[n](30, elecs[n], i); //Stove use on weekends: 30 minutes per day
  } else {
    func[n](15, elecs[n], i); //Stove use on weekdays: 15 minutes per day
  }

  n = 7; //Oven
  if(weekend(i)) {
    func[n](60, elecs[n], i); //Stove use on weekends: 60 minutes per day
  } else {
    func[n](45, elecs[n], i); //Stove use on weekdays: 45 minutes per day
  }

  n = 8; //Dishwasher
  if(washday(i)) {
    func[n](45, elecs[n], i); //Dishwasher use: 45 minutes per load; 4 loads in a week
  }

  n = 9; //Clothes Washer
  if(washday(i)) {
    func[n](30, elecs[n], i); //Clothes Washer use: 30 minutes per load; 4 loads in a week
  }

  n = 10; //Clothes Dryer
  if(washday(i)) {
    func[n](30, elecs[n], i, n); //Clothes Dryer use: 30 minutes per load; 4 loads in a week
  }

  n = 11; //Refrigerator
  func[n](1439, elecs[n], i, n); //HVAC use: Always on (00:00-23:59; 1439 min per day)

  elecday(elecs, i);

  if(i === t) {
    electot(elecs);
  }
}
