export interface Event {
    uid: string;
    name: string;
    message: string;
    sourceComponent: string;
    sourceHost: string;
    type: string;
    reason: string;
    firstSeen: number;
    lastSeen: number;
    count: number;
}
