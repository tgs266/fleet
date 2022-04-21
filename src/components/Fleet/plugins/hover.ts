/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
/* eslint-disable no-restricted-syntax */
import { Point } from 'pixi.js-legacy';
import FleetManager from '../FleetManager';
import { BOX_MARGIN, BOX_SIZE } from '../helper';

export default function hover(
    manager: FleetManager,
    center: { x: number; y: number },
    callback?: (uid: string) => void,
    worldPoint?: Point
) {
    const point = new Point();
    manager.app.renderer.plugins.interaction.mapPositionToPoint(point, center.x, center.y);

    worldPoint = worldPoint || manager.app.stage.toLocal(point);

    for (const m of Object.keys(manager.groupRegions)) {
        if (
            manager.groupRegions[m].x.start < worldPoint.x &&
            worldPoint.x < manager.groupRegions[m].x.end
        ) {
            const g = manager.groups[m];
            const rows = Math.ceil(g.allIds.length / g.rowSize);
            const height = rows * (BOX_MARGIN + BOX_SIZE);
            if (height > worldPoint.y) {
                callback(m);
                return;
            }
        }
    }

    callback('');
}
