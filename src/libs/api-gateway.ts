/**
 * API Gateway and Controller wrappers.
 */
import middy, { MiddlewareObj, MiddyfiedHandler } from "@middy/core";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  Handler,
} from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import { ErrorHandler } from "src/middlewares/error-handler";

type ErrorResp = {
  error?: string;
}

export type APIResponse<R> = {
  statusCode?: number;
  response: R | ErrorResp;
};

export type RequestEvent<S> = Omit<APIGatewayProxyEvent, "body"> & {
  body: FromSchema<S>;
};

export type ControllerHandler<S, R extends Record<string, unknown>> = (
  event: RequestEvent<S>,
  context: Context
) => Promise<APIResponse<R>>;
export type EventHandler<S> = Handler<RequestEvent<S>, APIGatewayProxyResult>;

export type ControllerEventHandler<S> = (
  event: RequestEvent<S>,
  context: Context
) => Promise<APIGatewayProxyResult>;

export type Middleware<S> = MiddlewareObj<
  RequestEvent<S>,
  APIGatewayProxyResult
>;

export function formatResponse<R>(
  response: APIResponse<R>
): APIGatewayProxyResult {
  return {
    statusCode: response.statusCode ?? 200,
    body: JSON.stringify(response),
  };
}

export function Controller<S, R extends Record<string, unknown>>(
  ...middlewares: Middleware<S>[]
): (
  controllerHandler: ControllerHandler<S, R>
) => MiddyfiedHandler<RequestEvent<S>, APIGatewayProxyResult> {
  function controllerResultFormatter(
    controllerHandler: ControllerHandler<S, R>
  ): ControllerEventHandler<S> {
    return (event, context) => {
      return controllerHandler(event, context).then((resp) =>
        formatResponse(resp)
      );
    };
  }

  const commonMiddlewares: MiddlewareObj[] = [middyJsonBodyParser(), ErrorHandler()];
  return (controllerHandler) => {
    return middy()
      .handler(controllerResultFormatter(controllerHandler))
      .use(commonMiddlewares)
      .use(middlewares);
  };
}
