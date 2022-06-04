/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable class-methods-use-this */
import { Intent, Spinner, Tag } from '@blueprintjs/core';
import React from 'react';
import Text from '../../components/Text/Text';
import { TableSort } from '../../components/SortableTableHeaderCell';
import ResourceTableView from '../../components/ResourceTableView';
import Helm from '../../services/helm.service';
import getOffset from '../../utils/table';
import { Release } from '../../models/helm.model';
import Link from '../../layouts/Link';

class HelmReleaseTable extends ResourceTableView<unknown, Release> {
    itemsFcn = Helm.queryReleases;

    useFilters = true;

    useSearch = true;

    namespaced = true;

    title = 'Helm Releases';

    keypath = 'name';

    poll = false;

    getPullParameters = (sort?: TableSort, page?: number) => {
        const usingSort = sort || this.state.sort;
        const usingPage = page !== null ? page : this.state.page;

        return {
            sort: usingSort,
            offset: getOffset(usingPage, this.state.pageSize, this.state.total),
            pageSize: this.state.pageSize,
        };
    };

    getColumns = () => [
        {
            key: 'name',
            columnName: 'Name',
            sortableId: 'name',
            searchable: true,
            columnFunction: (row: Release) => (
                <Link to={`/helm/releases/${row.name}`}>{row.name}</Link>
            ),
        },
        {
            key: 'namespace',
            columnName: 'Namespace',
            sortableId: 'namespace',
            columnFunction: (row: Release) => row.namespace,
        },
        {
            key: 'chart',
            columnName: 'Chart',
            sortableId: 'chart',
            columnFunction: (row: Release) => row.chart.metadata.name,
        },
        {
            key: 'version',
            columnName: 'Version',
            columnFunction: (row: Release) => row.chart.metadata.version,
        },
        {
            key: 'appVersion',
            columnName: 'App Version',
            columnFunction: (row: Release) => row.chart.metadata.appVersion,
        },
        {
            key: 'status',
            columnName: 'Status',
            columnFunction: (row: Release) => (
                <Tag round intent={row.info.status === 'deployed' ? Intent.SUCCESS : Intent.NONE}>
                    {row.info.status}
                </Tag>
            ),
        },
    ];

    render() {
        if (!this.state.items) {
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

        return <div style={{ margin: '1em' }}>{this.getResourceTable()}</div>;
    }
}

export default HelmReleaseTable;
