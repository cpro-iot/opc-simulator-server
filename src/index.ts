import OpcServer from './core/OpcServer';
import * as Validator from './core/Validator';
import devices from '../data/devices.json';
import { DeviceFolder } from '../@types';
import Logger from './core/Logger';

(async function () {
    const deviceObjects: Record<string, DeviceFolder> = devices as Record<string, any>;
    const [valid, errors] = Validator.validateDeviceData(devices);
    if (!valid) {
        Logger.error(`Faied to validate device data`);
        console.log(errors);
        process.exit(1);
    }
    await new OpcServer(deviceObjects).start();
})();
