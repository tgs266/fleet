import { AxiosResponse } from 'axios';
import Containers from './k8/container.service';
import Images from './k8/image.service';
import Pods from './k8/pod.service';
import Deployments from './k8/deployment.service';
import Services from './k8/service.service';
import Nodes from './k8/node.service';
import Namespaces from './k8/namespace.service';
import { JSONObjectType } from '../models/json.model';
import api from './axios.service';
import ServiceAccounts from './k8/serviceaccount.service';
import Roles from './k8/role.service';
import ClusterRoles from './k8/clusterrole.service';
import RoleBindings from './k8/rolebinding.service';
import ClusterRoleBindings from './k8/clusterrolebinding.service';

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
}
