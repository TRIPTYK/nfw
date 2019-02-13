const databaseEnv = require('./databaseEnv');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const Log = require('../log');

mongoose.connect(`mongodb://${databaseEnv.user}:${databaseEnv.pwd}@${databaseEnv.host}:${databaseEnv.port}/${databaseEnv.database}`,{useNewUrlParser: true},
  error => {
    if(error) Log.error(error);
    Log.success('Connected to database');
  }
);

exports.connection = mongoose;

exports.getColumns = (tableName) => {
    mongoose.tableName.find( {  } );
};

getColumns('');
