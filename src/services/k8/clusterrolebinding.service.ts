import { ClusterRoleBinding, ClusterRoleBindingMeta } from '../../models/clusterrole.model';
import Resource from './resource.service';

export default class ClusterRoleBindings extends Resource<
    ClusterRoleBindingMeta,
    ClusterRoleBinding
> {
    static base = `/api/v1/clusterrolebindings`;

    base = ClusterRoleBindings.base;
}
