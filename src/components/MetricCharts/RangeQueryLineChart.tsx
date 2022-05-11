/* eslint-disable class-methods-use-this */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import _ from 'lodash';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { JSONObjectType } from '../../models/json.model';
import {
    PrometheusRangeQueryResponse,
    PrometheusRangeQuery,
    PrometheusResponse,
} from '../../models/prometheus.model';
import Prometheus from '../../services/prometheus.service';
import skipTicksCallback, { COLORS } from '../../utils/charts';
import K8 from '../../services/k8.service';
import { BytesTo } from '../../utils/conversions';
import precisionRound from '../../utils/numbers';

export interface IRangeQueryLineChartProps {
    queries?: JSONObjectType<PrometheusRangeQuery>;
    labels: JSONObjectType<string>;
    data?: JSONObjectType<PrometheusResponse<PrometheusRangeQueryResponse>>;
    unit?: string;
    bytes?: boolean;
    height?: string | number;
    title?: string;
    lineWidth?: number;
    legend?: boolean;
}

interface IRangeQueryLineChartState {
    data: JSONObjectType<PrometheusResponse<PrometheusRangeQueryResponse>>;
    pollId: NodeJS.Timer;
}

class RangeQueryLineChart extends React.Component<
    IRangeQueryLineChartProps,
    IRangeQueryLineChartState
> {
    constructor(props: any) {
        super(props);
        Chart.register(...registerables);
        this.state = {
            data: null,
            pollId: null,
        };
    }

    componentDidMount() {
        if (!this.props.data) {
            Prometheus.queryRange(this.props.queries).then((r) => {
                this.setState({
                    data: r.data,
                    pollId: K8.pollFunction(1000 * 30, () =>
                        Prometheus.queryRange(this.props.queries).then((r2) => {
                            this.setState({ data: r2.data });
                        })
                    ),
                });
            });
        }
    }

    shouldComponentUpdate(nextProps: IRangeQueryLineChartProps) {
        if (_.isEqual(nextProps, this.props)) {
            return false;
        }
        return true;
    }

    componentWillUnmount() {
        if (this.state.pollId) {
            clearInterval(this.state.pollId);
        }
    }

    getLabels = (data: JSONObjectType<PrometheusResponse<PrometheusRangeQueryResponse>>) => {
        const labels = [];
        for (const k of Object.keys(data)) {
            if (data[k]) {
                if (data[k].data.result.length !== 0) {
                    for (const values of data[k].data.result[0].values) {
                        labels.push(new Date(values[0] * 1000));
                    }
                    break;
                }
            }
        }
        return labels;
    };

    buildDatasets = () => {
        const data = this.props.data || this.state.data;
        const labels = this.getLabels(data);

        if (labels.length === 0) {
            return null;
        }

        const datasets = [];
        let i = 0;
        for (const key of Object.keys(data)) {
            if (!data[key]) {
                continue;
            }
            for (const { values, metric } of data[key].data.result) {
                const label = metric[this.props.labels[key]] as string;
                datasets.push({
                    label,
                    data: values.map((value) => precisionRound(Number(value[1]), 3)),
                    backgroundColor: COLORS[i],
                    borderColor: COLORS[i],
                    pointRadius: 0,
                    tension: 0.4,
                    borderWidth: this.props.lineWidth || 2,
                });
                i += 1;
                if (i > COLORS.length) {
                    i = 0;
                }
            }
        }

        return {
            labels,
            datasets,
        };
    };

    convertValue = (value: number | string) => {
        let float;
        if (typeof value === 'string') {
            float = parseFloat(value);
        } else {
            float = value;
        }
        if (!this.props.unit && !this.props.bytes) {
            return `${float}`;
        }
        if (!this.props.bytes && this.props.unit) {
            return `${float} ${this.props.unit}`;
        }
        if (float < 1) {
            return float.toFixed(3);
        }
        return BytesTo.unit(float);
    };

    render() {
        if (!this.state.data && !this.props.data) {
            return null;
        }
        const ds = this.buildDatasets();
        if (!ds) {
            return null;
        }

        return (
            <div>
                <Line
                    height={this.props.height}
                    data={ds}
                    options={{
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: (item) => {
                                        const { label, data } = ds.datasets[item.datasetIndex];
                                        const value = data[item.dataIndex];
                                        return `${label}: ${this.convertValue(value)}`;
                                    },
                                },
                            },
                            legend: {
                                position: 'right',
                                align: 'start',
                                display: this.props.legend || false,
                            },
                            title: {
                                padding: 5,
                                font: {
                                    size: 16,
                                    family: 'Gidole',
                                },
                                display: true,
                                text: this.props.title,
                            },
                        },
                        scales: {
                            x: {
                                ticks: {
                                    callback: skipTicksCallback(3),
                                    maxRotation: 20,
                                    minRotation: 0,
                                },
                                type: 'timeseries',
                            },
                            y: {
                                ticks: {
                                    callback: (value) => this.convertValue(value as number),
                                },
                            },
                        },
                    }}
                />
            </div>
        );
    }
}

export default RangeQueryLineChart;
