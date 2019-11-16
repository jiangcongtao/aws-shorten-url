'use strict';

var base62 = require('base-62.js');
var configurator = require('./config');
var ddbTableManager = require('./ddb-table-manager');
process.env.NODE_ENV = 'production'
configurator.configureEnvironment(process.env.NJ_ENVIRONMENT);

function createTableIfNotExits() {
    ddbTableManager.createUrlsKeySeedTableIfNotExist();
    ddbTableManager.createUrlsTableIfNotExist();
    ddbTableManager.createUrlsCustomDomainTableIfNotExist();
}

function writeAUrl() {
    // example of writing shortened url and its original url to database
    ddbTableManager.writeUrlsTable("203",
        "https://stackoverflow.com/questions/13053788/node-js-check-if-a-var-is-a-function",
        function(err, urlkey) {
            if (err) console.log("ERROR in writeUrlsTable: " + err);
            else console.log(urlkey);
        }
    );
}

createTableIfNotExits();

// setup custom domain
ddbTableManager.updateDomainInUrlsCustomTable("http://lrn1jqabac.execute-api.ap-southeast-1.amazonaws.com",
    function(err, fqdn) {
        if (err) console.log("ERROR in updateDomainInUrlsCustomTable: " + err);
        else console.log(`Added domain: ${fqdn}`);
    });

// reading original url from database
ddbTableManager.readUrlsTable("gC",
    function(err, item) {
        if (err) console.log("ERROR in readUrlsTable: " + err);
        else console.log(`url: ${item.url}`);
    }
);

// Shorten url - get seed key and shorten url
ddbTableManager.acquireNextEncodingKey(function(err, seed) {
    if (err) console.log("ERROR in acquireNextEncodingKey: " + err);
    else {
        console.log(`next available seed: ${seed}`);
        // perform shortening logic and write url to db
        var urlkey = base62.encode(seed);
        ddbTableManager.writeUrlsTable(urlkey,
            "https://stackoverflow.com/questions/13053788/node-js-check-if-a-var-is-a-function",
            function(err, urlkey) {
                if (err) console.log("ERROR in writeUrlsTable: " + err);
                else console.log(urlkey);
            }
        );
    }
});