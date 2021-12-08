//Checking exports,
//Check tryModules.js file
//Check try.js file



function str(){
    console.log("str");
}

function add(){
    console.log(5+4);
}

var t = "hey";

let da = {
    ta: "", //name of table
    id: 0 //id value
  }

  let wat = {
    use: 0,
    gal: 0,
    cost: 0
  }

function shower2() {
    da.ta = "water";
    da.id = 4;
    wat.gal = 30;
  }
  
  function dishwasher() {
    da.ta = "water";
    da.id = 5;
    wat.gal = 6;
  }

module.exports = {add,str,shower2,dishwasher,t,wat};