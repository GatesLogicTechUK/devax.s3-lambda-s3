import * as cdk from '@aws-cdk/core';
import {Bucket, BucketEncryption} from "@aws-cdk/aws-s3";
import {AssetCode, Function, Runtime} from "@aws-cdk/aws-lambda";

export interface S3LambdaS3Props {
  readonly handler: string
  readonly code: AssetCode
}

export class S3LambdaS3 extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: S3LambdaS3Props) {
    super(scope, id);

    const srcS3Bucket = new Bucket(this, 'sourceBucket', {
      encryption: BucketEncryption.KMS_MANAGED
    });

    const destS3Bucket = new Bucket(this, 'destinationBucket', {
      encryption: BucketEncryption.KMS_MANAGED
    });

    const handler = new Function(this, 'handlerLambdaFunction', {
      code: props.code,
      handler: props.handler,
      runtime: Runtime.PYTHON_3_8,
    });

    srcS3Bucket.grantRead(handler.grantPrincipal);

    destS3Bucket.grantWrite(handler.grantPrincipal);

  }
}
