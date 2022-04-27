import { NamespacedMeta, Rule, Subject } from './base';

export interface RoleBindingMeta extends NamespacedMeta {
    roleName: string;
}

export interface RoleBinding extends RoleBindingMeta {
    subjects: Subject[];
}

export interface RoleMeta extends NamespacedMeta {}

export interface Role extends RoleMeta {
    rules: Rule[];
}
