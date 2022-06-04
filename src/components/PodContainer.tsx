/* eslint-disable indent */
import * as React from 'react';
import { Colors, Card, Icon, Button, Position, Menu, MenuItem } from '@blueprintjs/core';
import { Classes, Popover2, Tooltip2 } from '@blueprintjs/popover2';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Pod } from '../models/pod.model';
import { createdAtToHumanReadable, createdAtToOrigination } from '../utils/time';
import PodContainerTable from './PodContainerTable';
import K8 from '../services/k8.service';
import Accordion from './Accordion';
import { getStatusColor } from '../utils/pods';
import { buildLinkToPod } from '../utils/routing';

const createAccordionTitle = (pod: Pod): JSX.Element => {
    const color = getStatusColor(pod);
    const params = useParams();
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexBasis: '25%', marginRight: '0.5%' }}>
                <Link to={buildLinkToPod(params.namespace, pod.name)}>{pod.name}</Link>
            </div>
            <div style={{ flexBasis: '25%', marginRight: '0.5%', marginLeft: '0.5%' }}>
                <Tooltip2
                    className={Classes.TOOLTIP2_INDICATOR}
                    content={createdAtToOrigination(pod.createdAt).toLocaleString()}
                >
                    <div>Age: {createdAtToHumanReadable(pod.createdAt)}</div>
                </Tooltip2>
            </div>
            <div style={{ flexBasis: '25%', marginRight: '0.5%', marginLeft: '0.5%' }}>
                Restarts: {pod.restarts}
            </div>
            <div style={{ flexBasis: '25%', marginRight: '1em', marginLeft: '0.5%' }}>
                <div style={{ float: 'right' }}>
                    <Tooltip2 content={`Status: ${pod.status.reason}`}>
                        <Icon icon="full-circle" color={color} size={14} />
                    </Tooltip2>
                </div>
            </div>
        </div>
    );
};

export default function PodContainer(props: {
    rightElement?: JSX.Element;
    pods: Pod[];
    readyReplicas?: number;
    replicas?: number;
    style?: React.CSSProperties;
}) {
    const nav = useNavigate();
    const params = useParams();
    const { pods, style, readyReplicas, replicas } = props;

    const menu = (pod: Pod) => (
        <Menu>
            <MenuItem
                icon="eye-open"
                text="Inspect"
                onClick={() => {
                    nav(buildLinkToPod(params.namespace, pod.name));
                }}
            />
            <MenuItem
                icon="reset"
                text="Restart"
                onClick={() => {
                    K8.pods.restartPod({ name: pod.name, namespace: pod.namespace });
                }}
            />
        </Menu>
    );

    return (
        <div style={style}>
            <Card style={{ borderRadius: '3px 3px 0px 0px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, marginRight: '1em' }}>Pods</h3>
                    {props.rightElement}
                    <div style={{ flexGrow: 1 }} />
                    <h3 style={{ margin: 0 }}>
                        {(readyReplicas && replicas && (
                            <div>
                                {readyReplicas}/{replicas}
                            </div>
                        )) ||
                            (replicas && <div>{replicas}</div>)}
                    </h3>
                </div>
            </Card>
            {pods &&
                pods.map((pod) => (
                    <Accordion
                        key={pod.uid}
                        className="pod-container-child"
                        title={createAccordionTitle(pod)}
                        rightElement={
                            <Popover2 content={menu(pod)} position={Position.BOTTOM_LEFT}>
                                <Button minimal style={{ marginLeft: '0.5em' }} icon="more" />
                            </Popover2>
                        }
                    >
                        <Card style={{ padding: 0, backgroundColor: Colors.LIGHT_GRAY4 }}>
                            <div style={{ margin: '5px 0' }}>
                                <PodContainerTable pod={pod} />
                            </div>
                        </Card>
                    </Accordion>
                ))}
        </div>
    );
}
