import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response?: Record<string, unknown> | any, statusCode = 200) => {
  return {
    statusCode,
    ...(response && { body: JSON.stringify(response) })
  }
}

export const formatJSONError = (response: any, statusCode = 500) => {
  return {
    statusCode,
    body: JSON.stringify(response)
  }
}
