import { AddressSpace, Namespace, OPCUAServer, UAFolder, DataType, UAObjectsFolder, Variant, StatusCodes, StatusCode, VariantT } from "node-opcua";
import { DeviceFolder, DeviceNode } from "../../@types";

export default class ServerDeviceObject {
  private server: OPCUAServer;
  private device: DeviceFolder;
  private addressSpace: AddressSpace;
  private namespace: Namespace;
  private objectsFolder: UAObjectsFolder;

  constructor(server: OPCUAServer, device: DeviceFolder) {
    this.server = server;
    this.device = device;
    this.addressSpace = server.engine.addressSpace as AddressSpace;
    this.namespace = server.engine.addressSpace?.getOwnNamespace() as Namespace;
    this.objectsFolder = server.engine.addressSpace?.rootFolder.objects as UAObjectsFolder;
  }

  public init() {
    const deviceRootFolder = this.registerDeviceFolderNode(this.objectsFolder, this.device);
    this.device.items.forEach((node: DeviceFolder | DeviceNode) => {
      this.registerDeviceNode(deviceRootFolder, node);
    });
  }

  private registerDeviceNode(owner: UAFolder, node: DeviceFolder | DeviceNode) {
    const isFolder = node.hasOwnProperty('items');
    if (isFolder) {
      const deviceSubFolder = this.registerDeviceFolderNode(owner, node as DeviceFolder);
      (node as DeviceFolder).items.forEach((item) => this.registerDeviceNode(deviceSubFolder, item));
    } else  {
      this.registerDeviceObjectNode(owner, node as DeviceNode);
    }
  }

  private registerDeviceFolderNode(owner: UAFolder, folder: DeviceFolder) {
    console.log(`Assembling folder: ${folder.name}`);
    return this.namespace.addFolder(owner, { browseName: folder.name });
  }

  private registerDeviceObjectNode(owner: UAFolder, node: DeviceNode) {
    console.log(`Assembling node: ${node.name}`);
    let _variableValue = node.value;

    if (node.simulation) {
      console.log(`Enabling value simulation for '${node.name}'`);
      this.simulateNodeValue(node);
    }

    return this.namespace.addVariable({
      componentOf: owner,
      nodeId: node.id,
      browseName: node.name,
      dataType: this.inferValueType(node.value),
      minimumSamplingInterval: 250,
      value: this.constructNodeVariant(node, _variableValue),
    })
  }

  private constructNodeVariant(node: DeviceNode, value: string | number | boolean) {
    let _value: { get: () => Variant | StatusCode; set: (variant: VariantT<number | boolean | string, DataType>) => Variant | StatusCode } = {
      get: () => StatusCodes.BadNotReadable,
      set: () => StatusCodes.BadNotWritable,
    };

    if (node.valueMethods.includes('get')) {
      _value.get = () => new Variant({ dataType: this.inferValueType(node.value), value: node.value });
    }

    if (node.valueMethods.includes('set')) {
      _value.set = (variant: VariantT<number | boolean | string, DataType>) => {
        node.value = variant.value;
        return StatusCodes.Good;
      };
    }

    return _value;
  }

  private simulateNodeValue(node: DeviceNode) {
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

  private inferValueType(value: string | number | boolean) {
    if (typeof value === "string") return DataType.String;
    if (typeof value === "number") return DataType.Double;
    if (typeof value === "boolean") return DataType.Boolean;

    return DataType.Null;
  }
}