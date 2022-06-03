import { Role, RoleMeta } from '../../models/role.model';
import Resource from './resource.service';

export default class Roles extends Resource<RoleMeta, Role> {
    static base = `/api/v1/roles`;

    base = Roles.base;
}
