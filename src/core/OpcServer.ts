import { OPCUAServer } from 'node-opcua';
import ServerDeviceObject from './ServerDeviceObject';
import { DeviceFolder } from '../../@types';
import Logger from './Logger';

export default class OpcServer {
    private server: OPCUAServer;
    private devices: Record<string, DeviceFolder>;

    constructor(
        devices: Record<string, DeviceFolder>,
        {
            port,
        }: {
            port: number;
        } = {
            port: 4840,
        },
    ) {
        this.server = new OPCUAServer({
            port: port || 4840,
            resourcePath: '/UA/Cpro',
            buildInfo: {
                productName: 'Cpro OPC UA Server',
                buildNumber: '1.0.0',
                buildDate: new Date(),
            },
        });

        this.devices = devices;

        this.server.on('post_initialize', () => {
            for (const device in this.devices) {
                const deviceObject: DeviceFolder = devices[device];
                this.printDeviceFolderStructure(deviceObject);
                const serverDeviceObject = new ServerDeviceObject(this.server, deviceObject).init();
            }
        });
    }

    public async start() {
        try {
            await this.server.initialize();
            await this.server.start();
        } catch (error) {
            console.error('Failed to start server', error);
            process.exit(1);
        }
    }

    private printDeviceFolderStructure(folder: DeviceFolder) {
        Logger.info(`${folder.name}`);
        folder.items.forEach((item, index) => {
            if (item.hasOwnProperty('items')) {
                this.printDeviceFolderStructure(item as DeviceFolder);
            } else if (index === folder.items.length - 1) {
                Logger.info(`└─ ${item.name}`);
            } else {
                Logger.info(`├─ ${item.name}`);
            }
        });
    }
}
