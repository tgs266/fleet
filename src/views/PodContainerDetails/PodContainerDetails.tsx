/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/lines-between-class-members */
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { Container } from '../../models/container.model';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import PodContainerInfoCard from './PodContainerInfoCard';
import Accordion from '../../components/Accordion';
import { buildLinkToContainer } from '../../utils/routing';

interface IPodContainerState {
    container: Container;
    pollId: NodeJS.Timer;
    logLines: string[];
    ws: WebSocket;
}

class PodContainer extends React.Component<IWithRouterProps, IPodContainerState> {
    // eslint-disable-next-line react/static-property-placement
    static contextType = NavContext;

    podName: string;
    namespace: string;
    containerName: string;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = { container: null, pollId: null, logLines: [], ws: null };
        this.podName = this.props.params.podName;
        this.namespace = this.props.params.namespace;
        this.containerName = this.props.params.containerName;

        // this.messageRef = React.createRef<HTMLInputElement>()
    }

    componentDidMount() {
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'Pods',
                },
                {
                    text: this.props.params.podName,
                    link: `/pods/${this.props.params.namespace}/${this.props.params.podName}`,
                },
                {
                    text: this.props.params.containerName,
                },
            ] as IBreadcrumb[],
            buttons: [
                <Link
                    to={`${buildLinkToContainer(
                        this.props.params.namespace,
                        this.props.params.podName,
                        this.props.params.containerName
                    )}/shell`}
                >
                    <Button icon="console" />
                </Link>,
            ],
            menu: null,
        });
        K8.containers
            .getContainer(this.podName, this.namespace, this.containerName)
            .then((response) => {
                const ws = K8.containers.openLogWebsocket(
                    this.podName,
                    this.namespace,
                    this.containerName,
                    (event) => {
                        this.setState({
                            logLines: [...this.state.logLines, event.data.replace('\n', '')],
                        });
                    }
                );
                this.setState({
                    ws,
                    container: response.data,
                    pollId: K8.poll(
                        1000,
                        K8.containers.getContainer,
                        (r) => {
                            this.setState({ container: r.data });
                        },
                        this.podName,
                        this.namespace,
                        this.containerName
                    ),
                });
            });
    }

    componentWillUnmount() {
        clearInterval(this.state.pollId);
        if (this.state.ws) {
            this.state.ws.close();
        }
    }

    render() {
        if (!this.state.container) {
            return null;
        }
        const { container } = this.state;
        return (
            <div>
                <div style={{ margin: '1em', marginBottom: '0' }}>
                    <PodContainerInfoCard container={container} />
                </div>
                <div style={{ margin: '1em' }}>
                    <Accordion title={<h3 style={{ margin: '0' }}>Logs</h3>}>
                        <div className="log-container">
                            {this.state.logLines.map((m) => (
                                <div className="log-line">{m}</div>
                            ))}
                        </div>
                    </Accordion>
                </div>
            </div>
        );
    }
}

export default withRouter(PodContainer);
