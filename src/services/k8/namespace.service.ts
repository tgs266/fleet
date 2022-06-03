/* eslint-disable object-shorthand */
import { NamespaceMeta as NS } from '../../models/namespace.model';
import Resource from './resource.service';

export default class Namespaces extends Resource<NS, NS> {
    static base = `/api/v1/namespaces`;

    base = Namespaces.base;
}
