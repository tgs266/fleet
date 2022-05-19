/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import { AxiosError } from 'axios';
import { Tooltip2 } from '@blueprintjs/popover2';
import { Alignment, ButtonGroup, Button, Card, Intent, Tag, Icon } from '@blueprintjs/core';
import { useNavContext } from '../../layouts/Navigation';
import Electron from '../../services/electron.service';
import { ElectronCluster } from '../../models/cluster.model';
import ResourceTable from '../../components/ResourceTable';
import Toaster from '../../services/toast.service';
import { useAuthContext } from '../../contexts/AuthContext';
import Auth from '../../services/auth.service';
import { FleetError } from '../../models/base';

export default function Clusters() {
    const [, setState] = useNavContext();
    const [authCtx, setAuthCtx] = useAuthContext();
    React.useEffect(
        () =>
            setState({
                breadcrumbs: [
                    {
                        text: 'clusters',
                    },
                ],
                buttons: [],
                menu: null,
            }),
        []
    );

    const [clusters, setClusters] = React.useState<ElectronCluster[]>([]);

    if (!Electron.isElectron) {
        return <div>NOT ELECTRON</div>;
    }

    const getData = () => {
        Electron.getClusters().then((r) => {
            if (r.data.length === 0) {
                Toaster.show({
                    intent: Intent.WARNING,
                    message:
                        'Could not detect any kubernetes clusters in your kubeconfig file. Please add one',
                });
            }
            setClusters(r.data);
        });
        Electron.getCurrentCluster()
            .then((r) => {
                sessionStorage.setItem('path', `http://localhost:${r.data.port}`);
                Auth.using()
                    .then((r2) => {
                        Auth.whoami()
                            .then((r3) => {
                                setAuthCtx({
                                    cluster: r.data,
                                    useAuth: r2.data.usingAuth,
                                    username: r3.data.username,
                                });
                            })
                            .catch(() => {
                                setAuthCtx({
                                    cluster: r.data,
                                    useAuth: r2.data.usingAuth,
                                    username: null,
                                });
                            });
                    })
                    .catch(() => {
                        setAuthCtx({
                            cluster: r.data,
                            useAuth: null,
                            username: null,
                        });
                    });
            })
            .catch(() => {
                setAuthCtx({ cluster: null, useAuth: null, username: null });
            });
    };

    React.useEffect(() => {
        getData();
    }, []);

    return (
        <Card style={{ padding: 0, margin: '1em' }}>
            <ResourceTable<ElectronCluster>
                data={clusters}
                keyPath="cluster"
                columns={[
                    {
                        columnName: 'Cluster',
                        key: 'cluster',
                        columnFunction: (row: ElectronCluster) => row.name,
                    },
                    {
                        columnName: 'Source',
                        key: 'source',
                        columnFunction: (row: ElectronCluster) => row.source,
                    },
                    {
                        columnName: 'Connected',
                        key: 'isConnected',
                        columnFunction: (row: ElectronCluster) => {
                            if (row.isConnected) {
                                return (
                                    <Tag round intent={Intent.SUCCESS}>
                                        True
                                    </Tag>
                                );
                            }
                            return (
                                <Tag round intent={Intent.DANGER}>
                                    False
                                </Tag>
                            );
                        },
                    },
                    {
                        columnName: 'In Use',
                        key: 'inUse',
                        columnFunction: (row: ElectronCluster) => {
                            if (authCtx.cluster && row.name === authCtx.cluster.name) {
                                return (
                                    <Tag round intent={Intent.SUCCESS}>
                                        True
                                    </Tag>
                                );
                            }
                            return (
                                <Tag round intent={Intent.DANGER}>
                                    False
                                </Tag>
                            );
                        },
                    },
                    {
                        columnName: '',
                        columnElement: (
                            <Tooltip2 content="These are clusters found in your kubernetes config file.">
                                <Icon icon="help" />
                            </Tooltip2>
                        ),
                        key: 'connect',
                        alignment: Alignment.RIGHT,
                        columnFunction: (row: ElectronCluster) => {
                            const using = authCtx.cluster && row.name === authCtx.cluster.name;
                            return (
                                <ButtonGroup>
                                    <Button
                                        intent={row.isConnected ? Intent.DANGER : Intent.SUCCESS}
                                        onClick={() => {
                                            if (!row.isConnected) {
                                                Electron.connectToCluster(row)
                                                    .then((r) => {
                                                        window.localStorage.setItem(
                                                            'jwe',
                                                            r.data.token
                                                        );
                                                        getData();
                                                        Toaster.show({
                                                            intent: Intent.SUCCESS,
                                                            message: `Successfully connected to remote cluster "${row.name}"`,
                                                        });
                                                    })
                                                    .catch((err: AxiosError<FleetError>) => {
                                                        Toaster.show({
                                                            intent: Intent.DANGER,
                                                            message: `Connection to remote cluster failed. Please try again. (Error status ${err.response.data.status})`,
                                                        });
                                                    });
                                            } else {
                                                Electron.disconnectFromCluster(row.name).then(
                                                    () => {
                                                        getData();
                                                    }
                                                );
                                            }
                                        }}
                                    >
                                        {row.isConnected ? 'Disconnect' : 'Connect'}
                                    </Button>
                                    <Button
                                        intent={using ? Intent.DANGER : Intent.SUCCESS}
                                        onClick={() => {
                                            if (using) {
                                                Electron.stop(row).then(() => {
                                                    getData();
                                                });
                                            } else {
                                                Electron.start(row)
                                                    .then(() => {
                                                        getData();
                                                    })
                                                    .catch(() => {
                                                        Toaster.show({
                                                            intent: Intent.DANGER,
                                                            message:
                                                                'Could not resume connection with remote cluster.',
                                                        });
                                                    });
                                            }
                                        }}
                                        disabled={!row.isConnected}
                                    >
                                        {using ? 'Stop' : 'Start'}
                                    </Button>
                                </ButtonGroup>
                            );
                        },
                    },
                ]}
            />
        </Card>
    );
}
