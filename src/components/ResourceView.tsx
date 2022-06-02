/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/no-unused-state */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/static-property-placement */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { NavContext } from '../layouts/Navigation';
import { JSONObjectType } from '../models/json.model';
import { PrometheusRangeQueryResponse, PrometheusResponse } from '../models/prometheus.model';
import Resource from '../services/k8/resource.service';
import WS from '../services/websocket.service';
import { IWithRouterProps } from '../utils/withRouter';

export interface ResourceViewState<T> {
    resource: T;
    ws: WS;
    metricsData?: JSONObjectType<PrometheusResponse<PrometheusRangeQueryResponse>>;
    metricsPollId?: NodeJS.Timer;
    selectedTab?: string;
}

type ResourceService<T> = Resource<any, T>;

export default class ResourceView<T, P extends IWithRouterProps, S> extends React.Component<
    P,
    ResourceViewState<T> & S
> {
    static contextType = NavContext;

    resourceService: ResourceService<T>;

    nameKey: string;

    constructor(props: P, resourceService: ResourceService<T>, nameKey: string = 'name') {
        super(props);
        this.resourceService = resourceService;
        this.nameKey = nameKey;

        this.state = {
            resource: null,
            ws: null,
            ...this.state,
        };
    }

    componentDidMount() {
        const ws = this.initWs();
        ws.subscribe<T>((data: T) => {
            this.setState({ ws, resource: data } as ResourceViewState<T> & S);
        });
    }

    componentWillUnmount() {
        if (this.state.ws) {
            this.state.ws.close();
        }
        if (this.state.metricsPollId) {
            clearInterval(this.state.metricsPollId);
        }
    }

    initWs = () =>
        this.resourceService.ws({
            name: this.props.params[this.nameKey],
            namespace: this.props.params.namespace,
        });

    pull = () =>
        this.resourceService
            .get({
                name: this.props.params[this.nameKey],
                namespace: this.props.params.namespace,
            })
            .then((response) => {
                const { data } = response;
                this.setState({ resource: data } as ResourceViewState<T> & S);
            });
}
