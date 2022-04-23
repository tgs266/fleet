/* eslint-disable react/no-render-return-value */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import React from 'react';
import { Point } from 'pixi.js-legacy';
import ReactDOM from 'react-dom';
import { BOX_MARGIN, BOX_SIZE, FleetSprite } from '../helper';
import FleetManager from '../FleetManager';
import FleetPopover from '../FleetPopover';

export default function click(
    manager: FleetManager,
    center: { x: number; y: number },
    worldPoint?: Point
) {
    const point = new Point();
    manager.app.renderer.plugins.interaction.mapPositionToPoint(point, center.x, center.y);

    worldPoint = worldPoint || manager.app.stage.toLocal(point);

    let group = null;

    for (const m of Object.keys(manager.groupRegions)) {
        console.log(manager.groupRegions[m].x.start, worldPoint.x, manager.groupRegions[m].x.end);
        if (
            manager.groupRegions[m].x.start < worldPoint.x &&
            worldPoint.x < manager.groupRegions[m].x.end
        ) {
            const g = manager.groups[m];
            const rows = Math.ceil(g.allIds.length / g.rowSize);
            const height = rows * (BOX_MARGIN + BOX_SIZE);
            if (height > worldPoint.y) {
                group = manager.groups[m];
                break;
            }
        }
    }

    if (!group) {
        return;
    }

    const adjustedX = worldPoint.x - group.startPosition.x - (BOX_MARGIN + BOX_SIZE);
    const adjustedY = worldPoint.y - group.startPosition.y;

    const xVal = adjustedX / (BOX_SIZE + BOX_MARGIN);
    if (Math.floor(xVal - BOX_SIZE / (BOX_SIZE + BOX_MARGIN)) > Math.floor(xVal)) {
        return;
    }

    const yVal = adjustedY / (BOX_SIZE + BOX_MARGIN);
    if (Math.floor(yVal - BOX_SIZE / (BOX_SIZE + BOX_MARGIN)) > Math.floor(yVal)) {
        return;
    }

    const xIdx = Math.floor(adjustedX / (BOX_SIZE + BOX_MARGIN));
    const yIdx = Math.floor(adjustedY / (BOX_SIZE + BOX_MARGIN));

    const idx = yIdx * group.rowSize + xIdx;
    const childId = group.allIds[idx];
    const child = manager.getChildByName(childId) as FleetSprite;

    const popoverContainer = document.createElement('div');
    popoverContainer.style.position = 'absolute';
    popoverContainer.style.top = `${center.y.toString()}px`;
    popoverContainer.style.left = `${center.x.toString()}px`;

    const props = {
        child,
        type: manager.dim1,
    };

    document.getElementById('fleet').appendChild(popoverContainer);
    ReactDOM.render(React.createElement(FleetPopover, props, <div />), popoverContainer);
}
