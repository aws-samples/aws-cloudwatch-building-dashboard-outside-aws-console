// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const AWS = require('aws-sdk');

exports.myHandler = function(event, context, callback) {

	var widgetDefinition = { MetricWidget: {} } ;

    widgetDefinition.MetricWidget = event.queryStringParameters.widgetDefinition ; 

    let accountId = event.queryStringParameters.accountId ;

    console.log('accountId: ' + accountId);
    console.log('widgetDefinition: ' + JSON.stringify(widgetDefinition));

    let role = event.queryStringParameters.role ;
    let thisAcctId = context.invokedFunctionArn.split(":")[4] ;

    if (accountId !== null && accountId !== '' && accountId != thisAcctId) {

        let roleArn = `arn:aws:iam::${accountId}:role/${role}`;
        console.log("Assuming role: "+roleArn);

        let sts = new AWS.STS() ;
        sts.assumeRole({RoleArn: roleArn, RoleSessionName: 'SnapshotGraphs'}, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {           // successful response
                console.log(JSON.stringify(data))
                let tempCredentials = new AWS.Credentials(data.Credentials.AccessKeyId, 
                                                          data.Credentials.SecretAccessKey, 
                                                          data.Credentials.SessionToken)
                getWidget(widgetDefinition, callback, tempCredentials);
            }
        });
    } else 
        getWidget(widgetDefinition, callback);
  
}

getWidget = function(widgetDefinition, callback, tempCredentials) {
    
    let cloudWatch = tempCredentials ? new AWS.CloudWatch({credentials:tempCredentials}) : new AWS.CloudWatch();

     cloudWatch.getMetricWidgetImage(widgetDefinition, function (err, data) {
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


