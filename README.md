# cloudwatch-log-retention

[![CI Workflow](https://github.com/previewme/cloudwatch-log-retention/actions/workflows/ci.yml/badge.svg)](https://github.com/previewme/cloudwatch-log-retention/actions/workflows/ci.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=previewme_cloudwatch-log-retention&metric=coverage)](https://sonarcloud.io/dashboard?id=previewme_cloudwatch-log-retention)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=previewme_cloudwatch-log-retention&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=previewme_cloudwatch-log-retention)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=previewme_cloudwatch-log-retention&metric=alert_status)](https://sonarcloud.io/dashboard?id=previewme_cloudwatch-log-retention)

Lambda function which automatically sets the retention period for all newly created Cloudwatch Log groups. When the retention period is modified or deleted, the function will reinstate the correct retention period.

## Configuration

### Environment variables

| Environment Variable | Description | Required |
| --- | --- | --- |
| RETENTION_PERIOD_IN_DAYS | The retention period to set on Cloudwatch Log groups in days | Yes |

## Build

To build the lambda function run the following.

```
npm install
npm run build
```

## Test

To run the tests.

```
npm test
```

## Package

The following will package the lambda function into a zip bundle to allow manual deployment.

```
zip -q -r dist/lambda.zip node_modules dist
```
