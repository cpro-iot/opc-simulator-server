import { OPCUAServer, Namespace, UAObjectsFolder } from 'node-opcua';
import { registerDeviceObject } from './objects';
import devices from '../../data/devices.json';

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
    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace?.getOwnNamespace() as Namespace;
    const objectsFolder = addressSpace?.rootFolder.objects as UAObjectsFolder;

    for (const device in devices) {
        const deviceObject: any = (devices as Record<string, any>)[device];
        registerDeviceObject(namespace, objectsFolder, deviceObject);
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
