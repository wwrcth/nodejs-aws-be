import { main } from '../src/functions/getProductById/handler';
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
const mockCallback = undefined;

describe('getProductById function', () => {
  test('should return existent product and 200 status code', async () => {
    const mockEvent = { pathParameters: { productId: productsList[0].id } };
    const mockResponse = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(productsList[0]),
    };

    expect(await main(mockEvent, mockContext, mockCallback)).toEqual(mockResponse);
  });

  test('should return not found message and 404 status code in case of wrong id', async () => {
    const mockEvent = { pathParameters: { productId: 'wrong-product-id' } };
    const mockResponse = {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Product not found' }),
    };

    expect(await main(mockEvent, mockContext, mockCallback)).toEqual(mockResponse);
  });
});
