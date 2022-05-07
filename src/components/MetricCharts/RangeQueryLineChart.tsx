/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import _ from 'lodash';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { JSONObjectType } from '../../models/json.model';
import {
    PrometheusQueryResponse,
    PrometheusRangeQuery,
    PrometheusResponse,
} from '../../models/prometheus.model';
import Prometheus from '../../services/prometheus.service';
import skipTicksCallback, { COLORS } from '../../utils/charts';
import K8 from '../../services/k8.service';
import { BytesTo } from '../../utils/conversions';

export interface IRangeQueryLineChartProps {
    queries?: JSONObjectType<PrometheusRangeQuery>;
    labels: JSONObjectType<string>;
    data?: JSONObjectType<PrometheusResponse<PrometheusQueryResponse>>;
    unit?: string;
    bytes?: boolean;
    height?: string | number;
    title?: string;
    lineWidth?: number;
}

interface IRangeQueryLineChartState {
    data: JSONObjectType<PrometheusResponse<PrometheusQueryResponse>>;
    pollId: NodeJS.Timer;
}

class RangeQueryLineChartState extends React.Component<
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

    buildDatasets = () => {
        const data = this.props.data || this.state.data;
        const labels = [];
        for (const k of Object.keys(data)) {
            if (data[k].data.result.length !== 0) {
                for (const values of data[k].data.result[0].values) {
                    labels.push(new Date(values[0] * 1000));
                }
                break;
            }
        }

        if (labels.length === 0) {
            return null;
        }

        const datasets = [];
        let i = 0;
        for (const key of Object.keys(data)) {
            const { values } = data[key].data.result[0];
            datasets.push({
                label: this.props.labels[key],
                data: values.map((value) => Number(value[1])),
                backgroundColor: COLORS[i],
                borderColor: COLORS[i],
                pointRadius: 0,
                tension: 0.4,
                borderWidth: this.props.lineWidth || 2,
            });
            i += 1;
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
                            title: {
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

export default RangeQueryLineChartState;
