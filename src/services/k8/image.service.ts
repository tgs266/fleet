/* eslint-disable object-shorthand */
import { AxiosResponse } from 'axios';
import { Image } from '../../models/image.model';
import api from '../axios.service';

export default class Images {
    static base = 'http://localhost:51115/api/v1/images';

    static getImages(): Promise<AxiosResponse<Image[]>> {
        return api.get(`${Images.base}/`);
    }
}
