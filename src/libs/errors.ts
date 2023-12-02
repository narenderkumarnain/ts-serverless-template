/**
 * Custom Error Types
 */

export abstract class CustomError extends Error {
    abstract statusCode: number;

    protected constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }

}
export class InvalidRequest extends CustomError {
    statusCode = 400;
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidRequest.prototype);
    }
}