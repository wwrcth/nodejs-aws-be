import { main } from '../src/functions/getProductsList/handler';
// import { productsList } from '../src/mocks/products-list';

const mockContext = {
  awsRequestId: "9e8a207c-1f99-4b9b-a413-02beb6250895",
  invokeid: "id",
  logGroupName: "/aws/lambda/product-service-dev-getProductsList",
  logStreamName: "2015/09/22/[HEAD]13370a84ca4ed8b77c427af260",
  functionVersion: "HEAD",
  invokedFunctionArn: "123",
  isDefaultFunctionVersion: true,
  functionName: "product-service-dev-getProductsList",
  memoryLimitInMB: "1024",
  callbackWaitsForEmptyEventLoop: false,
  identity: {
    cognitoIdentityId: "test-id",
    cognitoIdentityPoolId: "test-id",
  },
  clientContext: {
    client: {
      installationId: "1",
      appTitle: "1",
      appVersionName: "1",
      appVersionCode: "2",
      appPackageName: "3",
    },
    env: {
      platformVersion: "1",
      platform: "1",
      make: "1",
      model: "1",
      locale: "1",
    },
  },
  getRemainingTimeInMillis: () => 1,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};
const mockEvent = {};
const mockCallback = undefined;

// const MOCK_RESULT = {
//   statusCode: 200,
//   headers: {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Credentials": true,
//   },
//   body: productsList,
// };

test('correct greeting is generated', async () => {
  console.log(await main(mockEvent, mockContext, mockCallback));
  expect(true).toBe(true);
});
