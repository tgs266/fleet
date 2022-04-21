/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import { Point } from 'pixi.js-legacy';
import FleetManager from '../FleetManager';

export function modifyZoom(
    manager: FleetManager,
    change: number,
    center: { x: number; y: number }
) {
    const point = new Point();
    manager.app.renderer.plugins.interaction.mapPositionToPoint(point, center.x, center.y);

    const oldPoint = manager.app.stage.toLocal(point);

    manager.app.stage.scale.x *= change;
    manager.app.stage.scale.y *= change;

    const newPoint = manager.app.stage.toGlobal(oldPoint);
    manager.app.stage.position.x += point.x - newPoint.x;
    manager.app.stage.position.y += point.y - newPoint.y;
}

export default function zoom(manager: FleetManager, e: globalThis.WheelEvent) {
    const step = (-e.deltaY * (e.deltaMode ? 20 : 1)) / 500;
    const change = 2 ** ((1 + 0.1) * step);
    modifyZoom(manager, change, {
        x: e.clientX,
        y: e.clientY,
    });
}
