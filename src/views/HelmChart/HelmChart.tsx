/* eslint-disable react/no-danger */
/* eslint-disable react/static-property-placement */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/prefer-stateless-function */
import '../../styles/markdown.scss';
import { Intent, Spinner, Card, Tag, Button } from '@blueprintjs/core';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import React from 'react';
import TitledCard from '../../components/Cards/TitledCard';
import Text from '../../components/Text/Text';
import { Chart } from '../../models/helm.model';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import Helm from '../../services/helm.service';
import LabeledText from '../../components/LabeledText';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import TagList from '../../components/TagList';

interface IHelmChartState {
    chart: Chart;
}

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    // Set all elements owning target to target=_blank
    if ('target' in node) {
        node.setAttribute('target', '_blank');
    }
});

class HelmChart extends React.Component<IWithRouterProps, IHelmChartState> {
    static contextType = NavContext;

    constructor(props: any) {
        super(props);
        this.state = { chart: null };
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
                },
            ] as IBreadcrumb[],
            buttons: [
                <Link
                    to={`/helm/charts/${this.props.params.repo}/${this.props.params.name}/install`}
                >
                    <Button intent={Intent.PRIMARY}>Install</Button>
                </Link>,
            ],
            menu: null,
        });
        Helm.getChart(this.props.params.repo, this.props.params.name).then((r) => {
            this.setState({ chart: r.data });
        });
    }

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

        const htmlCode = DOMPurify.sanitize(marked(chart.readme));

        return (
            <div style={{ margin: '1em', maxWidth: 'calc(100vw - 5em - 8px)' }}>
                <TitledCard
                    title={chart.name}
                    rightElement={
                        <img
                            src={chart.icon}
                            style={{
                                width: '25px',
                                height: '100%',
                                verticalAlign: 'middle',
                                objectFit: 'cover',
                            }}
                        />
                    }
                >
                    <div style={{ marginTop: '0.25em', display: 'flex' }}>
                        <LabeledText label="REPO">{chart.repo}</LabeledText>
                        <LabeledText style={{ marginLeft: '2em' }} label="APP VERSION">
                            {chart.appVersion}
                        </LabeledText>
                        <LabeledText style={{ marginLeft: '2em' }} label="VERSION">
                            {chart.version}
                        </LabeledText>
                    </div>
                    <div style={{ marginTop: '0.25em', display: 'flex' }}>
                        <LabeledText label="DESCRIPTION">{chart.description}</LabeledText>
                    </div>
                    <div style={{ marginTop: '0.25em', display: 'flex' }}>
                        <LabeledText label="HOME">
                            <Link to={chart.home} target="_blank">
                                {chart.home}
                            </Link>
                        </LabeledText>
                        <LabeledText style={{ marginLeft: '2em' }} label="MAINTAINERS">
                            <TagList>
                                {chart.maintainers.map((m) => (
                                    <Tag key={m.email} round>
                                        <Link
                                            target="_blank"
                                            style={{ color: 'white' }}
                                            to={`mailto:${m.email}`}
                                        >
                                            {m.name}
                                        </Link>
                                    </Tag>
                                ))}
                            </TagList>
                        </LabeledText>
                    </div>
                    <div style={{ marginTop: '0.25em', display: 'flex' }}>
                        <LabeledText label="KEYWORDS">
                            <TagList>
                                {chart.keywords.map((k) => (
                                    <Tag key={k} round>
                                        {k}
                                    </Tag>
                                ))}
                            </TagList>
                        </LabeledText>
                    </div>
                </TitledCard>

                <Card style={{ marginTop: '1em' }}>
                    <div className="markdown" dangerouslySetInnerHTML={{ __html: htmlCode }} />
                </Card>
            </div>
        );
    }
}

export default withRouter(HelmChart);
