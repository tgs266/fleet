import { AxiosResponse } from 'axios';
import { ReplicaSet, ReplicaSetMeta } from '../../models/replicaset.model';
import api from '../axios.service';
import Resource, { ResourceGetParams } from './resource.service';

export default class ReplicaSets extends Resource<ReplicaSetMeta, ReplicaSet> {
    static base = `/api/v1/replicasets`;

    base = ReplicaSets.base;

    restartReplicaSet(params: ResourceGetParams): Promise<AxiosResponse<any>> {
        return api.put(`${this.getNamespaceNameUrl(params)}/restart`);
    }
}
