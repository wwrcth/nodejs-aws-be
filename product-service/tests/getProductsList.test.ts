import { main } from '../src/functions/getProductsList/handler';
import { productsList } from '../src/mocks/products-list';

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
const mockEvent = {};
const mockCallback = undefined;

describe('getProductList function', () => {
  test('should return products list mock and 200 status code', async () => {
    const mockResponse = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(productsList),
    };

    expect(await main(mockEvent, mockContext, mockCallback)).toEqual(mockResponse);
  });
});
