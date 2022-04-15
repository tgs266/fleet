import { JSONObject, JSONObjectType } from '../../models/json.model';

export interface FleetMeta {
    uid: string;
    name: string;
    namespace: string;
    details: JSONObject;
}

export interface FleetStatus {
    color: number[];
    value: string;
    reason: string;
}
export interface FleetObject {
    mode?: string;
    meta: FleetMeta;
    children: JSONObjectType<FleetChild>;
    dimension: string;
    status: FleetStatus;
}

export interface FleetChild {
    ownerUID?: string;
    mode?: string;
    meta: FleetMeta;
    dimension: string;
    status: FleetStatus;
}
