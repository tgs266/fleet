import { NamespacedMeta, Rule } from './base';

export interface RoleBindingMeta extends NamespacedMeta {
    roleName: string;
}

export interface RoleMeta extends NamespacedMeta {}

export interface Role extends RoleMeta {
    rules: Rule[];
}
