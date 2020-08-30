// require
const ip = require("ip");
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const config = require('./liron_modules/m_config');
const mailer = require('./liron_modules/m_email');
const express = require('express');
const publicIp = require('public-ip');
const projectPath = path.resolve(__dirname, '..');
const bodyParser = require('body-parser');

// environment variables
const local_IP = 'localhost';
//const PORT = process.env.NODE_PORT;
//const SERVER_ENV = process.env.NODE_ENV;
const PORT = config.get_node_port();
const SERVER_ENV = config.get_node_env();

// db data
var projects = fs.readFileSync('./website/templates/projects.json', 'utf8');
var upcoming = fs.readFileSync('./website/templates/upcoming.json', 'utf8');

// SSL/TLS keys
/*
let privateKey  = fs.readFileSync('cert/server.key');
let certificate = fs.readFileSync('cert/server.crt');
let credentials = {key: privateKey, cert: certificate};
*/

var logger = (req, res ,next) => {
  let url = req.url;
  let time = new Date();
  console.log(`Received request for ${url} at ${time}`);
  next();
};

var errorHandling = () => {
  if (SERVER_ENV === "development") {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
  }
  else if (SERVER_ENV === "production") {
    app.use(express.errorHandler())
  }
};

// init
const app = express();
app.set("view engine", "ejs");  // set view to ejs files
app.set('views', './website/templates');  // set ejs files path
app.use(express.static(projectPath));  // add project path
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);

app.use('/contact', (req, res) => {
  console.log(req.body);
  mailer.sendEmail(req.body.name, req.body.email, req.body.subject, req.body.message);
  res.redirect(301, '/');

});

app.use('/', (req, res) => {
  res.render("home", {
    // adding db data
    projects:JSON.parse(projects),
    upcoming:JSON.parse(upcoming)
  });
});

app.use(/*default*/ (req, res) => {
  res.status(404).render("404", {url:req.url});
});


function startInfo(port) {
  console.log(`Server type is: ${SERVER_ENV}`);
  console.log(`Server internal ip address ${ip.address()}`);
  console.log(`Server local address is http://${local_IP}:${port}`);
  (async () => {
    console.log(`Server public address is http://${await publicIp.v4()}:${port}`);
  })();
}

let httpServer = http.createServer(app);
//let httpsServer = https.createServer(credentials, app);

httpServer.listen(PORT, () => { startInfo(PORT); });

//httpsServer.listen(PORT, () => { startInfo(); });