'use strict';

var AWS = require('aws-sdk'),
    ddbClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
    console.log("event: \n" + JSON.stringify(event, null, 2));
    console.log("context: \n" + JSON.stringify(context, null, 2));
    console.log("event.body: \n" + event.body);

    var fqdn = event.fqdn == undefined ? JSON.parse(event.body).fqdn : event.fqdn;

    var params = {
        TableName: process.env.TABLE_CUSTOM_DOMAIN || 'urls-domain',
        Item: {
            "domainid": '1',
            "fqdn": fqdn,
            "updatetime": Date().toString()
        }
    }

    ddbClient.put(params, function(err, data) {
        callback(err, data);
    });
};