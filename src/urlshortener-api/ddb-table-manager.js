'use strict';

var AWS = require('aws-sdk');

// define table names
const UrlsKeySeedTableName = 'urls-keyseed';
const UrlsTableName = 'urls';
const UrlsCustomDomainTableName = 'urls-domain';

// define columns
const UrlsKeySeedTableColCounter = 'counter'
const UrlsKeySeedTableColSeed = 'seed';
const UrlsKeySeedColCreatedTime = 'updatetime';

const UrlsTableColUrlKey = 'urlkey';
const UrlsTableColUrl = 'url';
const UrlsTableColCreatedTime = 'createtime';

const UrlsCustomDomainTableColKey = "domainid"

// value
const UrlsKeySeedTableColSeed_StartValue = 1000;
const UrlsKeySeedTableColCounter_PartKey = 1;
const UrlsCustomDomainTableColKey_PartKey = "1";

var createUrlsKeySeedTableIfNotExist = function() {
    var dynamodb = new AWS.DynamoDB();
    var paramsUrlsKeySeedTableSpec = {
        TableName: process.env.TABLE_URLS_KEYSEED || UrlsKeySeedTableName,
        KeySchema: [
            { AttributeName: UrlsKeySeedTableColCounter, KeyType: "HASH" }
        ],
        AttributeDefinitions: [
            { AttributeName: UrlsKeySeedTableColCounter, AttributeType: "N" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };

    var paramsListTables = {}
    dynamodb.listTables(paramsListTables, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            return;
        } else {
            const exist = data.TableNames.filter(name => { return name === UrlsKeySeedTableName; }).length > 0;
            console.log(`exist: ${exist}`)
            if (!exist) {
                dynamodb.createTable(paramsUrlsKeySeedTableSpec, function(err, data) {
                    if (err) {
                        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));

                        setTimeout(function() {
                            // do initialization                            
                            initializeUrlsKeySeedTable();
                        }, 15000);
                    }
                });
            } else {
                console.log(`Found table '${UrlsKeySeedTableName}'`);
            }
        }
    });
};

var createUrlsTableIfNotExist = function() {
    var dynamodb = new AWS.DynamoDB();
    var paramsUrlsKeySeedTableSpec = {
        TableName: process.env.TABLE_URLS || UrlsTableName,
        KeySchema: [
            { AttributeName: UrlsTableColUrlKey, KeyType: "HASH" }
        ],
        AttributeDefinitions: [
            { AttributeName: UrlsTableColUrlKey, AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };

    var paramsListTables = {}
    dynamodb.listTables(paramsListTables, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            return;
        } else {
            const exist = data.TableNames.filter(name => { return name === UrlsTableName; }).length > 0;
            console.log(`exist: ${exist}`)
            if (!exist) {
                dynamodb.createTable(paramsUrlsKeySeedTableSpec, function(err, data) {
                    if (err) {
                        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
                    }
                });
            } else {
                console.log(`Found table '${UrlsTableName}'`);
            }
        }
    });
};

var createUrlsCustomDomainTableIfNotExist = function() {
    var dynamodb = new AWS.DynamoDB();
    var paramsUrlsCustomDomainTableSpec = {
        TableName: process.env.TABLE_CUSTOM_DOMAIN || UrlsCustomDomainTableName,
        KeySchema: [
            { AttributeName: UrlsCustomDomainTableColKey, KeyType: "HASH" }
        ],
        AttributeDefinitions: [
            { AttributeName: UrlsCustomDomainTableColKey, AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };

    var paramsListTables = {}
    dynamodb.listTables(paramsListTables, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            return;
        } else {
            const exist = data.TableNames.filter(name => { return name === UrlsCustomDomainTableName; }).length > 0;
            console.log(`exist: ${exist}`)
            if (!exist) {
                dynamodb.createTable(paramsUrlsCustomDomainTableSpec, function(err, data) {
                    if (err) {
                        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
                    }
                });
            } else {
                console.log(`Found table '${UrlsCustomDomainTableName}'`);
            }
        }
    });
};

var initializeUrlsKeySeedTable = function() {
    var AWS = require("aws-sdk");
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: process.env.TABLE_URLS_KEYSEED || UrlsKeySeedTableName,
        Item: {
            "counter": UrlsKeySeedTableColCounter_PartKey,
            "seed": UrlsKeySeedTableColSeed_StartValue,
            "createtime": Date().toString()
        }
    };

    console.log("Adding a new item..." + JSON.stringify(params));
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
};


var updateDomainInUrlsCustomTable = function(fqdn, callback) {
    var AWS = require("aws-sdk");
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: process.env.TABLE_CUSTOM_DOMAIN || UrlsCustomDomainTableName,
        Item: {
            "domainid": UrlsCustomDomainTableColKey_PartKey,
            "fqdn": fqdn,
            "updatetime": Date().toString()
        }
    };

    console.log("Adding a new item..." + JSON.stringify(params));
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("updateDomainInUrlsCustomTable - Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            if (typeof callback === 'function') {
                callback(err, null);
            }
        } else {
            console.log("updateDomainInUrlsCustomTable - Added item:", JSON.stringify(data, null, 2));
            if (typeof callback === 'function') {
                callback(null, fqdn);
            }
        }
    });
};

var writeUrlsTable = function(urlkey, url, callback) {
    var AWS = require("aws-sdk");
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: process.env.TABLE_URLS || UrlsTableName,
        Item: {
            "urlkey": urlkey,
            "url": url,
            "createtime": Date().toString()
        }
    };

    console.log("Add item: " + JSON.stringify(params));
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            if (typeof callback === 'function') {
                callback(err, null);
            }
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            if (typeof callback === 'function') {
                callback(null, urlkey);
            }
        }
    });
};

var readUrlsTable = function(urlkey, callback) {
    var AWS = require("aws-sdk");
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: process.env.TABLE_URLS || UrlsTableName,
        Key: {
            "urlkey": urlkey
        }
    };

    console.log("Get item for key: " + JSON.stringify(params));
    docClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            if (typeof callback === 'function') {
                callback(err, null);
            }
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            if (typeof callback === 'function') {
                callback(null, data.Item);
            }
        }
    });
};

var acquireNextEncodingKey = function(callback) {
    var AWS = require("aws-sdk");
    var docClient = new AWS.DynamoDB.DocumentClient();

    // Atomic update 
    var params = {
        TableName: process.env.TABLE_URLS_KEYSEED || UrlsKeySeedTableName,
        Key: {
            "counter": 1
        },
        UpdateExpression: 'SET seed = seed + :inc',
        ExpressionAttributeValues: { ':inc': 1 },
        ReturnValues: "UPDATED_NEW"
    };

    docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            if (typeof callback === 'function') {
                callback(err, null);
            }
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            if (typeof callback === 'function') {
                callback(null, data.Attributes.seed);
            }
        }
    });

};

module.exports = {
    createUrlsKeySeedTableIfNotExist: createUrlsKeySeedTableIfNotExist,
    createUrlsTableIfNotExist: createUrlsTableIfNotExist,
    createUrlsCustomDomainTableIfNotExist: createUrlsCustomDomainTableIfNotExist,
    initializeUrlsKeySeedTable: initializeUrlsKeySeedTable,
    updateDomainInUrlsCustomTable: updateDomainInUrlsCustomTable,
    writeUrlsTable: writeUrlsTable,
    readUrlsTable: readUrlsTable,
    acquireNextEncodingKey: acquireNextEncodingKey,
    UrlsKeySeedTableName: UrlsKeySeedTableName,
    UrlsTableName: UrlsTableName
}