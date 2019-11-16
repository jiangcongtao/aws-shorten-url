'use strict';

var AWS = require('aws-sdk'),
    ddbClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
    console.log("event: \n" + JSON.stringify(event, null, 2));
    console.log("context: \n" + JSON.stringify(context, null, 2));

    var params = {
        TableName: process.env.TABLE_CUSTOM_DOMAIN || 'urls-domain',
        Key: {
            "domainid": '1'
        }
    }

    ddbClient.get(params, function(err, data) {
        console.log(data);
        callback(err, data.Item);
    });
};