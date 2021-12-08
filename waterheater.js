/* Code by Prajun Trital and An Nguyen
Data generation for both water and heater appliances of smart house 

Calculating the water uses
water.cost = (gallons/748) * 2.52
Add up all of them at the end to get the total water cost

Heater calcs
2 Baths and 2 Showers: 0.65 * gallons of bath and shower water
Dishwasher: : 1.0 * gallons
Clothes washer: 0.85 * gallons
Time = 4 min * hot gallons
Usage = (time/3600) hour * 4500 watt
Cost = 0.12 kWh * (usage/1000) 
*/

const client = require('./config/db');  //Exporting the db module from config folder

client.connect();


const fs = require("fs");

const tf1 = "water.txt"
const tf2 = "heater.txt"

fs.writeFile(tf1, '', function(err) {
    if (err) {
        return console.error(err);
    }
});

fs.writeFile(tf2, '', function(err) {
    if (err) {
        return console.error(err);
    }
});

function writ1(strng) {
  fs.appendFile(tf1, strng+="\n", function(err) {
    if (err) {
        return console.error(err);
    }
  });
}

function writ2(strng) {
    fs.appendFile(tf2, strng+="\n", function(err) {
      if (err) {
          return console.error(err);
      }
    });
  }

const t = 59; //Desired number of days

function bath1(e,i) {
    ta = "water";
    id = 1;
    gal = 30;
    calcw(id,ta,gal,e,i,);
}
  
function shower1(e,i) {
    ta = "water";
    id = 2;
    gal = 25;
    calcw(id,ta,gal,e,i);
}
  
function bath2(e,i) {
    ta = "water";
    id = 3;
    gal = 30;
    calcw(id,ta,gal,e,i);
}
    
function shower2(e,i) {
    ta = "water";
    id = 4;
    gal = 25;
    calcw(id,ta,gal,e,i);
}
  
function dishwasher(e,i) {
    ta = "water";
    id = 5;
    gal = 6;
    calcw(id,ta,gal,e,i);
}
    
function clothwasher(e,i) {
    ta = "water";
    id = 6;
    gal = 20;
    calcw(id,ta,gal,e,i);
}  

   /*
    This function caluclate the total cost and usage.
    Param: id : id of the databse table
           ta : name of the table from the database
           gal : hot water gallons that is being used
           e : object that is being passed
           i : number of days passed

    It calls the update function to update the cost and gallons
  */
function calcw(id,ta,gal,e,i){
  var waterCost = ((gal/748) * 2.52).toFixed(2);

  e.cost += Number(waterCost);
  e.gallons += Number(gal);

  e.dailycos += Number(waterCost);
  e.dailygal += Number(gal);

  updatw(id,ta,gal,e,i,waterCost);
}

   /*
    This function update the total cost and usage into the databse
    Param: id : id of the databse table
           ta : name of the table from the database
           e : object that is being passed
           i : number of days   
  */
function updatw(id,ta,gal,e,i,wc) {
    const statement = `UPDATE ${ta} SET gallons = ${e.gallons}, cost = ${e.cost.toFixed(2)} WHERE id = ${id}`;
    client.query(statement, (err,res) => {
        if (err) {
            console.log(err.message);
            return;
        }
        var day = days[i%7];
        //writ1(`${i}, ${day}, ${e.object}: ${gal}, ${wc}`); //Uncomment this to see the gallon usage and cost of each individual item 
    });
}

function totwatr(watArr) {
    var totc = 0;
    var totg = 0;
    for(let i = 0; i < 6; i++) {
        totg += Number(watArr[i].gallons);   
        totc += Number(watArr[i].cost);    
    }
    const statement = `UPDATE water SET gallons = ${totg}, cost = ${totc.toFixed(2)} WHERE id = 7`;
    client.query(statement, (err,res) => {
        if (err) {
            console.log(err.message);
            return;
        }
        //console.log(`\nAll ${t} days: water update completed :)`);
        //writ1(`Water - Total gallons used: ${totg} | Total water cost: ${totc.toFixed(2)}`);
        //writ1(`${totg} ${totc.toFixed(2)}`);

    });
}


function batheat1(e,i) {
    ta = "hwheater";
    id = 1;
    gal = 30 * 0.65;
    calch(id,ta,gal,e,i);
}
  
function showerheat1(e,i) {
    ta = "hwheater";
    id = 2;
    gal = 25 * 0.65;
    calch(id,ta,gal,e,i);
}
  
function batheat2(e,i) {
    ta = "hwheater";
    id = 3;
    gal = 30 * 0.65;
    calch(id,ta,gal,e,i);
}
    
function showerheat2(e,i) {
    ta = "hwheater";
    id = 4;
    gal = 25 * 0.65;
    calch(id,ta,gal,e,i);
}
  
function disheater(e,i) {
    ta = "hwheater";
    id = 5;
    gal = 6;
    calch(id,ta,gal,e,i);
}
    
function clotheater(e,i) {
    ta = "hwheater";
    id = 6;
    gal = 20 * 0.85;
    calch(id,ta,gal,e,i);
}  

   /*
    This function caluclate the total cost and usage.
    Param: id : id of the databse table
           ta : name of the table from the database
           gal : hot water gallons that is being used
           e : object that is being passed
           i : number of days passed
    Watt: hot water heater always uses 4500 watt per hour
    Time: 4 minutes to heat a gallon of water
    Usage: hours of use * kilowatt
    Cost: $0.12 * usage

    It calls the update function to update the usage, cost, gallons and minuteson
  */
function calch(id,ta,gal,e,i){
    var time = (4 * gal)/60;
    var usage = time * (4500/1000);
    var electricityCost = (0.12 * usage);

    e.usage += Number(usage);
    e.cost += Number(electricityCost);
    e.gallons += Number(gal);
    e.hourson += Number(time);

    e.dailycos += Number(electricityCost);
    e.dailygal += Number(gal);
    e.dailyuse += Number(time);

    updath(id,ta,gal,time,e,i,electricityCost);
}

function updath(id,ta,gal,time,e,i,ec){
    const statement = `UPDATE ${ta} SET gallons = ${e.gallons}, hourson = ${e.hourson.toFixed(2)}, usage = ${e.usage.toFixed(3)}, cost = ${e.cost.toFixed(2)} WHERE id = ${id}`;
    client.query(statement, (err,res) => {
        if (err) {
            console.log('An error occured! while updating');
            return;
        }
        var day = days[i%7];
        //writ2(`${i}, ${day}, ${e.object}: ${time.toFixed(1)}, ${gal}, ${ec.toFixed(2)}`); //Uncomment this to see the usage and cost of each individual item 
    });
}

function totheatr(heatArr) {
    var totc = 0;
    var totg = 0;
    var totu = 0;
    var toth = 0;
    for(let i = 0; i < 6; i++) {
        totg += Number(heatArr[i].gallons);   
        totc += Number(heatArr[i].cost); 
        totu += Number(heatArr[i].usage);   
        toth += Number(heatArr[i].hourson);     
    }
    const statement = `UPDATE hwheater SET hourson = ${toth.toFixed(2)}, gallons = ${totg}, usage = ${totu.toFixed(3)}, cost = ${totc.toFixed(2)} WHERE id = 7`;
    client.query(statement, (err,res) => {
      if (err) {
        console.log(err.message);
        return;
      }
      //console.log(`\nAll ${t} days: hot water heater update completed :)`);
      //writ2(`Heater - Total time on: ${toth.toFixed(2)} hours | Total gallons heated: ${totg} | Total heater cost: ${totc.toFixed(2)}`);
      //writ2(`${toth.toFixed(2)} ${totg} ${totc.toFixed(2)}`);

      client.end();
    });
}

function hwdailytot(watarr, heatarr, i) {
    var wtotc = 0;
    var wtotg = 0;
    var htotc = 0;
    var htotg = 0;
    var htotu = 0;
    for(let j = 0; j < 6; j++) {
        wtotg += Number(watarr[j].dailygal);   
        wtotc += Number(watarr[j].dailycos); 
        htotu += Number(heatarr[j].dailyuse);   
        htotg += Number(heatarr[j].dailygal);    
        htotc += Number(heatarr[j].dailycos); 

        watarr[j].dailygal = 0;
        watarr[j].dailycos = 0;
        heatarr[j].dailyuse = 0;
        heatarr[j].dailygal = 0;
        heatarr[j].dailycos = 0;
    }
    writ1(`${i} ${wtotg} ${wtotc.toFixed(2)}`);
    writ2(`${i} ${htotu.toFixed(2)} ${htotg} ${htotc.toFixed(2)}`);
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

function rangedom(n1, n2) { //n1 = min random number range; n2 = max random number range 
    return ((Math.floor(Math.random() * (n2 - n1 + 1))) + n1);
}

//Array of objects that uses water
let waterArr = [
    {
        object: "1st Bath",
        cost: 0,
        gallons: 0,
        dailycos: 0,
        dailygal: 0
    },

    {
        object: "2nd Bath",
        cost: 0,
        gallons: 0,
        dailycos: 0,
        dailygal: 0
    },

    {
        object: "1st Shower",
        cost: 0,
        gallons: 0,
        dailycos: 0,
        dailygal: 0
    },

    {
        object: "2nd Shower",
        cost: 0,
        gallons: 0,
        dailycos: 0,
        dailygal: 0
    },

    {
        object: "Dish Washer",
        cost: 0,
        gallons: 0,
        dailycos: 0,
        dailygal: 0
    },

    {
        object: "Clothes Washer",
        cost: 0,
        gallons: 0,
        dailycos: 0,
        dailygal: 0
    }
];

//Array of water appliances that heater needs to be used on
let heaterArr = [
    {
        object: "1st Bath Heater",
        hourson: 0,
        cost: 0,
        gallons: 0,
        usage : 0,
        dailyuse: 0,
        dailycos: 0,
        dailygal: 0
    },

    {
        object: "2nd Bath Heater",
        hourson: 0,
        cost: 0,
        gallons: 0,
        usage : 0,
        dailyuse: 0,
        dailycos: 0,
        dailygal: 0
    },

    {
        object: "1st Shower Heater",
        hourson: 0,
        cost: 0,
        gallons: 0,
        usage : 0,
        dailyuse: 0,
        dailycos: 0,
        dailygal: 0
    },

    {
        object: "2nd Shower Heater",
        hourson: 0,
        cost: 0,
        gallons: 0,
        usage : 0,
        dailyuse: 0,
        dailycos: 0,
        dailygal: 0
    },

    {
        object: "Dish Washer Heater",
        hourson: 0,
        cost: 0,
        gallons: 0,
        usage : 0,
        dailyuse: 0,
        dailycos: 0,
        dailygal: 0
    },

    {
        object: "Clothes Washer Heater",
        hourson: 0,
        cost: 0,
        gallons: 0,
        usage : 0,
        dailyuse: 0,
        dailycos: 0,
        dailygal: 0
    }
];

  const days = ["Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];
  const funw = [bath1, bath2, shower1, shower2, dishwasher, clothwasher]; //Array of functions corresponding to the water objects
  const funh = [batheat1, batheat2, showerheat1, showerheat2, disheater, clotheater]; //Array of functions corresponding to the heater objects

  for(let i = 1; i <= t; i++) { //Day cycles (Day 1-59; Jan 1 - Feb 28)
    let n = 0; //Variable for water and heater objects' address locations
    let c = 0; //Variable for amount of times baths/showers are taken per day

    if(weekend(i)) { //3 baths on weekends
        c = 3;
    } else { //2 baths on weekdays
        c = 2;
    }
    for(let r = 0; r < c; r++) {
        var y = rangedom(1, 2); //Randomly chooses bath1 or bath2
        if (y === 1) {
            n = 0; //bath1
            funw[n](waterArr[n], i);
            funh[n](heaterArr[n], i);
        } else if (y === 2) {
            n = 1; //bath2
            funw[n](waterArr[n], i);   
            funh[n](heaterArr[n], i);
        }
    }
    
    if(weekend(i)) { //3 showers on weekends
        c = 3;
    } else { //2 showers on weekdays
        c = 2;
    }
    for(let r = 0; r < c; r++) {
        var y = rangedom(1, 2); //Randomly chooses shower1 or shower2
        if (y === 1) {
            n = 2; //shower1
            funw[n](waterArr[n], i);    
            funh[n](heaterArr[n], i);
        } else if (y === 2) {
            n = 3; //shower2
            funw[n](waterArr[n], i); 
            funh[n](heaterArr[n], i);
        }
    }
    
    n = 4; //dishwasher
    if(washday(i)) {
        funw[n](waterArr[n], i);  
        funh[n](heaterArr[n], i);
    } 
    
    n = 5; //clothwasher
    if(washday(i)) {
        funw[n](waterArr[n], i); 
        funh[n](heaterArr[n], i);
    } 

    hwdailytot(waterArr, heaterArr, i);

    if(i === t) {
        totwatr(waterArr);
        totheatr(heaterArr);
    }
}
