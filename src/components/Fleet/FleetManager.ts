/* eslint-disable no-bitwise */
/* eslint-disable no-continue */
/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import {
    Application,
    ParticleContainer,
    Container,
    Texture,
    Graphics,
    DisplayObject,
    Ticker,
} from 'pixi.js-legacy';
import { Filter } from '../../models/base';
import { JSONObjectType } from '../../models/json.model';
import { getWSUrl } from '../../services/axios.service';
import { LinkedList } from '../../utils/linkedList';
import { Operation } from './Fleet';
import FleetGroup from './FleetGroup';
import { BOX_MARGIN, BOX_SIZE, CONTAINER_MARGIN, FleetSprite } from './helper';
import { FleetChild, FleetObject } from './model';
import click from './plugins/click';
import DragPlugin from './plugins/DragPlugin';
import hover from './plugins/hover';
import zoom, { modifyZoom } from './plugins/zoom';
import getWebsocket from '../../services/websocket';

const MAX_OPERATION_COUNT = 5000;

function easeInOutCubic(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
}

function rgbToTint(rgb: number[]): number {
    return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
}

export interface Region {
    x: {
        start: number;
        end: number;
    };
    y?: {
        start: number;
        end: number;
    };
}

export default class FleetManager {
    dim0: string = 'deployment';

    dim1: string = 'pod';

    dim0Filters: Filter[] = [];

    dim1Filters: Filter[] = [];

    interval: NodeJS.Timer;

    intervalTime = 1000;

    ws: WebSocket;

    queue: FleetChild[];

    operations: LinkedList<Operation>;

    groups: JSONObjectType<FleetGroup> = {};

    groupRegions: JSONObjectType<Region> = {};

    app: Application;

    container: ParticleContainer;

    textContainer: Container;

    children: JSONObjectType<DisplayObject> = {};

    dragPlugin: DragPlugin;

    width: number = 0;

    ref: HTMLDivElement;

    texture: Texture;

    lineTexture: Texture;

    maxHeight: number = 0;

    paused: boolean = false;

    mainTicker: Ticker;

    constructor(ref: HTMLDivElement) {
        this.operations = new LinkedList();

        this.app = new Application({
            backgroundColor: 0xf6f7f9,
            resizeTo: ref,
            resolution: 1,
        });

        this.ref = ref;
        this.dragPlugin = new DragPlugin(this);

        this.buildGraphic();
        this.buildContainer();

        this.container.roundPixels = true;

        ref.appendChild(this.app.view);
        this.app.stage.addChild(this.container);
        this.app.stage.addChild(this.textContainer);

        this.app.start();
        this.startTicker();
    }

    setDim0(dim: string) {
        this.dim0 = dim;
    }

    setDim1(dim: string) {
        this.dim1 = dim;
    }

    buildGraphic() {
        const graphics = new Graphics();
        graphics.beginFill(0xffffff);
        graphics.drawRect(0, 0, BOX_SIZE, BOX_SIZE);
        graphics.endFill();
        this.texture = this.app.renderer.generateTexture(graphics);

        const lineGraphics = new Graphics();
        lineGraphics.beginFill(0xffffff);
        lineGraphics.drawRect(0, 0, 10, 3);
        lineGraphics.endFill();
        this.lineTexture = this.app.renderer.generateTexture(lineGraphics);
    }

    buildContainer() {
        this.container = new ParticleContainer(10000000, {
            position: true,
            tint: true,
            alpha: true,
        });
        this.container.baseTexture = this.texture.baseTexture;
        this.textContainer = new Container();
    }

    addListeners(ref: HTMLDivElement, hoverCallback?: (name: string) => void) {
        this.app.stage.interactive = true;
        this.container.interactive = true;
        this.ref = ref;

        ref.onwheel = (e) => {
            zoom(this, e);
        };
        ref.onpointerdown = (e) => {
            this.dragPlugin.pointerDown(e);
        };
        ref.ondblclick = (e) => {
            click(this, { x: e.clientX, y: e.clientY });
        };
        ref.onpointermove = (e) => {
            hover(this, { x: e.clientX, y: e.clientY }, (uid: string) => {
                if (uid !== '') {
                    hoverCallback(this.groups[uid].name);
                } else {
                    hoverCallback(uid);
                }
            });
            this.dragPlugin.pointerMove(e);
        };
        ref.onpointerup = () => {
            this.dragPlugin.pointerUp();
        };
        ref.onpointerleave = () => {
            this.dragPlugin.pointerUp();
        };
        ref.onpointerout = () => {
            this.dragPlugin.pointerUp();
        };
    }

    connect() {
        if (this.ws) {
            this.ws.close();
            for (const g of Object.values(this.groups)) {
                this.operations.concat(g.getClearOps());
            }

            this.groups = {};
            this.width = 0;
        }
        const token = localStorage.getItem('jwe');
        this.ws = getWebsocket(getWSUrl(`/ws/v1/fleet?jwe=${token}`));
        this.ws.onopen = () => {
            this.ws.send(
                JSON.stringify({
                    dimensions: [
                        {
                            dimension: this.dim0,
                        },
                        {
                            dimension: this.dim1,
                        },
                    ],
                })
            );
            this.start();
        };
    }

    pauseApp = () => {
        this.paused = !this.paused;
        if (this.paused) {
            this.mainTicker.stop();
        } else {
            this.mainTicker.start();
        }
    };

    handleDeleteGroup = (fleetObj: FleetObject) => {
        const group = this.groups[fleetObj.meta.uid];
        this.width -= group.rowSize * (BOX_MARGIN + BOX_SIZE) + CONTAINER_MARGIN;
        this.operations = this.operations.concat(group.getClearOps());
        delete this.groupRegions[group.uid]; // [group.uid] = null
        delete this.groups[fleetObj.meta.uid];
    };

    handleCreateGroup = (fleetObj: FleetObject, startY: number) => {
        const group = new FleetGroup(fleetObj.meta.name, fleetObj.meta.uid, {
            x: this.width,
            y: startY,
        });
        group.rowSize = Math.round(((Object.keys(fleetObj.children).length * 16) / 9) ** 0.5);

        this.groupRegions[group.uid] = {
            x: {
                start: this.width + BOX_SIZE + BOX_MARGIN,
                end: this.width + BOX_SIZE + BOX_MARGIN + group.width,
            },
        };
        this.width += group.width + CONTAINER_MARGIN + BOX_MARGIN;

        this.groups[fleetObj.meta.uid] = group;
        return group;
    };

    determineExec = (newGroup: boolean, obj: FleetChild, group: FleetGroup) => {
        if (newGroup || obj.mode === 'NEW') {
            this.operations.push(group.createNewOperation(obj));
        } else if (obj.mode === 'DELETE') {
            this.operations.push(group.createDeleteOperation(obj));
        } else if (obj.mode === 'UPDATE') {
            this.operations.push(group.createUpdateOperation(obj));
        }
    };

    start() {
        if (this.groups) {
            for (const g of Object.values(this.groups)) {
                this.operations.concat(g.getClearOps());
            }
        }
        this.groups = {};
        this.groupRegions = {};

        this.ws.onmessage = (m: MessageEvent<any>) => {
            let firstLoad = false;
            if (this.width === 0) {
                firstLoad = true;
            }
            const data = JSON.parse(m.data) as FleetObject[];
            const startY = 0;
            for (const fleetObj of data) {
                if (fleetObj.mode === 'DELETE') {
                    this.handleDeleteGroup(fleetObj);
                    continue;
                }

                if (
                    !fleetObj.children ||
                    fleetObj.children === {} ||
                    Object.keys(fleetObj.children).length === 0
                ) {
                    continue;
                }

                let group = this.groups[fleetObj.meta.uid];
                let newGroup = false;
                if (!group) {
                    newGroup = true;
                    group = this.handleCreateGroup(fleetObj, startY);
                }

                for (const fleetChild of Object.keys(fleetObj.children)) {
                    const obj = fleetObj.children[fleetChild];
                    obj.ownerUID = fleetObj.meta.uid;
                    this.determineExec(newGroup, obj, group);
                }
            }

            if (firstLoad) {
                const widthRatio = this.ref.clientWidth / this.width;
                this.app.stage.scale.x = widthRatio;
                this.app.stage.scale.y = widthRatio;
                this.app.stage.position.y = CONTAINER_MARGIN;
            }
        };
    }

    // eslint-disable-next-line class-methods-use-this
    handleFinalUpdate = (op: Operation, child: FleetSprite) => {
        const distanceAlpha = op.alpha - child.alpha;

        const childTintComponents = {
            r: (child.tint & 0xff0000) >> 16,
            g: (child.tint & 0x00ff00) >> 8,
            b: child.tint & 0x0000ff,
        };

        const change = easeInOutCubic(op.progress);

        child.alpha += distanceAlpha * change;

        if (op.position) {
            const distanceX = op.position.x - child.x;
            const distanceY = op.position.y - child.y;
            child.x += distanceX * change;
            child.y += distanceY * change;
        }

        if (op.tint) {
            const distanceR = op.tint[0] - childTintComponents.r;
            const distanceG = op.tint[1] - childTintComponents.g;
            const distanceB = op.tint[2] - childTintComponents.b;

            const newR = childTintComponents.r + distanceR * change;
            const newG = childTintComponents.g + distanceG * change;
            const newB = childTintComponents.b + distanceB * change;

            child.tint = rgbToTint([newR, newG, newB]);
        }

        op.progress += op.stepSize;
    };

    handleDeleteOperation = (op: Operation): boolean => {
        if (op.progress >= 1) {
            this.operations.shift();
            const child = this.getChildByName(op.id) as FleetSprite;
            if (!child) {
                return true;
            }
            child.visible = false;
            this.removeChild(child).destroy();
            return true;
        }

        const child = this.getChildByName(op.id) as FleetSprite;

        if (!child) {
            this.operations.shift();
            op.progress = 1;
            return true;
        }

        if (!op.position) {
            op.position = {
                x: child.position.x,
                y: child.position.y + 20,
            };
        }

        if (op.progress === 0) {
            op.completeCallback(this, { x: child.x, y: child.y });
        }

        this.handleFinalUpdate(op, child);
        return false;
    };

    removeOp(idx: number) {
        if (idx === 0) {
            this.operations.shift();
        }
    }

    handleNewOrUpdateOperation = (op: Operation, idx: number) => {
        if (op.progress >= 1) {
            this.removeOp(idx);
            return true;
        }

        let child = this.getChildByName(op.id) as FleetSprite;
        if (!child) {
            child = FleetSprite.from(this.texture) as FleetSprite;

            child.alpha = 0;
            if (op.position) {
                child.x = op.position.x;
                child.y = op.position.y;
            }

            if (op.tint && op.tint.length === 3) {
                child.tint = rgbToTint(op.tint);
            }
            child.name = op.id;
            child.data = op.data;
            child = this.addChild(child) as FleetSprite;
        }
        if (op.data) {
            child.data = op.data;
        }

        this.handleFinalUpdate(op, child);
        return false;
    };

    runOps = () => {
        let runOpCount = Math.min(this.operations.length, MAX_OPERATION_COUNT);
        let { head } = this.operations;
        for (let i = 0; i < runOpCount; i += 1) {
            const op = head.data;
            if (!op) {
                continue;
            }
            let del = null;
            switch (op.mode) {
                case 'NEW':
                    del = this.handleNewOrUpdateOperation(op, i);
                    break;
                case 'DELETE':
                    del = this.handleDeleteOperation(op);
                    break;
                default:
                    del = this.handleNewOrUpdateOperation(op, i);
            }

            if (del) {
                i -= 1;
                runOpCount -= 1;
            }

            head = head.post;
        }
    };

    startTicker() {
        this.mainTicker = this.app.ticker.add(this.runOps);
    }

    destroy() {
        this.app.destroy(true, true);
        if (this.ws) {
            this.ws.close();
        }
    }

    addChild(sprite: DisplayObject): DisplayObject {
        this.children[sprite.name] = sprite;
        this.container.addChild(sprite);
        return sprite;
    }

    getChildByName(name: string) {
        return this.children[name];
    }

    removeChild(sprite: FleetSprite) {
        this.children[sprite.name] = null;
        return this.container.removeChild(sprite);
    }

    removeChildByName(name: string) {
        this.children[name] = null;
    }

    zoomIn = () => {
        modifyZoom(this, 1.2, { x: this.ref.clientWidth / 2, y: this.ref.clientHeight / 2 });
    };

    zoomOut = () => {
        modifyZoom(this, 1 / 1.2, { x: this.ref.clientWidth / 2, y: this.ref.clientHeight / 2 });
    };

    zoomFit = () => {
        const widthRatio = this.ref.clientWidth / this.width;
        this.app.stage.scale.x = widthRatio;
        this.app.stage.scale.y = widthRatio;
        this.app.stage.position.x = 0;
        this.app.stage.position.y = CONTAINER_MARGIN;
    };
}
