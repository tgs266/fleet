/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import FleetManager from '../FleetManager';

export default class DragPlugin {
    last: { x: number; y: number };

    manager: FleetManager;

    constructor(manager: FleetManager) {
        this.manager = manager;
    }

    pointerDown(e: PointerEvent) {
        this.last = { x: e.clientX, y: e.clientY };
    }

    pointerMove(e: PointerEvent) {
        if (!this.last) {
            return;
        }
        const x = e.clientX;
        const y = e.clientY;

        const deltaX = x - this.last.x;
        const deltaY = y - this.last.y;

        this.manager.app.stage.position.x += deltaX;
        this.manager.app.stage.position.y += deltaY;

        this.last = { x, y };
    }

    pointerUp() {
        this.last = null;
    }
}
