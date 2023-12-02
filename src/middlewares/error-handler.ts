/**
 * Error Handler Middleware.
 */

import { Middleware } from "@libs/api-gateway";
import { CustomError } from "@libs/errors";


export function ErrorHandler<S>(): Middleware<S> {
    return {
        onError: async (request) => {
            request.response = request.response ?? {
                statusCode: (request.error as CustomError).statusCode ?? 500,
                body: JSON.stringify({
                    error: `Message: ${request.error.message}`
                })
            }
        }
    }
}