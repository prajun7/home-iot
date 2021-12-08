//imports
const express = require('express');   //Importing express

const port = 5000

const app = express()   //Initializing express

const router = express.Router()

const axios = require('axios')
/*
const path = require('path')
var requirejs = require('requirejs');
requirejs.config({
  //Pass the top-level main.js/index.js require
  //function to requirejs so that node modules
  //are loaded relative to the top-level JS file.
  nodeRequire: require
});

 */
const {Client} = require('pg');

const client = new Client({
  host: '138.26.48.83',
  port: 5432,
  user: 'Team4',
  password: 'Team4',
  database: 'Team4DB'
});

client.connect();
/////////////////////////////////////////////////
//To install express : In terminal : npm install express
// then node_modules will be created
//Static Files
app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/js',express.static(__dirname + 'public/js'))
app.use('/img',express.static(__dirname + 'public/img'))
app.use('/libs',express.static(__dirname + 'public/libs'))

//Set Views
app.set('views', './views')
app.set('view engine', 'ejs')



app.get('',(req, res) => {
  res.render('home')
})
app.get('/home',(req, res) => {
  res.render('home')
})
app.get('/graphs',(req, res) => {
  res.render('graphs');

})
app.get('/utility',(req, res) => {
  res.render('utility')
})



// Turn on the server!
// run: npm start
app.use('/', router);
app.listen(process.env.port || port );

console.log('Running at Port: ' + port);

/////////////////////////////////////////////////



