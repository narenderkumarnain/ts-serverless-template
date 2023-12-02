import { HealthCheckRequest } from './schema';
import { handlerPath } from '@libs/handler-resolver';

export const health =  {
    handler: `${handlerPath(__dirname)}/controller.HealthCheck`,
    events: [
      {
        http: {
          method: 'post',
          path: 'health-check',
          request: {
            schemas: {
              'application/json': HealthCheckRequest,
            },
          },
        },
      },
    ],
  };