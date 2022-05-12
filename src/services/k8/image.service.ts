/* eslint-disable object-shorthand */
import { AxiosResponse } from 'axios';
import { Image } from '../../models/image.model';
import api from '../axios.service';
import Electron from '../electron.service';

export default class Images {
    static base = `${Electron.isElectron ? 'http://localhost:9095' : ''}/api/v1/images`;

    static getImages(): Promise<AxiosResponse<Image[]>> {
        return api.get(`${Images.base}/`);
    }
}
