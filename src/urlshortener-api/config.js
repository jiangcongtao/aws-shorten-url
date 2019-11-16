'use strict';
var AWS = require('aws-sdk');

var configureEnvironment = function (environment) {
    const IS_OFFLINE = environment !== 'prod';
    if (IS_OFFLINE) {
        AWS.config.update({
            endpoint: "http://localhost:8000"
        });
        // AWS.config.update({
        //     region: "ap-southeast-1",
        //     secretAccessKey: "cKNKrIwbrV0SC8+mIisqcgAuyR5+osr81563UIto",
        //     accessKeyId: "AKIA5KYVIGTDEBD3JMYO"
        // });
    }
}

module.exports = { configureEnvironment: configureEnvironment }