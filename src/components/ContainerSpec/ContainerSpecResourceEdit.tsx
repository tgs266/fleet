/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
import * as React from 'react';
import { Button, Callout, Card, Intent, MenuItem, Tag } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { ContainerSpec } from '../../models/container.model';
import LabelSlider from '../LabelSlider';
import { BytesFrom, BytesTo } from '../../utils/conversions';
import System from '../../services/system.service';
import { SystemResources } from '../../models/system.model';

interface MemoryParameters {
    name: string;
    short: string;
    scaleFromBytes: number;
    labelStepSize: number;
    stepSize: number;
    roundTo: number;
}

const ITEMS: MemoryParameters[] = [
    {
        name: 'Megabytes',
        short: 'MB',
        scaleFromBytes: 10 ** 6,
        stepSize: 1,
        labelStepSize: 2000,
        roundTo: 1,
    },
    {
        name: 'Gigabytes',
        short: 'GB',
        scaleFromBytes: 10 ** 9,
        stepSize: 0.5,
        labelStepSize: 1,
        roundTo: 0.5,
    },
    {
        name: 'Mibibytes',
        short: 'MiB',
        scaleFromBytes: 2 ** 20,
        stepSize: 1,
        labelStepSize: 2000,
        roundTo: 1,
    },
    {
        name: 'Gibibytes',
        short: 'GB',
        scaleFromBytes: 1024 ** 3,
        stepSize: 0.5,
        labelStepSize: 1,
        roundTo: 0.5,
    },
];

export default function ContainerSpecResourceEdit(props: {
    containerSpec: ContainerSpec;
    onChange: (path: string, value: any) => void;
}) {
    const [systemResources, setSystemResources] = React.useState(null as SystemResources);
    const [memoryScale, setMemoryScale] = React.useState(ITEMS[0]);
    React.useEffect(() => {
        System.getResources().then((r) => {
            setSystemResources(r.data);
        });
    }, []);

    const { containerSpec, onChange } = props;

    const createLabelAndTag = (labelText: string, tagText: string) => (
        <div data-testid={`${labelText}-${tagText}`} style={{ display: 'flex' }}>
            <div style={{ marginRight: '0.5em' }}>{labelText}</div>
            <Tag minimal>{tagText}</Tag>
        </div>
    );

    const b =
        containerSpec.memLimit < containerSpec.memRequests ||
        containerSpec.cpuLimit < containerSpec.cpuRequests;
    return (
        <Card style={{ margin: '1em' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3 style={{ margin: 0, marginBottom: '1em' }}>Resource Configuration</h3>
                <div style={{ flexGrow: 1 }} />
                <Select
                    items={ITEMS}
                    itemRenderer={(item: MemoryParameters, itemProps: any) => (
                        <MenuItem
                            active={itemProps.modifiers.active}
                            disabled={itemProps.modifiers.disabled}
                            key={item.name}
                            onClick={itemProps.handleClick}
                            text={item.name}
                        />
                    )}
                    filterable={false}
                    onItemSelect={(item: MemoryParameters) => {
                        setMemoryScale(item);
                    }}
                    activeItem={memoryScale}
                >
                    <Button rightIcon="double-caret-vertical">{memoryScale.name}</Button>
                </Select>
            </div>

            {b && (
                <div style={{ marginBottom: '1em' }}>
                    <Callout intent={Intent.DANGER}>Limits must be greater than requests</Callout>
                </div>
            )}
            {systemResources && (
                <>
                    <LabelSlider
                        label={createLabelAndTag('CPU Requests', 'CPU Units')}
                        min={0}
                        max={systemResources.cpu.cores}
                        stepSize={0.01}
                        value={containerSpec.cpuRequests / 1000}
                        onChange={(v) => onChange('cpuRequests', Math.floor(v * 1000))}
                    />
                    <LabelSlider
                        label={createLabelAndTag('Memory Requests', memoryScale.short)}
                        min={0}
                        max={BytesTo.scale(
                            systemResources.memory.total,
                            memoryScale.scaleFromBytes,
                            memoryScale.roundTo
                        )}
                        stepSize={memoryScale.stepSize}
                        labelStepSize={memoryScale.labelStepSize}
                        value={BytesTo.scale(
                            containerSpec.memRequests,
                            memoryScale.scaleFromBytes,
                            memoryScale.roundTo
                        )}
                        onChange={(v) => {
                            onChange(
                                'memRequests',
                                BytesFrom.scale(v, memoryScale.scaleFromBytes, 1)
                            );
                        }}
                    />

                    <LabelSlider
                        label={createLabelAndTag('CPU Limit', 'CPU Units')}
                        min={0}
                        max={systemResources.cpu.cores}
                        stepSize={0.01}
                        value={containerSpec.cpuLimit / 1000}
                        onChange={(v) => onChange('cpuLimit', Math.floor(v * 1000))}
                    />
                    <LabelSlider
                        label={createLabelAndTag('Memory Limit', memoryScale.short)}
                        min={0}
                        max={BytesTo.scale(
                            systemResources.memory.total,
                            memoryScale.scaleFromBytes,
                            memoryScale.roundTo
                        )}
                        stepSize={memoryScale.stepSize}
                        labelStepSize={memoryScale.labelStepSize}
                        value={BytesTo.scale(
                            containerSpec.memLimit,
                            memoryScale.scaleFromBytes,
                            memoryScale.roundTo
                        )}
                        onChange={(v) => {
                            onChange('memLimit', BytesFrom.scale(v, memoryScale.scaleFromBytes, 1));
                        }}
                    />
                </>
            )}
        </Card>
    );
}
