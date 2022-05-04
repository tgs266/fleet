/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unstable-nested-components */
import { Alignment, Colors, Icon } from '@blueprintjs/core';
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { Link } from 'react-router-dom';
import ResourceTableView from '../../components/ResourceTableView';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { DeploymentMeta } from '../../models/deployment.model';
import K8 from '../../services/k8.service';
import { buildLinkToDeployment, buildLinkToNamespace } from '../../utils/routing';
import getOffset from '../../utils/table';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';

interface IDeploymentTableProps {
    namespace?: string;
}

class DeploymentTable extends ResourceTableView<IDeploymentTableProps, DeploymentMeta> {
    // eslint-disable-next-line react/static-property-placement
    itemsFcn = K8.deployments.getDeployments;

    useFilters = true;

    getPullParameters = (sort?: TableSort, page?: number) => {
        const usingSort = sort || this.state.sort;
        const usingPage = page !== null ? page : this.state.page;

        return [
            this.props.namespace,
            usingSort,
            getOffset(usingPage, this.state.pageSize, this.state.total),
            this.state.pageSize,
        ];
    };

    getColumns = () => [
        {
            key: 'icon',
            alignment: Alignment.LEFT,
            columnName: '',
            columnFunction: (row: DeploymentMeta) => {
                let color;
                switch (row.readyReplicas) {
                    case 0:
                        color = Colors.RED4;
                        break;
                    case row.replicas:
                        color = Colors.GREEN4;
                        break;
                    default:
                        color = Colors.GOLD5;
                        break;
                }
                const statusHtml = <Icon color={color} icon="full-circle" size={14} />;
                return (
                    <Tooltip2 content={`${row.readyReplicas}/${row.replicas} pods running`}>
                        {statusHtml}
                    </Tooltip2>
                );
            },
        },
        {
            key: 'name',
            sortableId: 'name',
            columnName: 'Name',
            searchable: true,
            columnFunction: (row: DeploymentMeta) => (
                <Link to={buildLinkToDeployment(row.name, row.namespace)}>{row.name}</Link>
            ),
        },
        {
            key: 'namespace',
            sortableId: 'namespace',
            columnName: 'Namespace',
            searchable: true,
            columnFunction: (row: DeploymentMeta) => (
                <Link to={buildLinkToNamespace(row.namespace)}>{row.namespace}</Link>
            ),
        },
        {
            key: 'age',
            columnName: 'Age',
            sortableId: 'created_at',
            columnFunction: (row: DeploymentMeta) => (
                <Tooltip2
                    className={Classes.TOOLTIP2_INDICATOR}
                    content={createdAtToOrigination(row.createdAt)}
                >
                    {createdAtToHumanReadable(row.createdAt)}
                </Tooltip2>
            ),
        },
        {
            key: 'pods',
            columnName: 'Pods',
            columnFunction: (row: DeploymentMeta) => `${row.readyReplicas}/${row.replicas}`,
        },
    ];
}

export default DeploymentTable;
