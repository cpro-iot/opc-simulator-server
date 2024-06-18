import devices from '../data/devices.json';
import devicesSchema from '../schemata/devices.json';
import Logger from './core/Logger';
import Runtime from './core/Runtime';

function main() {
    const runtime = new Runtime({ devices: devices as Record<string, any>, devicesSchema: devicesSchema });
    runtime.init().catch((error) => {
        Logger.error(error.message);
    });
}

main();
