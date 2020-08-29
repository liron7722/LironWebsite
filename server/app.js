// environment variables
const local_IP = 'localhost';
//const port = process.env.NODE_PORT;
//const serverType = process.env.NODE_ENV;

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

const port = config.get_node_port();
const serverType = config.get_node_env();

// db data
var projects = fs.readFileSync('./website/templates/projects.json', 'utf8');
var upcoming = fs.readFileSync('./website/templates/upcoming.json', 'utf8');

// SSL/TLS keys
/*
let privateKey  = fs.readFileSync('cert/server.key');
let certificate = fs.readFileSync('cert/server.crt');
let credentials = {key: privateKey, cert: certificate};
*/

// init
const app = express();
app.set("view engine", "ejs");  // set view to ejs files
app.set('views', './website/templates');  // set ejs files path
app.use(express.static(projectPath));  // add project path
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/contact', (req, res) => {
  var name = req.body.name;
  var sender = req.body.email;
  var subject = req.body.subject;
  var msg = req.body.message;
  console.log(name.toString());
  console.log(typeof name);
  console.log(name + '\n' + sender + '\n' + subject + '\n' + msg);
  mailer.sendEmail(name, sender, subject, msg);
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
  res.status(404).send('Not found!');
});


function startInfo() {
  console.log(`Server type is: ${serverType}`);
  console.log(`Server internal ip address ${ip.address()}`);
  console.log(`Server local address is http://${local_IP}:${port}`);
  (async () => {
    console.log(`Server public address is http://${await publicIp.v4()}:${port}`);
  })();
}

/*
app.listen(port, () => {
  startInfo();
});
*/

let httpServer = http.createServer(app);
//let httpsServer = https.createServer(credentials, app);

httpServer.listen(port, () => { startInfo(); });

//httpsServer.listen(port, () => { startInfo(); });