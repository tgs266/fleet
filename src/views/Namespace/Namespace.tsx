/* eslint-disable react/static-property-placement */
import * as React from 'react';
import EditableResource from '../../components/EditableResource';
import Text from '../../components/Text/Text';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import DeploymentTable from '../DeploymentList/DeploymentTable';
import PodListTable from '../PodList/PodListTable';
import ServiceTable from '../ServiceList/ServiceTable';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { NamespaceMeta } from '../../models/namespace.model';
import SSE from '../../services/sse.service';

interface INamespaceState {
    namespace: NamespaceMeta;
    sse: SSE;
}

class NamespaceDetails extends React.Component<IWithRouterProps, INamespaceState> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = { namespace: null, sse: null };
    }

    componentDidMount() {
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
        K8.namespaces.getNamespace(this.props.params.namespace).then((response) => {
            this.setState({ namespace: response.data });
        });
        this.setState({
            sse: K8.namespaces
                .sse(this.props.params.namespace)
                .subscribe<NamespaceMeta>((data) => this.setState({ namespace: data })),
        });
    }

    componentWillUnmount() {
        this.state.sse.close();
    }

    pull = () => {
        K8.namespaces.getNamespace(this.props.params.namespace).then((response) => {
            this.setState({ namespace: response.data });
        });
    };

    render() {
        if (!this.state.namespace) {
            return null;
        }
        const { namespace } = this.state;
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
