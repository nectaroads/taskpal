const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { print } = require('./utils/io');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const eventHandlers = {};
const eventHandlersDir = path.join(__dirname, './events');

fs.readdirSync(eventHandlersDir).forEach(file => {
  if (file.endsWith('.js')) {
    const key = path.basename(file, '.js');
    eventHandlers[key] = require(path.join(eventHandlersDir, file));
  }
});

app.post('/taskpal', (req, res) => {
  if (!req.body) return;
  const handler = eventHandlers[req.body.key];
  if (handler) {
    print(`[Request] Request handler: Processing ${req.body.key}`);
    handler(req.body, res);
  }
});

async function startExpress() {
  return new Promise((resolve, reject) => {
    app.listen(process.env.EXPRESS_PORT, error => {
      if (error) return reject(new Error(error));
      print(`[Setup] Application started: Express started on ${process.env.EXPRESS_PORT}`);
      resolve();
    });
  }).catch(error => {
    print(`[Error] Process failed: ${error}`);
  });
}

module.exports = { startExpress };
