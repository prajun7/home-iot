const fs = require("fs");

function rangedom(n1, n2) { //n1 = min random number range; n2 = max random number range 
    return ((Math.floor(Math.random() * (n2 - n1 + 1))) + n1);
}

function writy(strng) {
  fs.appendFile('hvac.txt', strng+="\n", function(err) {
    if (err) {
      return console.error(err);
    }
  });
}

let doors = [ //Array of all doors in the smart house
    {
      object: "Front Door",
      isopened: false,
      minutesopen: 0
    },
    {
      object: "Back Door",
      isopened: false,
      minutesopen: 0
    },
    {
      object: "Door to Garage",
      isopened: false,
      minutesopen: 0
    },
    {
      object: "Garage Door 1", //Garage doors do not affect internal temp so no timer used for them
      isopened: false,
    },
    {
      object: "Garage Door 2",
      isopened: false,
    },
]; //3 normal doors, 2 garage doors

let windows = [ //Array of all windows in the smart house
    {
      object: "Master Bedroom Window 1",
      isopened: false,
      minutesopen: 0
    },
    {
      object: "Master Bedroom Window 2",
      isopened: false,
      minutesopen: 0
    },
    {
      object: "First Kids Bedroom Window 1",
      isopened: false,
      minutesopen: 0
    },
    {
      object: "First Kids Bedroom Window 2",
      isopened: false,
      minutesopen: 0
    },
    {
      object: "Second Kids Bedroom Window 1",
      isopened: false,
      minutesopen: 0
    },
    {
      object: "Second Kids Bedroom Window 2",
      isopened: false,
      minutesopen: 0
    },
    {
      object: "Living Room Window 1",
      isopened: false,
      minutesopen: 0
    },
    {
      object: "Living Room Window 2",
      isopened: false,
      minutesopen: 0
    },
    {
      object: "Living Room Window 3",
      isopened: false,
      minutesopen: 0
    },
    {
      object: "Bathroom 1 Window",
      isopened: false,
      minutesopen: 0
    },
    {
      object: "Bathroom 2 Window",
      isopened: false,
      minutesopen: 0
    },
    {
      object: "Kitchen Window 1",
      isopened: false,
      minutesopen: 0
    },
    {
      object: "Kitchen Window 2",
      isopened: false,
      minutesopen: 0
    }
]; //13 Windows

let hvac = {
    outsideTemp: 0,
    insideTemp: 0,
    minutesclosed: 0,
    usage: 0,
    cost: 0
}

function toggle(obj, min) {
    if(obj.isopened === false) {
        obj.isopened = true;
        console.log(`Minute ${min}: ${obj.object} is opened`);
    } else {
        obj.isopened = false;
        console.log(`Minute ${min}: ${obj.object} is closed`);
    }
}

function doorTime(darr, hv) { //Check if any door object's timer has passed a 5-minute mark; if not, pass; if so, change internal temp so that if external temp has a 10+ deg F difference, +/- 2 deg F to internal temp  
  for(let k = 0; k < 3; k++) {
    if (Number(darr[k].minutesopen) % 5 === 0 && Number(darr[k].minutesopen) != 0) {
      console.log(`\t\t - ${darr[k].object} has been opened for 5 minutes.`);
      if (hv.outsideTemp >= (hv.insideTemp + 10)) {
        hv.insideTemp += 2;
        console.log(`\t\t  HVAC - internal temp has increased by 2°F.`);
      } else if (hv.outsideTemp <= (hv.insideTemp - 10)) {
        hv.insideTemp -= 2;
        console.log(`\t\t  HVAC - internal temp has decreased by 2°F.`);
      }
      console.log(`\t\t\t External temperature: ${hv.outsideTemp}°F`);
      console.log(`\t\t\t Internal temperature: ${hv.insideTemp}°F`);
    }  
  }
}

function windTime(warr, ac) { //Check if any window object's timer has passed a 5-minute mark; if not, pass; if so, change internal temp so that if external temp has a 10+ deg F difference, +/- 1 deg F to internal temp  
  for(let k = 0; k < 13; k++) {
    if (Number(warr[k].minutesopen) % 5 === 0 && Number(warr[k].minutesopen) != 0) {
      console.log(`\t\t - ${warr[k].object} has been opened for 5 minutes.`);
      if (ac.outsideTemp >= (ac.insideTemp + 10)) {
        ac.insideTemp += 2;
        console.log(`\t\t  HVAC - internal temp has increased by 1°F.`);
      } else if (ac.outsideTemp <= (ac.insideTemp - 10)) {
        ac.insideTemp -= 2;
        console.log(`\t\t  HVAC - internal temp has decreased by 1°F.`);
      }
      console.log(`\t\t\t External temperature: ${ac.outsideTemp}°F`);
      console.log(`\t\t\t Internal temperature: ${ac.insideTemp}°F`);
    }  
  }
}

function closeTime(darr, warr, vac) { //Calculate the temperature change when all doors and windows are closed; +/- 2 deg F every hour for every 10+ deg F external temp difference
  var totemp = 0; //Total time of opened doors and windows
  for(let k = 0; k < 3; k++) {
    totemp += Number(darr[k].minutesopen);
  }
  for(let l = 0; l < 13; l++) {
    totemp += Number(warr[l].minutesopen);
  }
  vac.minutesclosed = 1440 - totemp; //There are 1440 minutes in a day; the difference of all minutes in the day and all minutes doors/windows spent opened = time all objects are closed
  var m = Math.floor(Number(vac.minutesclosed) / 60); //Number of hours closed
  var n = 0;
  for(let x = 0; x < m; x++) {
    if (vac.outsideTemp >= (vac.insideTemp + 10)) {
      vac.insideTemp += 2;
      n += 2;
    } else if (vac.outsideTemp <= (vac.insideTemp - 10)) {
      vac.insideTemp -= 2;
      n -= 2;
    }
  }
  console.log(`\t Total temperature change for all doors and windows closed: ${n}`);
  console.log(`\t\t External temperature: ${vac.outsideTemp}°F`);
  console.log(`\t\t Internal temperature: ${vac.insideTemp}°F`);
}

function resetime(darr, warr, hva) {
  for(let k = 0; k < 3; k++) {
    darr[k].minutesopen = 0;
  }
  for(let l = 0; l < 13; l++) {
    warr[l].minutesopen = 0;
  }
  hva.minutesclosed = 0;
}

function weekend(i) { //Checks if the day id is on a weekend
    let day = i % 7; //Data generation starts on a Friday, so every 2nd and 3rd step in the week cycle will be Saturday and Sunday
    if(day === 2 || day === 3) {
        return true;
    } else {
        return false;
    }
}

const t = 7; //Number of desired days
const days = ["Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];

hvac.outsideTemp = rangedom(0, 120); //Temperature outside; in Farenheit and in whole numbers only
hvac.insideTemp = rangedom(60, 80); //Temperature inside; starts at reasonable room temp level
console.log(`Starting external temperature: ${hvac.outsideTemp}°F`);
console.log(`Starting internal temperature: ${hvac.insideTemp}°F`);

for(let i = 1; i <= t; i++) {
    var day = days[i%7];
    console.log(`Day ${i} - ${day}:`);
    var e = 0; //Number of door opening events
    if(weekend(i)) { //32 exit-enter events on weekends
        e = 32;
    } else { //16 exit-enter events on weekdays
        e = 16;
    }
    for(let j = 1; j <= e; j++) {
        var n = rangedom(0, 2); //Rolls between 3 doors for 30 seconds in exit-enter event, not counting garage doors, which are presumed open when door to garage is opened
        doors[n].minutesopen += 0.5;
        console.log(`\t - ${doors[n].object} opened for 30 seconds.`);
        doorTime(doors, hvac);
        n = rangedom(0, 12); //Rolls between 13 windows to open for 1 minute in opening event
        windows[n].minutesopen += 1;
        console.log(`\t - ${windows[n].object} opened for 1 minute.`);
        windTime(windows, hvac);
        var y = rangedom(-2, 2);
        hvac.outsideTemp += Number(y);
        if (y != 0) {
          console.log(`\t\t - External temp changed by ${y}°F.`);
        }
    }
    closeTime(doors, windows, hvac);
    resetime(doors, windows, hvac);
}
