import { Secret, SecretMeta } from '../../models/secret.model';
import Resource from './resource.service';

export default class Secrets extends Resource<SecretMeta, Secret> {
    static base = `/api/v1/secrets`;

    base = Secrets.base;
}
