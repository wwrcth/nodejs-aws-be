import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/main.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
      }
    }
  ]
}
