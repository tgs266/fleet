import { BaseMeta, Rule, Subject } from './base';

export interface ClusterRoleBindingMeta extends BaseMeta {
    roleName: string;
}

export interface ClusterRoleBinding extends ClusterRoleBindingMeta {
    subjects: Subject[];
}

export interface ClusterRoleMeta extends BaseMeta {}

export interface ClusterRole extends ClusterRoleMeta {
    rules: Rule[];
}
