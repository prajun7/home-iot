const Client = require('pg').Client; //Install PSQL client with "npm install pg" to be able to connect to PSQL database server 

const client = new Client({
  host: '138.26.48.83',
  port: 5432,
  user: 'Team4',
  password: 'Team4',
  database: 'Team4DB'
});

module.exports = client;


