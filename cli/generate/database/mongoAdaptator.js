const databaseEnv = require('./databaseEnv');
const dotenv = require('dotenv');
const { promisify } = require('es6-promisify');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const Log = require('../log');
const url = `mongodb://${databaseEnv.user}:${databaseEnv.pwd}@${databaseEnv.host}:${databaseEnv.port}`;

const client = new MongoClient();
const Connect = promisify(MongoClient.connect);

exports.getColumns = async (tableName) => {
  const connection = await Connect(url,{ useNewUrlParser: true });
  const db = connection.db(databaseEnv.database);
  const collection = db.collection(tableName);
  const FindOne = promisify(collection.findOne.bind(collection));

  // make new Promise manually , and wait for mapReduce result
  const reduceResult = await new Promise(async(resolve,reject) => {
      collection.mapReduce(
        function() {for (var key in this) { emit(key, this ); }}, // emit
        function(key, stuff) { return null },
        {
            query:{},
            out: { inline: 1 }
        },
        function(err, results) {
            if (err) reject(err);
            resolve(results);
        }
      );
  });

  if (Object.keys(reduceResult).length === 0) {
    throw `Cannot detect data type of your mongodb table (${tableName})`;
  }

  let columns = {};

  for (let variable in reduceResult) {
    let column = reduceResult[variable]._id;
    columns[column] = { $exists : true };
  }

  const columnsWithValues = await FindOne(columns);
  columns = {};

  for (let variable in reduceResult) {
    let column = reduceResult[variable]._id;
    let columnValue = columnsWithValues[column];
    columns[column] = {
      Field : column,
      Default : null,
      Type : columnsWithValues[column].constructor.name
    };
  }

  return columns;
};
