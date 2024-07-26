import { defineBackend } from "@aws-amplify/backend";
import { Stack, RemovalPolicy } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import * as osis from "aws-cdk-lib/aws-osis";

import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
});

const eventTable =
  backend.data.resources.cfnResources.amplifyDynamoDbTables["Event"];

// Ensure Point in Time Recovery (PITR) is enabled, which is crucial for the OpenSearch pipeline integration
eventTable.pointInTimeRecoveryEnabled = true;

// Enable DynamoDB streams to capture item changes that will be ingested into OpenSearch
eventTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE,
};

// Get the DynamoDB table ARN
const tableArn = backend.data.resources.tables["Event"].tableArn;
// Get the DynamoDB table name
const tableName = backend.data.resources.tables["Event"].tableName;

// Create OpenSearch Instance
// https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/#step-2-setting-up-the-opensearch-instance

// Get the data stack
const dataStack = Stack.of(backend.data);

// Create the OpenSearch domain
const openSearchDomain = new opensearch.Domain(
  dataStack,
  "FreedomOpenSearchDomain",
  {
    version: opensearch.EngineVersion.OPENSEARCH_2_11,
    nodeToNodeEncryption: true,
    encryptionAtRest: {
      enabled: true,
    },
  }
);

// Step 3: Setting Up Zero ETL from DynamoDB to OpenSearch
// https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/#step-3-setting-up-zero-etl-from-dynamodb-to-opensearch

// Get the S3Bucket ARN
const s3BucketArn = backend.storage.resources.bucket.bucketArn;
// Get the S3Bucket Name
const s3BucketName = backend.storage.resources.bucket.bucketName;

//Get the region
const region = dataStack.region;

// Create an IAM role for OpenSearch integration
const openSearchIntegrationPipelineRole = new iam.Role(
  dataStack,
  "FreedomOpenSearchIntegrationPipelineRole",
  {
    // OpenSearch Ingestion Service
    assumedBy: new iam.ServicePrincipal("osis-pipelines.amazonaws.com"),
    inlinePolicies: {
      openSearchPipelinePolicy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: ["es:DescribeDomain"],
            resources: [
              openSearchDomain.domainArn,
              openSearchDomain.domainArn + "/*",
            ],
            effect: iam.Effect.ALLOW,
          }),
          new iam.PolicyStatement({
            actions: ["es:ESHttp*"],
            resources: [
              openSearchDomain.domainArn,
              openSearchDomain.domainArn + "/*",
            ],
            effect: iam.Effect.ALLOW,
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "s3:GetObject",
              "s3:AbortMultipartUpload",
              "s3:PutObject",
              "s3:PutObjectAcl",
            ],
            resources: [s3BucketArn, s3BucketArn + "/*"],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "dynamodb:DescribeTable",
              "dynamodb:DescribeContinuousBackups",
              "dynamodb:ExportTableToPointInTime",
              "dynamodb:DescribeExport",
              "dynamodb:DescribeStream",
              "dynamodb:GetRecords",
              "dynamodb:GetShardIterator",
            ],
            resources: [
              tableArn,
              tableArn + "/*",
              tableArn + "/export/*",
              tableArn + "/stream/*",
            ],
          }),
        ],
      }),
    },
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonOpenSearchIngestionFullAccess"
      ),
    ],
  }
);

// Define OpenSearch index mappings
// https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/#step-3b-opensearch-service-pipeline
const indexName = "event";

const indexMapping = {
  settings: {
    number_of_shards: 1,
    number_of_replicas: 0,
  },
  mappings: {
    properties: {
      id: {
        type: "keyword",
      },
      name: {
        type: "text",
      },
      host: {
        type: "text",
      },
      description: {
        type: "text",
      },
      locationDescription: {
        type: "text",
      },
      rsvp: {
        type: "boolean",
      },
      gov: {
        type: "boolean",
      },
      source: { type: "text" },
      website: { type: "text" },
      types: { type: "text" },
      location: { type: "geo_point" },
      dates: { type: "date", format: "year_month_day" },
      times: { type: "date", format: "time_no_millis" },
    },
  },
};

// OpenSearch template definition
const openSearchTemplate = `
version: "2"
dynamodb-pipeline:
  source:
    dynamodb:
      acknowledgments: true
      tables:
        - table_arn: "${tableArn}"
          stream:
            start_position: "LATEST"
          export:
            s3_bucket: "${s3BucketName}"
            s3_region: "${region}"
            s3_prefix: "${tableName}/"
      aws:
        sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
        region: "${region}"
  sink:
    - opensearch:
        hosts:
          - "https://${openSearchDomain.domainEndpoint}"
        index: "${indexName}"
        index_type: "custom"
        template_content: |
          ${JSON.stringify(indexMapping)}
        document_id: '\${getMetadata("primary_key")}'
        action: '\${getMetadata("opensearch_action")}'
        document_version: '\${getMetadata("document_version")}'
        document_version_type: "external"
        bulk_size: 4
        aws:
          sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
          region: "${region}"
`;

// Create a CloudWatch log group
const logGroupName = "/aws/vendedlogs/OpenSearchService/pipelines/freedom-dev";
const logGroup = new logs.LogGroup(dataStack, "LogGroup", {
  logGroupName: logGroupName,
  removalPolicy: RemovalPolicy.DESTROY,
});

// Create an OpenSearch Integration Service pipeline
const cfnPipeline = new osis.CfnPipeline(
  dataStack,
  "FreedomIntegrationPipeline",
  {
    maxUnits: 4,
    minUnits: 1,
    pipelineConfigurationBody: openSearchTemplate,
    pipelineName: "freedom-ddb-integration",
    logPublishingOptions: {
      isLoggingEnabled: true,
      cloudWatchLogDestination: {
        logGroup: logGroupName,
      },
    },
  }
);

// Add OpenSearch data source
// https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/#step-4-expose-new-queries-on-opensearch
const osDataSource = backend.data.addOpenSearchDataSource(
  "osDataSource",
  openSearchDomain
);
