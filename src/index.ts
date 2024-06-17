import OpcServer from './core/OpcServer';
import devices from '../data/devices.json';
import { DeviceFolder } from '../@types';

(async function () {
    const deviceObjects: Record<string, DeviceFolder> = devices as Record<string, any>;
    await new OpcServer(deviceObjects).start();
})();
