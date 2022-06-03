import { Service, ServiceMeta } from '../../models/service.model';
import Resource from './resource.service';

export default class Services extends Resource<ServiceMeta, Service> {
    static base = `/api/v1/services`;

    base = Services.base;
}
