/// Add Requirements ///
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path_lib = require('path');
const fs = require('fs');

const request_handlers = require('./request');
const logger = require('./logging');

// init logger
logger.init("./logs");

// load handlers
let page_req_handlers_path = path_lib.join(__dirname, "RequestHandlers/Pages");
let files = fs.readdirSync(page_req_handlers_path);
files = files.filter(f => f.endsWith('.js'));
let amount_imported = 0;
fs.readdirSync(page_req_handlers_path).forEach((f) => {
    if (!f.endsWith(".js")) return;
    require("./RequestHandlers/Pages/" + f);
    amount_imported++;
    logger.push_log("Loaded page request handler: " + f);
    console.log("Loaded page request handler: " + f + " (" + amount_imported + "/" + files.length + ")");
});

// Set port
const PORT = process.env.PORT || 5000;

// Initialize app
const app = express();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        }
    },
    referrerPolicy: { policy: 'no-referrer' },
    frameguard: { action: 'deny' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('html', require("ejs").renderFile);
app.set('view engine', 'html');

// create public folder for serving items directly
const publicDir = path_lib.join(__dirname, '/public');
app.use(express.static(publicDir));

app.use(require('cookie-parser')());
app.use((req, res, next) => {
    res.cookie('session', 'value', {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'Strict'
    });
    next();
});

function verifyParams(params) {
    for (let i = 0; i < params.length; i++) {
        if (!params[i]) {
            return false;
        }
    }
    return true;
}

// Setup handler proxies
logger.push_log("Setting up proxies...");
for (let i = 0; i < request_handlers.getRegisteredRequests().length; i++) {
    let request = request_handlers.getRegisteredRequests()[i];
    if (request.type === "GET") {
        app.get(request.total_url, (req, res) => {
            logger.push_log("GET request received: " + request.total_url + ", Client IP: " + (req.headers['x-forwarded-for'] || req.socket.remoteAddress));
            let params = [];
            for (let i = 0; i < request.params.length; i++) {
                params.push(req.query[request.params[i]]);
            }
            if (!verifyParams(params)) {
                res.status(400).send("Please provide all the required parameters");
                return;
            }
            request.callback(...params, res, req);
        });
    } else if (request.type === "POST") {
        app.post(request.total_url, (req, res) => {
            logger.push_log("POST request received: " + request.total_url + ", Client IP: " + (req.headers['x-forwarded-for'] || req.socket.remoteAddress));
            let params = [];
            for (let i = 0; i < request.params.length; i++) {
                params.push(req.body[request.params[i]]);
            }
            if (!verifyParams(params)) {
                res.status(400).send("Please provide all the required parameters");
                return;
            }
            request.callback(...params, res, req);
        });
    }
}

// setup 404
app.use(function(req, res, next) {
    res.status(404);
    res.status(404).type("json").json({"err": "Not Found!", "errno": 404});
});

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
