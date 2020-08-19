# Example of a custom CDK construct library for S3 - Lambda - S3 integration. 

This is a simple demo to show how to create, publish and use your custom CDK construct libraries.
In this project we have a construct that contains three resources:
* source S3 bucket
* processing lambda function
* destination S3 bucket

The user of the construct only need to provide code and handler name and eveything else will be created by the construct:
Here is a python example how this construct will be used by developers:

```python
from aws_cdk import core
from aws_cdk.aws_lambda import AssetCode
from devax import s3_lamdba_s3

class CdkCustomConstructExampleStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)
        lambda_code = AssetCode.from_asset('code')
        s3_lamdba_s3.S3LambdaS3(self, 'customLibraryLambda', code=lambda_code, handler='app.handler')
```

To demonstrate the ability to leverage CDK abstractions we have the following constraints about the construct:
* s3 buckets are versioned and encrypted by default. 
* lambda function runtime is always python in version 3.8, so there is no need to pass it from the user
* the lambda function can only read from the source S3 bucket
* the lambda function can only write/delete from the destination S3 bucket
* writing an object to a source S3 bucket will trigger the lambda function

## Getting started

 * `npm install`    install the node modules
 * `npm run build`  compile typescript to js
 * `npm run test`   run tests 
 
## JSII setup

* install [jsii](https://github.com/aws/jsii) this will include [jsii-pacmak](https://github.com/aws/jsii/tree/master/packages/jsii-pacmak)
* add the following required configuration to your `package.json`
```json
{
...
  "author": {
    "name": "YOUR NAME"
  },
  "repository": {
    "url": "https://github.com/YOUR_GITHUB_REPO/s3-lambda-s3",
    "type": "git"
  },
  "license": "Apache-2.0"
...
}
```
* you need to provide your name, license, and repository information to be able to publish a software package
* add `jsii` configuration to your `package.json`, in this example we use only python, but you can also generate packages for java and c#, check the [configuration documentation](https://github.com/aws/jsii/blob/master/docs/configuration.md) 
```json
  "jsii": {
    "outdir": "dist",
    "targets": {
      "python": {
        "distName": "PACKAGENAME.s3-lambda-s3",
        "module": "PACKAGENAME.s3_lambda_s3"
      }
    }
  },
```

## Build and publish your package

* `jsii` will generate a `.jsii` file in your root project folder
* `jsii-pacmak` will read the `.jsii` config and generate binary files that were specified in the jsii block in `package.json`
* `twine upload DIR` will [upload a python wheel](https://twine.readthedocs.io/en/latest/) to a public repository, you can also use you private repo such as Nexus, Artifactory or AWS CodeArtifact
