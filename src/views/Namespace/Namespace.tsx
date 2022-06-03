/* eslint-disable react/static-property-placement */
import * as React from 'react';
import EditableResource from '../../components/EditableResource';
import Text from '../../components/Text/Text';
import { IBreadcrumb } from '../../layouts/Navigation';
import DeploymentTable from '../DeploymentList/DeploymentTable';
import PodListTable from '../PodList/PodListTable';
import ServiceTable from '../ServiceList/ServiceTable';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { NamespaceMeta } from '../../models/namespace.model';
import ResourceView from '../../components/ResourceView';

class NamespaceDetails extends ResourceView<NamespaceMeta, IWithRouterProps, {}> {
    constructor(props: IWithRouterProps) {
        super(props, K8.namespaces, 'namespace');
    }

    componentDidMount() {
        super.componentDidMount();
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'Namespaces',
                    link: '/namespaces',
                },
                {
                    text: this.props.params.namespace,
                },
            ] as IBreadcrumb[],
            buttons: [],
            menu: null,
        });
    }

    render() {
        if (!this.state.resource) {
            return null;
        }
        const { resource: namespace } = this.state;
        return (
            <div>
                <EditableResource
                    delete
                    refresh={this.pull}
                    type="namespaces"
                    name={namespace.name}
                />

                <div style={{ margin: '1em' }}>
                    <Text muted style={{ marginBottom: '0.25em', marginLeft: '0.25em' }}>
                        Deployments
                    </Text>
                    <DeploymentTable lockedNamespace={namespace.name} namespace={namespace.name} />
                </div>
                <div style={{ margin: '1em' }}>
                    <Text muted style={{ marginBottom: '0.25em', marginLeft: '0.25em' }}>
                        Pods
                    </Text>
                    <PodListTable lockedNamespace={namespace.name} namespace={namespace.name} />
                </div>
                <div style={{ margin: '1em' }}>
                    <Text muted style={{ marginBottom: '0.25em', marginLeft: '0.25em' }}>
                        Services
                    </Text>
                    <ServiceTable lockedNamespace={namespace.name} namespace={namespace.name} />
                </div>
            </div>
        );
    }
}

export default withRouter(NamespaceDetails);
