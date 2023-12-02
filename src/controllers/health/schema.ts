export const HealthCheckRequest =  {
    type: "object",
    properties: {
      name: { type: 'string' }
    },
    required: ['name']
  } as const;

export type HealthCheckResponse = {
  message: string;
};