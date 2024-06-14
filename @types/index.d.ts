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
    value: number | string | boolean;
    valueMethods: ('set' | 'get')[];
    simulation?: {
        type: 'increment' | 'decrement' | 'randomize' | 'sinus';
        value: number;
        interval: number;
        randomize?: { min: number; max: number };
        sinus?: { amplitude: number }
    };
}
