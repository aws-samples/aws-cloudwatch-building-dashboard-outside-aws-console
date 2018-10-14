## Amazon CloudWatch Building Dashboards Outside the AWS Console

Code samples related to "Building a CloudWatch Dashboard Outside of the AWS Console" blog post published on the [AWS DevOps blog](https://aws.amazon.com/blogs/devops/building-an-amazon-cloudwatch-dashboard-outside-of-the-aws-management-console/). This post demonstrates how to build a custom monitoring dashboard outside of the AWS Console by leveraging snapshot graphs.

## License

This library is licensed under the Apache 2.0 License. 

## Setup Instructions

This project includes client code which is packaged using WebPack into a Javascript embeddable widget. There is a sample HTML page index.html that has the resulting widget embedded. 

The server code is intended to run as an AWS Lambda function behind an API GateWay. The Lambda function retrieves the requested CloudWatch widget by calling the CloudWatch [GetMetricWidgetImage](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_GetMetricWidgetImage.html) API.  

### Server Setup: 

1. Download the repository. 
2. Navigate to **./server** and run `npm install`. 
3. From the server folder, run `zip -r snapshotwidgetdemo.zip ./*`
4. Upload **snapshotwidgetdemo.zip** to any S3 bucket. 
5. Upload **./server/apigateway-lambda.json** to any S3 bucket. 
6. Navigate to the Cloud Formation console and Create Stack. 
        a) Point the new stack to the S3 location from step 5. 
        b) During setup, you will be asked for the Lambda S3 bucket name from step 4.

The Cloud Formation script should create the following:
1. EC2 instance to monitor. Instance is in a VPC. 
2. API GateWay endpoint for the client side widget to communicate with. 
3. Lambda function that sits behind the API GateWay and retreives the snapshot graph from the CloudWatch API.

### Client Setup:

1. Navigate to **./client** and run `npm install`.
2. Edit **./demo/index.html** to add the API Gateway endpoint and API key that are output by the Cloud Formation script (step 6 above).
3. Build the component using WebPack `./node_modules/.bin/webpack --config webpack.config.js`
4. Server the demo webpage on localhost `./node_modules/.bin/webpack-dev-server --open`

The browser should open automatically at index.html. The page contains 2 embedded snapshot graphs displaying the CPUUtilization and CPUCreditUsage metrics your EC2. 

### Troubleshooting:

1. View the API GateWay log file in CloudWatch. 
2. View the Lambda log file in CloudWatch. 

See the CloudWatch API documentation for [GetMetricWidgetImage](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_GetMetricWidgetImage.html) for more information.


## Cross-account Dashboards

The widget definition JSON supports an optional parameter called accountId. This defaults to the account the Lambda is running in. You can use the accountId parameter to specify the account where the metric(s) live. Enabling you to build cross-account dashboards. 

`"accountId": 1234567`

### Cross-account Permissions

The Lambda attempts to assume a role called CloudWatchSnapshotGraphs in the accounts you define in the widget. To build a cross-account dashboard you first need to establish a trust relationship between the accounts running the Lambda and the account ids specified in the widget definition(s). 

1. Ensure that the role running the Lambda has permissions to assume the role in any account.
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "sts:AssumeRole",
                "sts:GetFederationToken"
            ],
            "Resource": "arn:aws:iam::*:role/CloudWatchSnapshotGraphs"
        }
    ]
}
```
2. Create a role called CloudWatchSnapshotGraphs in each account you want to retrieve charts from. Ensure that the role provides read-only access to CloudWatch and has a trust relationship with the account the Lambda is being executed.
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<YOUR LAMBDA ACCOUNTID>:root"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```


