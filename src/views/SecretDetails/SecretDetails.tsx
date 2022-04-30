/* eslint-disable react/static-property-placement */
import * as React from 'react';
import { Button } from '@blueprintjs/core';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import InfoCard from '../../components/InfoCard';
import LabeledText from '../../components/LabeledText';
import AgeText from '../../components/AgeText';
import { Secret } from '../../models/secret.model';
import LabeledLabelsTagList from '../../components/LabelsTagList';
import LabeledAnnotationsTagList from '../../components/AnnotationsTagList';
import EditableResource from '../../components/EditableResource';
import SecretAccordionList from './SecretAccordionList';

interface ISecretDetailsState {
    secret: Secret;
    pollId: NodeJS.Timer;
}

class SecretDetails extends React.Component<IWithRouterProps, ISecretDetailsState> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = {
            secret: null,
            pollId: null,
        };
    }

    componentDidMount() {
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'secrets',
                    link: '/secrets',
                },
                {
                    text: this.props.params.secretName,
                },
            ] as IBreadcrumb[],
            buttons: [
                <Button key="refresh" data-testid="refresh" icon="refresh" onClick={this.pull} />,
            ],
            menu: null,
        });
        K8.secrets
            .getSecret(this.props.params.secretName, this.props.params.namespace)
            .then((response) => {
                this.setState({
                    secret: response.data,
                    pollId: K8.poll(
                        1000,
                        K8.secrets.getSecret,
                        (r) => {
                            this.setState({ secret: r.data });
                        },
                        this.props.params.secretName,
                        this.props.params.namespace
                    ),
                });
            });
    }

    componentWillUnmount() {
        clearInterval(this.state.pollId);
    }

    pull = () => {
        K8.secrets
            .getSecret(this.props.params.secretName, this.props.params.namespace)
            .then((response) => {
                this.setState({ secret: response.data });
            });
    };

    render() {
        if (!this.state.secret) {
            return null;
        }
        const { secret } = this.state;
        return (
            <div>
                <EditableResource
                    type="secrets"
                    name={secret.name}
                    namespace={secret.namespace}
                    refresh={this.pull}
                />
                <div style={{ margin: '1em', marginBottom: 0 }}>
                    <div style={{ marginBottom: '1em' }}>
                        <InfoCard title={secret.name}>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabeledText label="NAMESPACE">{secret.namespace}</LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="AGE">
                                    <AgeText value={secret.createdAt} hr />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="CREATED AT">
                                    <AgeText value={secret.createdAt} />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="UID">
                                    {secret.uid}
                                </LabeledText>
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabeledLabelsTagList obj={secret} />
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabeledAnnotationsTagList obj={secret} />
                            </div>
                        </InfoCard>
                    </div>

                    <div style={{ marginBottom: '1em' }}>
                        <SecretAccordionList data={secret.data} />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SecretDetails);
