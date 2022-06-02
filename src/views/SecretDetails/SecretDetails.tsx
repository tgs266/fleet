/* eslint-disable react/static-property-placement */
import * as React from 'react';
import { Button } from '@blueprintjs/core';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { IBreadcrumb } from '../../layouts/Navigation';
import InfoCard from '../../components/Cards/InfoCard';
import LabeledText from '../../components/LabeledText';
import AgeText from '../../components/AgeText';
import { Secret } from '../../models/secret.model';
import LabelsTagList from '../../components/LabelsTagList';
import AnnotationsTagList from '../../components/AnnotationsTagList';
import EditableResource from '../../components/EditableResource';
import SecretAccordionList from './SecretAccordionList';
import ResourceView from '../../components/ResourceView';

class SecretDetails extends ResourceView<Secret, IWithRouterProps, {}> {
    constructor(props: IWithRouterProps) {
        super(props, K8.secrets, 'secretName');
    }

    componentDidMount() {
        super.componentDidMount();
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'Secrets',
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
    }

    render() {
        if (!this.state.resource) {
            return null;
        }
        const { resource: secret } = this.state;
        return (
            <div>
                <EditableResource
                    delete
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
                                <LabelsTagList obj={secret} />
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <AnnotationsTagList obj={secret} />
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
