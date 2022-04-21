import { Sprite } from 'pixi.js-legacy';
import { FleetChild } from './model';

export const FONT_SIZE = 25;
export const BOX_SIZE = 25;
export const BOX_MARGIN = 5;
export const CONTAINER_MARGIN = 50;

export const GREEN = [50, 164, 103];
export const YELLOW = [251, 208, 101];
export const RED = [205, 66, 70];

export class FleetSprite extends Sprite {
    data: FleetChild;

    setData(newData: any) {
        this.data = newData;
    }

    getData() {
        return this.data;
    }
}
