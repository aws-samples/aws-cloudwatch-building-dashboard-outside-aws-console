## Amazon CloudWatch Building Dashboards Outside the AWS Console

Code samples related to "Building a CloudWatch Dashboard Outside of the AWS Console" blog post published on the AWS DevOps blog. This post demonstrates how to build a custom monitoring dashboard outside of the AWS Console by leveraging snapshot graphs.

## License

This library is licensed under the Apache 2.0 License. 

## Setup Instructions

This project includes client code which is packaged using WebPack into a Javascript embeddable widget. There is a sample HTML page index.html that has the resulting widget embedded. 

The server code is intended to run as an AWS Lambda function behind an API GateWay. The Lambda function retreives the requested CloudWatch widget by calling the CloudWatch GetMetricWidgetImage API.  

Full instructions can be found in the associated blog post on the AWS DevOps blog. 

### Server Setup: 

1. Download the repository. 
2. Run 'npm install' in the server sub-folder to create the dependencies. 
3. From the server folder, ZIP the project 'zip -r snapshotwidgetdemo.zip ./*'
4. Upload the ZIP file to an S3 bucket. 
5. Upload the Cloud Formation script (apigateway-lambda.json) from the server folder to an S3 bucket. 
6. Execute the Cloud Formation script. There is an input parameter for the Lambda S3 bucket name (step 4).

The Cloud Formation script should create the following:
1. EC2 instance to monitor. Instance is in a VPC. 
2. API GateWay endpoint for the client side widget to communicate with. 
3. Lambda function that sits behind the API GateWay and retreives the snapshot graph from the CloudWatch API.

### Client Setup:

1. Run 'npm install' in the client sub-folder to create the dependencies.
2. Edit ./demo/index.html to add the API Gateway endpoint and API key that are output by the Cloud Formation script (step 6 above).
3. Build the component using WebPack './node_modules/.bin/webpack --config webpack.config.js'
4. Server the demo webpage on localhost - './node_modules/.bin/webpack-dev-server --open'

You should see index.html in a browser. The page contains 1 embedded snapshot graph. 

### Troubleshooting:

1. View the API GateWay log file in CloudWatch. 
2. View the Lambda log file in CloudWatch. 

See the CloudWatch API documentation for [GetMetricWidgetImage](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_GetMetricWidgetImage.html) for more information. 

