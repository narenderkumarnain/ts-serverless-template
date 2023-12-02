import { Controller } from "@libs/api-gateway";
import { HealthCheckRequest, HealthCheckResponse } from "./schema";

export const HealthCheck = Controller<
  typeof HealthCheckRequest,
  HealthCheckResponse
>()(async () => {
  return {
    response: {
      message: "good health",
    },
  };
});
