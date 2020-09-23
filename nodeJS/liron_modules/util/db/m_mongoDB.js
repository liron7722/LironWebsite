const LOCAL_DB_URI = process.env.MONGO_DB_LOCAL_URI;

const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

arr= [];
function getCollection(name) {
    function fillArray(item){
        if (item != null) {
            return item;
        }
    }
    MongoClient.connect(LOCAL_DB_URI, function(err, db) {
        let dbo = db.db("home");
        let collection = dbo.collection(name);
        var array = ['x'];
        collection.find({}).toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            arr.push(result);
            db.close();
        });
        console.log(array);
    });
}

getCollection('projects');
console.log(arr);