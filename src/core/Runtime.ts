import { EventEmitter } from 'node:events';
import OpcServer from './opc/OpcServer';
import Validator from './utils/Validator';
import Logger from './utils/Logger';
import { DeviceFolder } from '../../@types';

export default class Runtime extends EventEmitter {
    private devices: Record<string, DeviceFolder>;
    private OpcServer: OpcServer;
    private Validator: Validator;
    constructor({ devices, devicesSchema }: { devices: Record<string, DeviceFolder>; devicesSchema: object }) {
        super();
        this.devices = devices;
        this.Validator = new Validator(devicesSchema);
        this.OpcServer = new OpcServer(this.devices);
    }

    public async init() {
        try {
            this.Validator.validateDevicesSchema(this.devices);

            await this.OpcServer.start();
        } catch (error: any) {
            Logger.error(`Failed to start runtime`);
            this.emit('error', error);
            process.exit(1);
        }
    }
}
