/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable class-methods-use-this */
import { Intent, Spinner, Card, InputGroup, Tag } from '@blueprintjs/core';
import React from 'react';
import { Link } from 'react-router-dom';
import Text from '../../components/Text/Text';
import { TableSort } from '../../components/SortableTableHeaderCell';
import ResourceTableView from '../../components/ResourceTableView';
import { Chart } from '../../models/helm.model';
import Helm from '../../services/helm.service';
import getOffset from '../../utils/table';

class HelmChartTable extends ResourceTableView<unknown, Chart> {
    itemsFcn = Helm.queryCharts;

    useFilters = true;

    useSearch = false;

    title = 'Helm Charts';

    keypath = 'name';

    poll = false;

    getPullParameters = (sort?: TableSort, page?: number) => {
        const usingSort = sort || this.state.sort;
        const usingPage = page !== null ? page : this.state.page;

        return [
            usingSort,
            getOffset(usingPage, this.state.pageSize, this.state.total),
            this.state.pageSize,
        ];
    };

    getColumns = () => [
        {
            key: 'icon',
            type: 'icon',
            columnName: '',
            columnFunction: (row: Chart) => (
                <img
                    src={row.icon}
                    style={{
                        width: '16px',
                        height: '100%',
                        verticalAlign: 'middle',
                        objectFit: 'cover',
                    }}
                />
            ),
        },
        {
            key: 'name',
            columnName: 'Name',
            sortableId: 'name',
            searchable: true,
            columnFunction: (row: Chart) => (
                <Link to={`/helm/charts/${row.repo}/${row.name}`}>{row.name}</Link>
            ),
        },
        {
            key: 'version',
            columnName: 'Version',
            columnFunction: (row: Chart) => row.version,
        },
        {
            key: 'appVersion',
            columnName: 'App Version',
            columnFunction: (row: Chart) => row.appVersion,
        },
        {
            key: 'repo',
            columnName: 'Repository',
            sortableId: 'repo',
            columnFunction: (row: Chart) => row.repo,
        },
        {
            key: 'deprecated',
            columnName: 'Deprecated?',
            columnFunction: (row: Chart) => (
                <Tag round intent={row.deprecated ? Intent.DANGER : Intent.SUCCESS}>
                    {row.deprecated ? 'TRUE' : 'FALSE'}
                </Tag>
            ),
        },
    ];

    renderInner() {
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

        return this.getResourceTable();
    }

    render() {
        return (
            <>
                <Card style={{ borderRadius: '200px', padding: '10px', marginBottom: '1em' }}>
                    <InputGroup
                        onChange={(e) =>
                            this.onFilterChange([
                                {
                                    operator: 'in',
                                    property: 'name',
                                    value: e.target.value,
                                },
                            ])
                        }
                        leftIcon="search"
                        round
                        fill
                        placeholder="Search for charts"
                    />
                </Card>
                {this.renderInner()}
            </>
        );
    }
}

export default HelmChartTable;
