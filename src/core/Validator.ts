const Ajv = require('ajv');
const ajv = new Ajv();

// The JSON schema
const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    patternProperties: {
        '^.+$': {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                },
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                            },
                            id: {
                                type: 'string',
                                pattern: '^ns=\\d+;b=[0-9A-F]+$',
                            },
                            items: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: {
                                            type: 'string',
                                            pattern: '^ns=\\d+;b=[0-9A-F]+$',
                                        },
                                        name: {
                                            type: 'string',
                                        },
                                        value: {
                                            type: ['boolean', 'number'],
                                        },
                                        simulation: {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    enum: ['randomize', 'sinus'],
                                                },
                                                interval: {
                                                    type: 'number',
                                                },
                                                randomize: {
                                                    type: 'object',
                                                    properties: {
                                                        min: {
                                                            type: 'number',
                                                        },
                                                        max: {
                                                            type: 'number',
                                                        },
                                                    },
                                                    required: ['min', 'max'],
                                                },
                                                sinus: {
                                                    type: 'object',
                                                    properties: {
                                                        amplitude: {
                                                            type: 'number',
                                                        },
                                                        offset: {
                                                            type: 'number',
                                                        },
                                                    },
                                                    required: ['amplitude', 'offset'],
                                                },
                                            },
                                            required: ['type', 'interval'],
                                            oneOf: [{ required: ['randomize'] }, { required: ['sinus'] }],
                                        },
                                        valueMethods: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                enum: ['get', 'set'],
                                            },
                                        },
                                    },
                                    required: ['id', 'name', 'value', 'valueMethods'],
                                },
                            },
                        },
                        required: ['name', 'id', 'items'],
                    },
                },
            },
            required: ['name', 'items'],
        },
    },
    additionalProperties: false,
};

export function validateDeviceData(data: any) {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    return [valid, validate.errors];
}
