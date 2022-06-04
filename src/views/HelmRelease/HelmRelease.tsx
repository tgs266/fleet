/* eslint-disable no-param-reassign */
/* eslint-disable react/no-danger */
/* eslint-disable react/static-property-placement */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/prefer-stateless-function */
import '../../styles/markdown.scss';
import { Card, Intent, Spinner } from '@blueprintjs/core';
import React from 'react';
import TitledCard from '../../components/Cards/TitledCard';
import Text from '../../components/Text/Text';
import { Release, Resource } from '../../models/helm.model';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import Helm from '../../services/helm.service';
import LabeledText from '../../components/LabeledText';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import { groupBy } from '../../utils/sort';
import Table from '../../components/Table';
import TableHeader from '../../components/TableHeader';
import TableCell from '../../components/TableCell';
import TableBody from '../../components/TableBody';
import TableRow from '../../components/TableRow';
import { buildGenericLink } from '../../utils/routing';
import Link from '../../layouts/Link';

interface IHelmReleaseState {
    release: Release;
}

const getLink = (g: Resource) => {
    const data = buildGenericLink(g.kind, g.metadata.name, g.metadata.namespace);
    if (!data.valid) {
        return data.link;
    }
    return <Link to={data.link}>{g.metadata.name}</Link>;
};

class HelmRelease extends React.Component<IWithRouterProps, IHelmReleaseState> {
    static contextType = NavContext;

    constructor(props: any) {
        super(props);
        this.state = { release: null };
    }

    componentDidMount() {
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'Helm Releases',
                    link: '/helm/releases',
                },
                {
                    text: this.props.params.name,
                },
            ] as IBreadcrumb[],
            buttons: [],
            menu: null,
        });
        Helm.getRelease(this.props.params.name).then((r) => {
            this.setState({ release: r.data });
        });
    }

    render() {
        const { release } = this.state;

        if (!release) {
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
            <div style={{ margin: '1em' }}>
                <TitledCard title={release.name}>
                    <div style={{ marginTop: '0.25em', display: 'flex' }}>
                        <LabeledText label="CHART">{release.chart.metadata.name}</LabeledText>
                        <LabeledText style={{ marginLeft: '2em' }} label="APP VERSION">
                            {release.chart.metadata.appVersion}
                        </LabeledText>
                        <LabeledText style={{ marginLeft: '2em' }} label="VERSION">
                            {release.chart.metadata.version}
                        </LabeledText>
                    </div>
                </TitledCard>
                <TitledCard style={{ marginTop: '1em', whiteSpace: 'pre-line' }} title="Notes">
                    <Text code>{release.info.notes}</Text>
                </TitledCard>
                <TitledCard style={{ marginTop: '1em' }} title="Resources">
                    {Object.values(groupBy(release.resources, 'kind')).map((group: Resource[]) => (
                        <Card style={{ padding: 0, marginBottom: '1em' }}>
                            <Table>
                                <TableHeader>
                                    <TableCell style={{ width: '70%' }}>
                                        {group[0].kind} Name
                                    </TableCell>
                                    <TableCell style={{ width: '30%' }}>Namespace</TableCell>
                                </TableHeader>
                                <TableBody>
                                    {group.map((g) => {
                                        g.metadata.namespace =
                                            release.namespace || g.metadata.namespace;
                                        return (
                                            <TableRow>
                                                <TableCell>{getLink(g)}</TableCell>
                                                <TableCell>{g.metadata.namespace}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Card>
                    ))}
                </TitledCard>
            </div>
        );
    }
}

export default withRouter(HelmRelease);
