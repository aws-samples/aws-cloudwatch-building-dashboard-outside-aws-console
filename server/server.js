// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const AWS = require('aws-sdk');

exports.myHandler = function(event, context, callback) {

	var widgetDefinition = { MetricWidget: {} }

    widgetDefinition.MetricWidget = event.queryStringParameters.widgetDefinition ; 

	console.log('widgetDefinition: ' + JSON.stringify(widgetDefinition));

    var cloudwatch = new AWS.CloudWatch();
    cloudwatch.getMetricWidgetImage(widgetDefinition, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data.MetricWidgetImage);           // successful response
            var response = {
                statusCode: 200,
                headers: {
                'Content-Type' : 'image/png',
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : 'POST, GET, PUT, OPTIONS',
                'Access-Control-Allow-Headers' : 'x-api-key'
                },
                body: new Buffer(data.MetricWidgetImage).toString('base64')
    };
            callback(err, response);
        }
    });
  
}


