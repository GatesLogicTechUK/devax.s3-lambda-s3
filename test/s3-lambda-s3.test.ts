import * as cdk from '@aws-cdk/core';
import {App, Stack} from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import * as S3LambdaS3 from '../lib/index';
import {AssetCode} from "@aws-cdk/aws-lambda";
import {stringLike, SynthUtils} from "@aws-cdk/assert";

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new cdk.App();
  stack = new cdk.Stack(app, "TestStack");
  new S3LambdaS3.S3LambdaS3(stack, 'myTestConstruct', {
    code: AssetCode.fromAsset('test/test_lambda'),
    handler: 'app.handler'
  });
})


test('can be created with two Buckets', () => {
  expect(stack).toCountResources("AWS::S3::Bucket", 2);
});



test('s3 buckets are encrypted by default', ()=> {
  expect(stack).toHaveResource("AWS::S3::Bucket", {
    "BucketEncryption": {
      "ServerSideEncryptionConfiguration": [
        {
          "ServerSideEncryptionByDefault": {
            "SSEAlgorithm": "aws:kms"
          }
        }
      ]
    }
  });
})

test('lambda has the python runtime', ()=> {
  expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
    Runtime: "python3.8"
  });
})

test('lambda has the right permissions for s3', () => {
  console.dir(JSON.stringify(SynthUtils.toCloudFormation(stack), null, 2))

  // IAM Policy restricted to read from source and write to destination
  expect(stack).toHaveResourceLike("AWS::IAM::Policy", {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            "s3:GetObject*",
            "s3:GetBucket*",
            "s3:List*"
          ],
          Effect: "Allow",
          Resource: [{"Fn::GetAtt": [stringLike("*sourceBucket*"), "Arn"]}]
        },
        {
          Action: [
            "s3:DeleteObject*",
            "s3:PutObject*",
            "s3:Abort*"
          ],
          Effect: "Allow",
          Resource: [
            {
              "Fn::GetAtt": [stringLike("*destinationBucket*"), "Arn"]
            },
            {
              "Fn::Join": ["", [{"Fn::GetAtt": [stringLike("*destinationBucket*"), "Arn"]}, "/*"]]
            }
          ]
        }

      ]
    }
  })

})