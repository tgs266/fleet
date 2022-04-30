import { NamespacedMeta } from './base';
import { JSONObjectType } from './json.model';

export interface SecretMeta extends NamespacedMeta {
    immutable: boolean;
}

export interface Secret extends SecretMeta {
    data: JSONObjectType<string>;
}
