/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/lines-between-class-members */
import * as React from 'react';
import { XTerm } from 'xterm-for-react';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import { getWSUrl } from '../../services/axios.service';
import getWebsocket from '../../services/websocket';

interface IShellState {
    exec: WebSocket;
}

class Shell extends React.Component<IWithRouterProps, IShellState> {
    // eslint-disable-next-line react/static-property-placement
    static contextType = NavContext;

    xtermRef: React.RefObject<XTerm>;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = {
            exec: null,
        };

        this.xtermRef = React.createRef();
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
                    link: `/pods/${this.props.params.namespace}/${this.props.params.podName}/containers/${this.props.params.containerName}`,
                },
                {
                    text: 'shell',
                },
            ] as IBreadcrumb[],
            buttons: [],
            menu: null,
        });
        const exec = getWebsocket(
            getWSUrl(
                `/ws/v1/pods/${this.props.params.namespace}/${this.props.params.podName}/containers/${this.props.params.containerName}/exec`
            )
        );
        exec.onmessage = (m) => {
            const data = JSON.parse(m.data);
            this.xtermRef.current.terminal.write(data.data);
        };
        this.setState({
            exec,
        });
    }

    componentWillUnmount() {
        if (this.state.exec) {
            this.state.exec.close();
        }
    }

    render() {
        return (
            <div style={{ margin: '1em' }}>
                <XTerm
                    ref={this.xtermRef}
                    onData={(data) => {
                        this.state.exec.send(
                            JSON.stringify({
                                type: 'stdin',
                                data,
                            })
                        );
                    }}
                />
            </div>
        );
    }
}

export default withRouter(Shell);
