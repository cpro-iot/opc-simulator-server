import { OPCUAServer } from 'node-opcua';
import devices from '../../data/devices.json';
import ServerDeviceObject from './ServerDeviceObject';

const server = new OPCUAServer({
    port: 4840,
    resourcePath: '/UA/Cpro',
    buildInfo: {
        productName: 'Cpro OPC UA Server',
        buildNumber: '1.0.0',
        buildDate: new Date(),
    },
});

server.on('post_initialize', () => {
    for (const device in devices) {
        const deviceObject: any = (devices as Record<string, any>)[device];
        const serverDeviceObject = new ServerDeviceObject(server, deviceObject).init();
    }
});

const start = async () => {
    try {
        await server.initialize();
        await server.start();
    } catch (error) {
        console.error('Failed to start server', error);
    }
};

export default start;
