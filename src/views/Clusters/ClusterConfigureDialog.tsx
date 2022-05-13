import React from 'react';
import { Dialog } from '@blueprintjs/core';
import Code from '../../components/Text/Code';

export default function ClusterConfigureDialog(props: { open: boolean; onClose: () => void }) {
    const maxWidth = '70%';
    return (
        <Dialog
            title="Configure New Cluster"
            isOpen={props.open}
            style={{ padding: 0, maxWidth, width: maxWidth }}
            onClose={props.onClose}
        >
            <div style={{ padding: '20px' }}>
                <div>Fleet needs to be installed on the remote cluster. That includes:</div>
                <ul>
                    <li>Fleet API (installed in namespace fleet)</li>
                    <li>Prometheus (installed in namespace fleet-metrics)</li>
                    <li>Node Exporter (installed in namespace fleet-metrics)</li>
                    <li>Kube State Metrics (installed in namespace fleet-metrics)</li>
                </ul>
                <div>
                    To see exactly what is going to be installed, please view the files{' '}
                    <a
                        target="_blank"
                        href="https://github.com/tgs266/fleet/tree/main/deploy"
                        rel="noreferrer"
                    >
                        here
                    </a>
                </div>
                <div>
                    To install fleet, run the following command (with a kubectl instance that has
                    access to the cluster):{' '}
                </div>
                <Code>
                    <div>
                        curl
                        https://raw.githubusercontent.com/tgs266/fleet/main/deploy/full-deploy.sh -o
                        full-deploy.sh &&
                    </div>
                    <div>chmod +x full-deploy.sh &&</div>
                    <div>./full-deploy.sh</div>
                </Code>
            </div>
        </Dialog>
    );
}
