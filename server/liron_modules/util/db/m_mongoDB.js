const LOCAL_DB_URI = process.env.MONGO_DB_LOCAL_URI;
const CLOUD_DB_URI = process.env.MONGO_DB_CLOUD_URI;

const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');


class db {
    constructor (logger){
        this.logger = logger;
        this.dbNames = ['home'];
        this.clients = {'cloud': new MongoClient(CLOUD_DB_URI, { useNewUrlParser: true }),
            'local': new MongoClient(LOCAL_DB_URI, { useNewUrlParser: true })};
        this.dbConnections = this.setConnections()
    }

    setConnections() {
        let dbConnections = {};
        for (let client in this.clients) {
            let connections = {};
            for (let name of this.dbNames){
                try {
                    this.clients[client].connect(err => {
                        connections[name] = this.clients[client].db(name);
                        if (this.logger) this.logger.debug(`{client} db establish connection to {name}`)
                    });
                } catch {
                    let message = 'db connection Timeout - check for if this machine ip is on whitelist';
                    if (this.logger) this.logger.exception(message);
                    else console.log(message);
                }
            }
            dbConnections[client] = connections;
        }
        return dbConnections;
    }

    getDBConnections() {
        return this.dbConnections;
    }
}

//A = new db();
//console.log(A.getDBConnections());
function iterateFunc(doc) {
    console.log(JSON.stringify(doc, null, 4));
    //data.push(item);
}

function errorFunc(error) {
    console.log('');
}


/*
MongoClient.connect(LOCAL_DB_URI, function(err, client) {
  assert.equal(null, err);
  const db = client.db("home");
    var cursor = db.collection('projects').find({});
    cursor.forEach(iterateFunc, errorFunc);

  client.close();
});*/

mongoose.connect(LOCAL_DB_URI + '/home');
//var schema = new mongoose.Schema;
var myschema = new mongoose.Schema({
    img: String,
    title: String,
    description: String,
    link: String
});
module.exports = mongoose.model('project', myschema);
function x() {
    project.find((err, data) => {
        if (err) {
            console.log('error');
        } else {
            console.log(data);
        }
    });
};
x();