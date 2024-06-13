import { DataType } from 'node-opcua';

export interface DeviceFolder {
    name: string;
    id: string;
    items: DeviceFolder[] | DeviceNode[];
}

export interface DeviceNode {
    id: string;
    name: string;
    type: DataType;
    value: number;
    valueMethods: ('set' | 'get')[];
    simulation?: {
        type: 'increment' | 'decrement' | 'randomize';
        value: number;
        interval: number;
        randomize?: { min: number; max: number };
    };
}
