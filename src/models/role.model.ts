import { NamespacedMeta } from './base';

interface Rule {
    verbs: string[];
    apiGroups: string[];
    resources: string[];
    resourceNames: string[];
    nonResourceURLs: string[];
}

export interface RoleMeta extends NamespacedMeta {}

export interface Role extends RoleMeta {
    rules: Rule[];
}
