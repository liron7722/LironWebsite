const serverType = process.env.NODE_ENV;
const local_IP = 'localhost';
const port = process.env.NODE_PORT;
const httpPort = 8080;
const httpsPort = 8443;

const ip = require("ip");
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const mailer = require('./liron_modules/m_email');
const express = require('express');
const publicIp = require('public-ip');
const projectPath = path.resolve(__dirname, '..');
const bodyParser = require('body-parser');

var projects = fs.readFileSync('./website/templates/data.json', 'utf8');
/*
let privateKey  = fs.readFileSync('cert/server.key');
let certificate = fs.readFileSync('cert/server.crt');
let credentials = {key: privateKey, cert: certificate};
*/
const app = express();

app.set("view engine", "ejs");
app.set('views', './website/templates');  // ejs files path
app.use(express.static(projectPath));  // main files path
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
  res.render("home", {projects:JSON.parse(projects)});
});

app.use(/*default*/ (req, res) => {
  res.status(404).send('Not found!');
});


app.listen(port, () => {
  console.log(`Server type is: ${serverType}`);
  console.log(`Server internal ip address ${ip.address()}`);
  console.log(`Server local address is http://${local_IP}:${port}`);
  (async () => {
    console.log(`Server public address is http://${await publicIp.v4()}:${port}`);
  })();
});

/**/
/*
function startLog() {
  console.log(`Server type is: ${serverType}`);
  console.log(`Server internal ip address ${ip.address()}`);
  console.log(`Server local address is http://${local_IP}:${httpsPort}`);
  (async () => {
    console.log(`Server public address is http://${await publicIp.v4()}:${httpsPort}`);
  })();
}


let httpServer = http.createServer(app);
let httpsServer = https.createServer(credentials, app);

httpServer.listen(httpPort);
httpsServer.listen(httpsPort);
startLog();
*/