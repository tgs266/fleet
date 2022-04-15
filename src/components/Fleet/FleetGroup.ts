/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-cycle */
/* eslint-disable no-bitwise */
/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line max-classes-per-file
import { Container, Texture } from 'pixi.js';
// import * as crypto from "crypto";
import * as TimSort from 'timsort';
import { FleetChild } from './model';
import { Operation } from './Fleet';
import FleetManager from './FleetManager';
import { BOX_MARGIN, BOX_SIZE, FONT_SIZE, RED } from './helper';
import { JSONObjectType } from '../../models/json.model';
import { LinkedList } from '../../utils/linkedList';

// const uuid =
function getUUID() {
    // Public Domain/MIT
    return Math.random().toString(20).substr(2, 10);
}

const TRANSITION_TIME = 400;

export class FleetContainer extends Container {
    _texture: Texture;

    constructor(texture: Texture) {
        super();
        this._texture = texture;
    }
}

export default class FleetGroup {
    openPositions: {
        x: number;
        y: number;
    }[];

    uid: string;

    name: string;

    rowSize = 50;

    startPosition: {
        x: number;
        y: number;
    };

    lastPosition: {
        x: number;
        y: number;
    };

    positions: JSONObjectType<{ x: number; y: number }> = {};

    allIds: string[];

    constructor(
        name: string,
        uid: string,
        startingPosition?: {
            x: number;
            y: number;
        }
    ) {
        this.allIds = [];
        this.uid = uid;
        this.name = name;
        if (!startingPosition) {
            this.lastPosition = {
                x: 0,
                y: 0,
            };
        } else {
            this.lastPosition = startingPosition;
        }
        this.startPosition = this.lastPosition;
        this.openPositions = [];
    }

    get width() {
        return this.rowSize * (BOX_MARGIN + BOX_SIZE) - BOX_MARGIN;
    }

    sortOpenPositions() {
        TimSort.sort(this.openPositions, (a, b) => {
            const p1 = this.rowSize * a.y + a.x;
            const p2 = this.rowSize * b.y + b.x;
            if (p1 < p2) {
                return -1;
            }
            if (p1 > p2) {
                return 1;
            }
            return 0;
        });
    }

    cleanOpenPositions() {
        for (let i = this.openPositions.length - 2; i >= 0; i -= 1) {
            const p1 = this.openPositions[i];
            const p2 = this.openPositions[i + 1];
            if (p1.y === p2.y) {
                // same row
                if (p1.x + BOX_MARGIN === p2.x) {
                    this.openPositions.splice(i + 1, 1);
                }
            }
        }
    }

    findOpenPosition() {
        if (this.openPositions.length === 0) {
            let newX = this.lastPosition.x;
            let newY = this.lastPosition.y;
            if (
                (newX - this.startPosition.x + BOX_MARGIN + BOX_SIZE) / (BOX_SIZE + BOX_MARGIN) >
                this.rowSize
            ) {
                newX = this.startPosition.x;
                newY += BOX_MARGIN + BOX_SIZE;
            }
            this.lastPosition = {
                x: newX + BOX_MARGIN + BOX_SIZE,
                y: newY,
            };
            return this.lastPosition;
        }
        this.lastPosition = this.openPositions.shift();
        return this.lastPosition;
    }

    // eslint-disable-next-line class-methods-use-this
    getStepSize(duration: number) {
        return 1 / (duration / 16.6);
    }

    consolidate(manager: FleetManager) {
        const pos = this.openPositions.shift();
        const id = this.allIds.pop();
        manager.operations.push({
            opId: getUUID(),
            mode: 'UPDATE',
            id,
            group: this.uid,
            position: pos,
            alpha: 1,
            progress: 0,
            stepSize: this.getStepSize(TRANSITION_TIME),
        });
        this.openPositions.push(this.positions[id]);
        this.positions[id] = pos;
        this.allIds.unshift(id);
    }

    // consolidate(manager: FleetManager) {
    //     const pos = this.openPositions.shift()
    //     const id = this.allIds.pop()
    //     manager.operations.push({
    //         opId: getUUID(),
    //         mode: "UPDATE",
    //         id,
    //         group: this.uid,
    //         position: pos,
    //         alpha: 1,
    //         progress: 0,
    //         stepSize: this.getStepSize(TRANSITION_TIME),
    //     })
    //     this.openPositions.push(this.positions[id])
    //     this.positions[id] = pos
    //     this.allIds.unshift(id)
    // }

    createNewOperation(data: FleetChild): Operation {
        this.allIds.push(data.meta.uid);
        const pos = this.findOpenPosition();
        this.positions[data.meta.uid] = pos;
        return {
            opId: getUUID(),
            mode: 'NEW',
            id: data.meta.uid,
            group: data.ownerUID,
            data,
            position: pos,
            alpha: 1,
            progress: 0,
            stepSize: this.getStepSize(TRANSITION_TIME),
            tint: data.status.color,
        };
    }

    createTextOperation(parentUid: string, text: string, scale: number): Operation {
        // this.allIds.push(data.meta.uid)
        // const pos = this.findOpenPosition()
        // this.positions[data.meta.uid] = pos
        return {
            opId: getUUID(),
            mode: 'TEXT',
            text,
            id: parentUid,
            group: parentUid,
            position: {
                x: this.startPosition.x + FONT_SIZE,
                y: this.startPosition.y - FONT_SIZE - BOX_MARGIN,
            },
            fontSize: 10 * scale,
            alpha: 1,
            progress: 0,
            stepSize: this.getStepSize(TRANSITION_TIME),
        };
    }

    createHighlighterOperation(parentUid: string, width: number): Operation {
        // this.allIds.push(data.meta.uid)
        // const pos = this.findOpenPosition()
        // this.positions[data.meta.uid] = pos
        return {
            opId: getUUID(),
            mode: 'CREATE-HIGHLIGHTER',
            id: parentUid,
            group: parentUid,
            width,
            position: {
                x: this.startPosition.x + BOX_SIZE + BOX_MARGIN,
                y: this.startPosition.y - BOX_MARGIN,
            },
            tint: [0, 0, 0],
            alpha: 1,
            progress: 0,
            stepSize: this.getStepSize(TRANSITION_TIME),
        };
    }

    removeFromAllIds(id: string) {
        const out = [];
        for (let i = 0; i < this.allIds.length; i += 1) {
            if (this.allIds[i] !== id) {
                out.push(this.allIds[i]);
            }
        }
        return out;
    }

    createDeleteOperation(
        data: FleetChild,
        callback?: (manager: FleetManager, position: { x: number; y: number }) => void
    ): Operation {
        const useCallback =
            callback ||
            ((manager: FleetManager, position: { x: number; y: number }) => {
                this.openPositions.push(position);
                this.sortOpenPositions();
                this.allIds = this.removeFromAllIds(data.meta.uid);
                this.consolidate(manager);
            });

        return {
            opId: getUUID(),
            mode: 'DELETE',
            id: data.meta.uid,
            group: data.ownerUID,
            alpha: 0,
            progress: 0,
            stepSize: this.getStepSize(TRANSITION_TIME),
            tint: data.status.color,
            completeCallback: useCallback,
        };
    }

    createUpdateOperation(data: FleetChild): Operation {
        return {
            opId: getUUID(),
            mode: 'UPDATE',
            id: data.meta.uid,
            group: data.ownerUID,
            data,
            alpha: 1,
            progress: 0,
            stepSize: this.getStepSize(TRANSITION_TIME),
            tint: data.status.color,
        };
    }

    getClearOps() {
        const out: LinkedList<Operation> = new LinkedList();
        for (const id of this.allIds) {
            out.push(
                this.createDeleteOperation(
                    {
                        ownerUID: this.uid,
                        meta: {
                            uid: id,
                            name: null,
                            namespace: null,
                            details: null,
                        },
                        dimension: null,
                        status: {
                            reason: '',
                            value: 'Terminated',
                            color: RED,
                        },
                    },
                    () => {}
                )
            );
        }
        return out;
    }
    // getClearOps() {
    //     const out: Operation[] = []
    //     for (const id of this.allIds) {
    //         out.push(this.createDeleteOperation({
    //             ownerUID: this.uid,
    //             meta: {
    //                 uid: id,
    //                 name: null,
    //                 namespace: null,
    //                 details: null
    //             },
    //             dimension: null,
    //             status: {
    //                 reason: "",
    //                 value: "Terminated",
    //                 color: RED,
    //             },
    //         }, () => {}))
    //     }
    //     return out
    // }
}
