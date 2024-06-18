import OpcServer from './core/OpcServer';
import Validator from './core/Validator';
import devices from '../data/devices.json';
import devicesSchema from '../schemata/devices.json';
import { DeviceFolder } from '../@types';
import Logger from './core/Logger';

(async function () {
    try {
        const deviceObjects: Record<string, DeviceFolder> = devices as Record<string, any>;
        new Validator(devicesSchema).validateDevicesSchema(deviceObjects);
        await new OpcServer(deviceObjects).start();
    } catch (error: any) {
        Logger.error(`Failed to start server - ${error?.message ?? error}`);
        process.exit(1);
    }
})();
