import Logger from '../core/Logger';
import { ErrorObject } from 'ajv';

export default class CproValidationError extends Error {
    constructor(message: string, errors: ErrorObject<string, Record<string, any>, unknown>[] | null | undefined) {
        super(message);
        this.printValidationError(message, errors);
    }

    private printValidationError(message: string, errors: ErrorObject<string, Record<string, any>, unknown>[] | null | undefined) {
        for (const key in errors) {
            // @ts-ignore
            const value = errors[key];
            Logger.error(`${value.instancePath} - ${value.message}`);
        }
    }
}
