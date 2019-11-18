'use strict';
var AWS = require('aws-sdk');

var configureEnvironment = function (environment) {
    const IS_OFFLINE = environment !== 'prod';
    if (IS_OFFLINE) {
        AWS.config.update({
            endpoint: "http://localhost:8000"
        });
    }
}

module.exports = { configureEnvironment: configureEnvironment }
