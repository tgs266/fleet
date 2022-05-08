/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable no-bitwise */
/* eslint-disable no-restricted-syntax */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@blueprintjs/core';
import { useSpring, animated } from '@react-spring/web';
import FleetManager from './FleetManager';
import { useNavContext } from '../../layouts/Navigation';
import FleetControls from './FleetControls';
import FleetLegend from './FleetLegend';
import IconSwapButton from '../IconSwapButton';

export interface Operation {
    opId: string;
    mode: string;
    text?: string;
    id: string;
    group: string;
    fontSize?: number;
    width?: number;
    position?: {
        x: number;
        y: number;
    };
    data?: any;
    alpha: number;
    progress: number;
    stepSize: number;
    tint?: number[];
    completeCallback?: (manager: FleetManager, position?: { x: number; y: number }) => void;
}

export default function Fleet() {
    const ref: React.LegacyRef<HTMLDivElement> = useRef(null);
    const controlsRef: React.LegacyRef<FleetControls> = useRef(null);
    const legendRef: React.LegacyRef<FleetLegend> = useRef(null);
    const [, setState] = useNavContext();

    const [hovering, setHovering] = useState('');
    const [showControls, setShowControls] = useState(false);
    const [showLegend, setShowLegend] = useState(false);
    const [styles, api] = useSpring(() => ({ top: window.innerHeight - 42 - 70 }));
    const [legendStyles, legendApi] = useSpring(() => ({ right: -100 }));

    let manager: FleetManager = null;

    const instantiateGrid = () => {
        manager = new FleetManager(ref.current);
        manager.addListeners(ref.current, setHovering);
    };

    const toggleShowLegend = useCallback(() => setShowLegend(!showLegend), [showLegend]);

    useEffect(() => {
        instantiateGrid();
        setState({
            breadcrumbs: [
                {
                    text: 'Fleet',
                },
            ],
            menu: null,
            buttons: [
                <IconSwapButton
                    key="pause"
                    btnProps={{
                        icon: 'pause',
                        onClick: () => {
                            manager.pauseApp();
                        },
                    }}
                    otherIcon="play"
                />,
                <Button key="zoom-to-fit" icon="zoom-to-fit" onClick={manager.zoomFit} />,
                <Button key="plus" icon="plus" onClick={manager.zoomIn} />,
                <Button key="minus" icon="minus" onClick={manager.zoomOut} />,
            ],
        });
        manager.connect();

        controlsRef.current.setManager(manager);
        legendRef.current.setManager(manager);

        return () => {
            manager.destroy();
        };
    }, []);

    useEffect(() => {
        api.start({
            top: showControls ? window.innerHeight - 42 - 215 : window.innerHeight - 42 - 70,
        });
    }, [showControls]);

    useEffect(() => {
        legendApi.start({
            right: showLegend ? 0 : -300,
        });
    }, [showLegend]);

    return (
        <div id="fleet" style={{ height: 'calc(100vh - 42px)', overflow: 'clip' }}>
            <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 42px)' }}>
                <animated.div style={{ position: 'absolute', top: 0, ...legendStyles }}>
                    <FleetLegend ref={legendRef} toggle={toggleShowLegend} />
                </animated.div>
                <animated.div style={{ position: 'absolute', left: 0, width: '100%', ...styles }}>
                    <FleetControls
                        ref={controlsRef}
                        hovering={hovering}
                        isOpen={showControls}
                        toggle={setShowControls}
                    />
                </animated.div>
                <div style={{ width: '100%', height: 'calc(100%)' }} ref={ref} />
            </div>
        </div>
    );
}
