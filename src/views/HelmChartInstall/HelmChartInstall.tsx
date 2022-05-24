/* eslint-disable react/no-danger */
/* eslint-disable react/static-property-placement */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/prefer-stateless-function */
import '../../styles/markdown.scss';
import { Button, Card, InputGroup, Intent, Spinner } from '@blueprintjs/core';
import React from 'react';
import Text from '../../components/Text/Text';
import { Chart, ChartInstall } from '../../models/helm.model';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import Helm from '../../services/helm.service';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import JsonYamlTextEditor from '../../components/TextEditor/JsonYamlTextEditor';
import NamespaceSelect from '../../components/NamespaceSelect';
import Toaster, { showToastWithActionInterval } from '../../services/toast.service';
import LoaderDialog from './LoaderDialog';

interface IHelmChartInstallState {
    chart: Chart;
    namespace: string;
    releaseName: string;
    value: string;
    isLoading: boolean;
}

class HelmChartInstall extends React.Component<IWithRouterProps, IHelmChartInstallState> {
    static contextType = NavContext;

    constructor(props: any) {
        super(props);
        this.state = {
            chart: null,
            namespace: 'default',
            releaseName: '',
            value: '',
            isLoading: false,
        };
    }

    componentDidMount() {
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'Helm Charts',
                    link: '/helm/charts',
                },
                {
                    text: this.props.params.repo,
                },
                {
                    text: this.props.params.name,
                    link: `/helm/charts/${this.props.params.repo}/${this.props.params.name}`,
                },
                {
                    text: 'install',
                },
            ] as IBreadcrumb[],
            buttons: [],
            menu: null,
        });
        Helm.getChart(this.props.params.repo, this.props.params.name).then((r) => {
            this.setState({ chart: r.data, value: r.data.values });
        });
    }

    setNamespace = (ns: string) => {
        this.setState({ namespace: ns });
    };

    toggleLoading = () => {
        this.setState({ isLoading: !this.state.isLoading });
    };

    install = () => {
        const data: ChartInstall = {
            namespace: this.state.namespace,
            chartName: this.state.chart.name,
            repo: this.state.chart.repo,
            version: this.state.chart.version,
            value: this.state.value,
            releaseName:
                this.state.releaseName && this.state.releaseName !== ''
                    ? this.state.releaseName
                    : this.state.chart.name,
        };
        this.toggleLoading();
        Helm.installChart(data)
            .then(() => {
                showToastWithActionInterval(
                    {
                        message: 'Installation successful! Redirecting in 5s',
                        intent: Intent.SUCCESS,
                        action: {
                            onClick: this.navBack,
                            text: 'Go Now',
                        },
                    },
                    5000,
                    this.navBack
                );
            })
            .catch(() => {
                Toaster.show({ message: 'Installation failed', intent: Intent.DANGER });
            })
            .finally(this.toggleLoading);
    };

    navBack = () => {
        this.props.navigate(`/helm/charts/${this.props.params.repo}/${this.props.params.name}`);
    };

    render() {
        const { chart } = this.state;

        if (!chart) {
            return (
                <div style={{ padding: '5em' }}>
                    <Spinner intent={Intent.PRIMARY} size={100} />
                    <div
                        style={{
                            marginTop: '1em',
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <Text muted>Loading</Text>
                    </div>
                </div>
            );
        }

        return (
            <>
                <LoaderDialog text="Installing" isOpen={this.state.isLoading} />
                <Card
                    style={{
                        padding: 0,
                        margin: '1em',
                        height: 'calc(100vh - 2em - 46px)',
                        overflow: 'clip',
                    }}
                >
                    <div style={{ padding: '1em', display: 'flex', alignItems: 'center' }}>
                        <Text large style={{ marginRight: '1em' }}>
                            {this.props.params.repo}/{this.props.params.name}
                        </Text>
                        <Text large style={{ marginRight: '0.25em' }}>
                            Namespace:
                        </Text>
                        <NamespaceSelect
                            style={{ width: '160px', marginRight: '1em' }}
                            selected={this.state.namespace}
                            setSelected={this.setNamespace}
                        />
                        <InputGroup
                            style={{ width: '160px', marginRight: '1em' }}
                            placeholder="Name (optional)"
                            onChange={(e) => this.setState({ releaseName: e.target.value })}
                        />
                        <Button
                            intent={Intent.NONE}
                            minimal
                            style={{ marginRight: '1em' }}
                            onClick={this.navBack}
                        >
                            Cancel
                        </Button>
                        <Button intent={Intent.PRIMARY} onClick={this.install}>
                            Install
                        </Button>
                    </div>
                    <JsonYamlTextEditor
                        value={this.state.value}
                        onChange={(e) => {
                            this.setState({ value: e });
                        }}
                    />
                </Card>
            </>
        );
    }
}

export default withRouter(HelmChartInstall);
