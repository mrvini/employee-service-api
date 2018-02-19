'use strict';

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const routes = require('./api/routes/EmployeeServiceRoutes'); //importing employee service routes

const app = express()
app.use( bodyParser.json({ strict: false }) );

routes(app); //register routes
app.use(
    (req, res) => {
        res.status(404).send({
            url: req.originalUrl + ' not found'
        })
    }
);

module.exports.handler = serverless(app);
