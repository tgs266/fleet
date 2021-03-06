/* eslint-disable object-shorthand */
import { AxiosResponse } from 'axios';
import { Image } from '../../models/image.model';
import api, { getBackendApiUrl } from '../axios.service';

export default class Images {
    static base = `/api/v1/images`;

    static getImages(): Promise<AxiosResponse<Image[]>> {
        return api.get(`${getBackendApiUrl(Images.base)}/`);
    }
}
