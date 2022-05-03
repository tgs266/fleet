import React from 'react';
import ConditionTable from '../../../components/ConditionTable';
import ContainerSpecContainer from '../../../components/ContainerSpec/ContainerSpecContainer';
import PodContainer from '../../../components/PodContainer';
import { Deployment } from '../../../models/deployment.model';
import DeploymentEvents from '../DeploymentEvents';
import DeploymentServiceContainer from '../DeploymentServiceContainer';

export default function Details(props: { deployment: Deployment; refresh: () => void }) {
    const { deployment } = props;
    return (
        <>
            <div style={{ margin: '1em' }}>
                <ConditionTable conditions={deployment.conditions} ignoreProbe />
            </div>
            <PodContainer
                style={{ margin: '1em', marginTop: 0 }}
                pods={deployment.pods}
                readyReplicas={deployment.readyReplicas}
                replicas={deployment.replicas}
            />
            <DeploymentServiceContainer
                style={{ margin: '1em', marginTop: 0 }}
                services={deployment.services}
            />
            <ContainerSpecContainer
                refresh={props.refresh}
                style={{ margin: '1em', marginTop: 0 }}
                containerSpecs={deployment.containerSpecs}
            />
            <DeploymentEvents deploymentName={deployment.name} namespace={deployment.namespace} />
        </>
    );
}
