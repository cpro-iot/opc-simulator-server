import Ajv, { ValidateFunction } from 'ajv';
import CproValidationError from '../errors/CproValidationError';

export default class Validator {
    private validate: ValidateFunction<unknown>;

    constructor(schema: object) {
        this.validate = new Ajv().compile(schema);
    }

    public validateDevicesSchema(data: any) {
        const result = this.validate(data);
        if (!result) {
            throw new CproValidationError('Failed to validate device data', this.validate.errors);
        }
        return [result, this.validate.errors];
    }
}
