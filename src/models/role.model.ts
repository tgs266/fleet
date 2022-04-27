import { NamespacedMeta, Rule } from './base';

export interface RoleMeta extends NamespacedMeta {}

export interface Role extends RoleMeta {
    rules: Rule[];
}
