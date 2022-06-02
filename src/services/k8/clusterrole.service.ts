import { ClusterRole, ClusterRoleMeta } from '../../models/clusterrole.model';
import Resource from './resource.service';

export default class ClusterRoles extends Resource<ClusterRoleMeta, ClusterRole> {
    static base = `/api/v1/clusterroles`;

    base = ClusterRoles.base;
}
