import { main } from '@functions/importProductsFile/handler';
import { S3ManagementService } from '@services/s3-management.service';

const mockContext = {
  awsRequestId: '',
  invokeid: '',
  logGroupName: '',
  logStreamName: '',
  functionVersion: '',
  invokedFunctionArn: '',
  isDefaultFunctionVersion: true,
  functionName: '',
  memoryLimitInMB: '',
  callbackWaitsForEmptyEventLoop: false,
  identity: {
    cognitoIdentityId: '',
    cognitoIdentityPoolId: '',
  },
  clientContext: {
    client: {
      installationId: '',
      appTitle: '',
      appVersionName: '',
      appVersionCode: '',
      appPackageName: '',
    },
    env: {
      platformVersion: '',
      platform: '',
      make: '',
      model: '',
      locale: '',
    },
  },
  done: () => {},
  fail: () => {},
  succeed: () => {},
  getRemainingTimeInMillis: () => 1,
};
const mockCallback = undefined;

describe('importProductsFile function', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return signedUrl and 200 status code if query name was passed', async () => {
    const mockEvent = { queryStringParameters: { name: 'file.csv' } };

    S3ManagementService.prototype.getSignedUrl = jest.fn()
      .mockImplementationOnce((filePath: string) => Promise.resolve('path/' + filePath));

    const mockResponse = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify('path/file.csv'),
    };

    expect(await main(mockEvent, mockContext, mockCallback)).toEqual(mockResponse);
  });

  test('should return 400 error if query name wasn\'t passed', async () => {
    const mockEvent = { queryStringParameters: {} };

    const mockResponse = {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify('Please pass file name as a query parameter'),
    };

    expect(await main(mockEvent, mockContext, mockCallback)).toEqual(mockResponse);
  });

  test('should return 500 error if was an error during function execution', async () => {
    const mockEvent = { queryStringParameters: { name: 'file.csv' } };

    S3ManagementService.prototype.getSignedUrl = jest.fn().mockImplementationOnce((_filePath) => {
      throw new Error('test error');
    });

    const mockResponse = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify('Error during importProductsFile execution: Error: test error'),
    };

    expect(await main(mockEvent, mockContext, mockCallback)).toEqual(mockResponse);
  });
});
