/* eslint-disable react/no-array-index-key */
/* eslint-disable react/static-property-placement */
import * as React from 'react';
import { Button, Card, Intent, Tag } from '@blueprintjs/core';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import InfoCard from '../../components/Cards/InfoCard';
import LabeledText from '../../components/LabeledText';
import Label from '../../components/Label';
import Text from '../../components/Text/Text';
import AgeText from '../../components/AgeText';
import TagList from '../../components/TagList';
import { Role } from '../../models/role.model';
import TitledCard from '../../components/Cards/TitledCard';
import RuleTable from '../../components/RuleTable';
import EditableResource from '../../components/EditableResource';
import ResourceView from '../../components/ResourceView';

class RoleDetails extends ResourceView<Role, IWithRouterProps, {}> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props, K8.roles, 'roleName');
    }

    componentDidMount() {
        super.componentDidMount();
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'Roles',
                    link: '/roles',
                },
                {
                    text: this.props.params.roleName,
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
        const { resource: role } = this.state;
        return (
            <div>
                <EditableResource
                    delete
                    type="roles"
                    namespace={this.props.params.namespace}
                    name={this.props.params.roleName}
                />
                <div style={{ margin: '1em', marginBottom: 0 }}>
                    <div style={{ marginBottom: '1em' }}>
                        <InfoCard title={role.name}>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabeledText label="NAMESPACE">{role.namespace}</LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="AGE">
                                    <AgeText value={role.createdAt} hr />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="CREATED AT">
                                    <AgeText value={role.createdAt} />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="UID">
                                    {role.uid}
                                </LabeledText>
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                {role.labels && (
                                    <Label label="LABELS">
                                        <TagList>
                                            {Object.keys(role.labels).map((key) => (
                                                <Tag key={key} intent={Intent.NONE} round>
                                                    <Text small>
                                                        {key}: {role.labels[key]}
                                                    </Text>
                                                </Tag>
                                            ))}
                                        </TagList>
                                    </Label>
                                )}
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                {role.annotations && (
                                    <Label label="ANNOTATIONS">
                                        <TagList>
                                            {Object.keys(role.annotations).map((key) => (
                                                <Tag key={key} intent={Intent.NONE} round>
                                                    <Text small>
                                                        {key}: {role.annotations[key]}
                                                    </Text>
                                                </Tag>
                                            ))}
                                        </TagList>
                                    </Label>
                                )}
                            </div>
                        </InfoCard>

                        <TitledCard style={{ marginTop: '1em' }} title="Rules">
                            <Card style={{ padding: 0 }}>
                                <RuleTable rules={role.rules} />
                            </Card>
                        </TitledCard>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(RoleDetails);
