/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import { Alignment, ButtonGroup, Button, Card, Intent, Tag } from '@blueprintjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faLinkSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavContext } from '../../layouts/Navigation';
import Electron from '../../services/electron.service';
import { ElectronCluster } from '../../models/cluster.model';
import ResourceTable from '../../components/ResourceTable';
import Toaster from '../../services/toast.service';
import ClusterConfigureDialog from './ClusterConfigureDialog';
import { useClusterContext } from '../../contexts/ClusterContext';
import Auth from '../../services/auth.service';

export default function Clusters() {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const [, setState] = useNavContext();
    const [clusterCtx, setClusterContext] = useClusterContext();
    React.useEffect(
        () =>
            setState({
                breadcrumbs: [
                    {
                        text: 'clusters',
                    },
                ],
                buttons: [
                    <Button onClick={() => setIsDialogOpen(true)} intent={Intent.PRIMARY}>
                        Configure New Cluster
                    </Button>,
                ],
                menu: null,
            }),
        []
    );

    const [clusters, setClusters] = React.useState<ElectronCluster[]>([]);
    const [cluster, setCluster] = React.useState<ElectronCluster>({
        name: '',
        source: '',
        isConnected: false,
        port: '',
    });

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
                Auth.using().then((r2) => {
                    setCluster(r.data);
                    setClusterContext({
                        ...clusterCtx,
                        cluster: r.data,
                        useAuth: r2.data.usingAuth,
                    });
                });
            })
            .catch(() => {
                setCluster({
                    name: '',
                    source: '',
                    isConnected: false,
                    port: '',
                });
                setClusterContext({ cluster: null, useAuth: null, username: null });
            });
    };

    React.useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <ClusterConfigureDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
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
                                if (row.name === cluster.name) {
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
                            key: 'connect',
                            alignment: Alignment.RIGHT,
                            columnFunction: (row: ElectronCluster) => (
                                <ButtonGroup>
                                    <Button
                                        onClick={() => {
                                            Electron.connectToCluster(row).then((r) => {
                                                console.log(r.headers);
                                                window.localStorage.setItem('jwe', r.data.token);
                                                getData();
                                            });
                                        }}
                                    >
                                        <FontAwesomeIcon className="bp4-icon" icon={faLink} />
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            Electron.disconnectFromCluster(row.name).then(() => {
                                                getData();
                                            });
                                        }}
                                    >
                                        <FontAwesomeIcon className="bp4-icon" icon={faLinkSlash} />
                                    </Button>
                                </ButtonGroup>
                            ),
                        },
                    ]}
                />
            </Card>
        </>
    );
}
