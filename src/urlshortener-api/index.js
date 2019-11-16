'use strict;'

var base62 = require('base-62.js');
var configurator = require('./config');
var ddbTableManager = require('./ddb-table-manager');
var AWS = require('aws-sdk'),
    ddbClient = new AWS.DynamoDB.DocumentClient();

function shorten_url_with_custom_domain(njcallback) {
    var params = {
        TableName: "urls-domain",
        Key: {
            "domainid": "1"
        }
    };

    console.log("Get custom domain params: " + JSON.stringify(params));
    ddbClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            if (typeof njcallback === 'function') {
                njcallback(err, null);
            }
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            if (typeof njcallback === 'function') {
                njcallback(null, data.Item.fqdn);
            }
        }
    });
}

var handler_shortenurl_func = function(event, context, callback) {
    console.log(`event: ${JSON.stringify(event)}`)
    console.log(`body: ${event.body}`)

    shorten_url_with_custom_domain(function(err, customdomain) {
        if (err) {
            callback(err);
            return
        }
        console.log(`Custom Domain: ${customdomain}`)
        var url = event.url == undefined ? JSON.parse(event.body).url : event.url;

        ddbTableManager.acquireNextEncodingKey(function(err, seed) {
            if (err) {
                console.log("ERROR in acquireNextEncodingKey: " + err);
                callback(err);
            } else {
                console.log(`next available seed: ${seed}`);
                // perform shortening logic and write url to db
                var urlkey = base62.encode(seed);
                ddbTableManager.writeUrlsTable(urlkey,
                    url,
                    function(err, urlkey) {
                        if (err) {
                            console.log("ERROR in writeUrlsTable: " + err);
                            callback(err);
                        } else {
                            console.log(urlkey);
                            const status200Reponse = {
                                statusCode: 200,
                                customdomain: customdomain,
                                urlkey: urlkey,
                                url: url,
                                shorturl: `${customdomain}/${urlkey}`
                            };

                            callback(null, status200Reponse);
                        }
                    }
                );
            }
        });
    });
};
var handler_redirect_func = function(event, context, callback) {
    console.log(`event: ${JSON.stringify(event)}`)
    console.log(`body: ${event.body}`)
    console.log(`urlkey: ${event.urlkey}`);

    var urlkey = event.urlkey == undefined ? JSON.parse(event.body).urlkey : event.urlkey;

    ddbTableManager.readUrlsTable(urlkey,
        function(err, item) {
            if (err) {
                console.log("ERROR in readUrlsTable: " + err);
                callback(err);
            } else {
                console.log(`urlkey: ${urlkey}, url: ${item.url}`);
                var response = {
                    statusCode: 301,
                    headers: {
                        "Location": item.url
                    },
                    location: item.url
                };
                callback(null, response)
            }
        }
    );
};

module.exports = {
    handler_shortenurl: handler_shortenurl_func,
    handler_redirect: handler_redirect_func
}