import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: {
        Ref: 'SQSQueue',
      },
      SNS_ARN: {
        Ref: 'createProductTopic',
      },
      PG_HOST,
      PG_PORT,
      PG_DATABASE,
      PG_USERNAME,
      PG_PASSWORD,
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: {
              'Fn::GetAtt': ['SQSQueue', 'Arn'],
            },
          },
          {
            Effect: 'Allow',
            Action: 'sns:*',
            Resource: {
              Ref: 'createProductTopic',
            },
          },
        ],
      },
    },
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalog-items-queue',
        },
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'create-product-topic',
        },
      },
      createProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          // todo: use env variable instead
          Endpoint: 'wwrcth@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic',
          },
          FilterPolicy: {
            price: [
              {"numeric": ["<", 30]}
            ]
          }
        },
      },
      createExpensiveProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'Katsiaryna_Nestserava@epam.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic',
          },
          FilterPolicy: {
            price: [
              {"numeric": [">=", 30]}
            ]
          }
        },
      },
    },
    Outputs: {
      CatalogItemsQueueUrl: {
        Value: {
          Ref: 'SQSQueue',
        },
        Export: {
          Name: 'CatalogItemsQueueUrl',
        },
      },
      CatalogItemsQueueArn: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        },
        Export: {
          Name: 'CatalogItemsQueueArn',
        },
      },
    },
  },
  functions: { getProductsList, getProductById, createProduct, catalogBatchProcess },
  useDotenv: true
};

module.exports = serverlessConfiguration;
