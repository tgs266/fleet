import { RoleBinding, RoleBindingMeta } from '../../models/role.model';
import Resource from './resource.service';

export default class RoleBindings extends Resource<RoleBindingMeta, RoleBinding> {
    static base = `/api/v1/rolebindings`;

    base = RoleBindings.base;
}
