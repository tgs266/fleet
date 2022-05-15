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

interface INamespaceState {
    namespace: NamespaceMeta;
    pollId: NodeJS.Timer;
}

class NamespaceDetails extends React.Component<IWithRouterProps, INamespaceState> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = { namespace: null, pollId: null };
    }

    componentDidMount() {
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'namespaces',
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
        K8.namespaces.getNamespace(this.props.params.namespace).then((response) => {
            this.setState({
                namespace: response.data,
                pollId: K8.pollFunction(5000, this.pull),
            });
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.pollId);
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
                    <DeploymentTable namespace={namespace.name} />
                </div>
                <div style={{ margin: '1em' }}>
                    <Text muted style={{ marginBottom: '0.25em', marginLeft: '0.25em' }}>
                        Pods
                    </Text>
                    <PodListTable namespace={namespace.name} />
                </div>
                <div style={{ margin: '1em' }}>
                    <Text muted style={{ marginBottom: '0.25em', marginLeft: '0.25em' }}>
                        Services
                    </Text>
                    <ServiceTable namespace={namespace.name} />
                </div>
            </div>
        );
    }
}

export default withRouter(NamespaceDetails);
