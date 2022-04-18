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

export default class K8 {
    static deployments = Deployments;

    static pods = Pods;

    static images = Images;

    static containers = Containers;

    static services = Services;

    static nodes = Nodes;

    static namespaces = Namespaces;

    static getFilterProperties(): Promise<AxiosResponse<JSONObjectType<string>>> {
        return api.get('http://localhost:8000/api/v1/filters/properties');
    }

    static poll(
        ms: number,
        fcn: (...args: any[]) => Promise<AxiosResponse<any>>,
        callback: (arg: any) => void,
        ...args: any[]
    ) {
        return setInterval(() => {
            fcn(...args).then((r) => {
                callback(r);
            });
        }, ms);
    }
}
