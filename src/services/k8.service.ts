import { AxiosResponse } from 'axios';
import Containers from './k8/container.service';
import Images from './k8/image.service';
import Pods from './k8/pod.service';
import Deployments from './k8/deployment.service';
import Services from './k8/service.service';
import Nodes from './k8/node.service';
import Namespaces from './k8/namespace.service';
import { JSONObjectType } from '../models/json.model';
import api, { getWSUrl } from './axios.service';
import ServiceAccounts from './k8/serviceaccount.service';
import Roles from './k8/role.service';
import ClusterRoles from './k8/clusterrole.service';
import RoleBindings from './k8/rolebinding.service';
import ClusterRoleBindings from './k8/clusterrolebinding.service';
import Secrets from './k8/secret.service';
import Cluster from './k8/cluster.service';
import ReplicaSets from './k8/replicaset.service';
import getWebsocket from './websocket';

export default class K8 {
    static deployments = Deployments;

    static pods = Pods;

    static images = Images;

    static containers = Containers;

    static services = Services;

    static nodes = Nodes;

    static namespaces = Namespaces;

    static serviceAccounts = ServiceAccounts;

    static roles = Roles;

    static clusterRoles = ClusterRoles;

    static roleBindings = RoleBindings;

    static clusterRoleBindings = ClusterRoleBindings;

    static secrets = Secrets;

    static replicaSets = ReplicaSets;

    static cluster = Cluster;

    static getFilterProperties(): Promise<AxiosResponse<JSONObjectType<string>>> {
        return api.get('/api/v1/filters/properties');
    }

    static poll(
        ms: number,
        fcn: (...fcnArgs: any[]) => Promise<AxiosResponse<any>>,
        callback: (arg: any) => void,
        ...args: any[]
    ) {
        return setInterval(() => {
            fcn(...args).then((r) => {
                callback(r);
            });
        }, ms);
    }

    static pollFunction(ms: number, fcn: () => void) {
        return setInterval(() => {
            fcn();
        }, ms);
    }

    static openEventWebsocket(
        name: string,
        namespace: string,
        kind: string,
        pollInterval: number,
        callback: (event: MessageEvent<string>) => void
    ): WebSocket {
        const token = localStorage.getItem('jwe');
        const ws = getWebsocket(
            getWSUrl(
                `/ws/v1/${kind}/${namespace}/${name}/events?pollInterval=${pollInterval}&jwe=${token}`
            )
        );
        ws.onmessage = callback;
        return ws;
    }
}
