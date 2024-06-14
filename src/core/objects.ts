import { Namespace, Variant, StatusCodes, StatusCode, UAObjectsFolder, UAFolder, DataType } from 'node-opcua';
import { DeviceNode, DeviceFolder } from '../../@types/index';

function inferValueType(value: string | number | boolean) {
    if (typeof value === 'string') {
        return DataType.String;
    }
    if (typeof value === 'number') {
        return DataType.Double;
    }
    if (typeof value === 'boolean') {
        return DataType.Boolean;
    }

    return DataType.Null;
}

function enableValueSimulation(node: DeviceNode) {
    const { type, value, interval } = node.simulation || {};
    if (type === 'increment') {
        typeof node.value === "number" ?
        setInterval(() => ((node.value as number) += value || 1), (interval || 1) * 1000) : console.error("Can't increment non number value");
    }

    if (type === 'decrement') {
        typeof node.value === "number" ?
        setInterval(() => ((node.value as number) -= value || 1), (interval || 1) * 1000) : console.error("Can't decrement non number value");
    }

    if (type === 'randomize') {
        // write a randomize function for the following object: randomize?: { min: number; max: number }
        typeof node.value === "number" ?
        setInterval(
            () => {
                const min = Math.random() * (node.simulation?.randomize?.max || 1);
                const max = Math.random() * (node.simulation?.randomize?.min || 1);
                node.value = +((node.value as number) + min - max).toFixed(2);
            },
            (interval || 1) * 1000,
        ) : console.error("Can't randomize non number value");
    }
}

function addObjectNode(namespace: Namespace, owner: UAFolder, node: DeviceNode) {
    let _variableValue = node.value;

    if (node.simulation) {
        console.log(`Enabling value simulation for '${node.name}'`);
        enableValueSimulation(node);
    }

    const assembleVariableValue = (variableValue: string | number | boolean) => {
        let _value: { get: () => Variant | StatusCode; set: () => Variant | StatusCode } = {
            get: () => StatusCodes.BadNotReadable,
            set: () => StatusCodes.BadNotWritable,
        };

        if (node.valueMethods.includes('get')) {
            _value.get = () => new Variant({ dataType: inferValueType(node.value), value: node.value });
        }

        if (node.valueMethods.includes('set')) {
            _value.set = () => {
                node.value = +variableValue;
                return StatusCodes.Good;
            };
        }

        return _value;
    };

    return namespace.addVariable({
        componentOf: owner,
        nodeId: node.id,
        browseName: node.name,
        dataType: inferValueType(node.value),
        minimumSamplingInterval: 250,
        value: assembleVariableValue(_variableValue),
    });
}

function addFolderNode(namespace: Namespace, owner: UAFolder, folder: DeviceFolder) {
    console.log(`Assembling folder: ${folder.name} owned by ${owner.fullName()}`);
    return namespace.addFolder(owner, { browseName: folder.name });
}

function addNode(namespace: Namespace, owner: UAFolder, node: DeviceNode | DeviceFolder) {
    const isFolder = node.hasOwnProperty('items');
    if (isFolder) {
        const folder = addFolderNode(namespace, owner, node as DeviceFolder);
        (node as DeviceFolder).items.forEach((item) => addNode(namespace, folder, item));
    } else {
        console.log(`Assembling node: ${node.name}`);
        return addObjectNode(namespace, owner, node as DeviceNode);
    }
}

export function registerDeviceObject(namespace: Namespace, owner: UAObjectsFolder, rootFolder: DeviceFolder) {
    return addNode(namespace, owner, rootFolder);
}
