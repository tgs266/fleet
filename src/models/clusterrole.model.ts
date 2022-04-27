import { BaseMeta, Rule } from './base';

export interface ClusterRoleMeta extends BaseMeta {}

export interface ClusterRole extends ClusterRoleMeta {
    rules: Rule[];
}
