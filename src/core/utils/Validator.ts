import Ajv, { ValidateFunction } from 'ajv';
import CproValidationError from '../../errors/CproValidationError';
import Logger from './Logger';

export default class Validator {
    private validate: ValidateFunction<unknown>;

    constructor(schema: object) {
        this.validate = new Ajv().compile(schema);
    }

    public validateDevicesSchema(data: any) {
        Logger.info('Validating OPC UA device data ...');
        const result = this.validate(data);
        if (!result) {
            throw new CproValidationError('Failed to validate OPC UA device data', this.validate.errors);
        }
        Logger.info('OPC UA device data is valid');
    }
}
