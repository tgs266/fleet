import { NamespacedMeta } from './base';
import { ClusterRoleBindingMeta } from './clusterrole.model';
import { RoleBindingMeta } from './role.model';

export interface ServiceAccountMeta extends NamespacedMeta {}

export interface ServiceAccount extends ServiceAccountMeta {
    roleBindings: RoleBindingMeta[];
    clusterRoleBindings: ClusterRoleBindingMeta[];
}

export interface BindRequest {
    targetRoleName: string;
    targetRoleNamespace: string;
}
