/* eslint-disable import/prefer-default-export */
import { rest } from 'msw';
import Namespaces from '../services/k8/namespace.service';
import { NamespaceMeta } from '../models/namespace.model';

export function delay(time: number) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function getNs() {
    return rest.get(`${Namespaces.base}/*`, (req, res, ctx) => {
        const count = 5;
        const items: NamespaceMeta[] = [];
        for (let i = 0; i < count; i += 1) {
            items.push({
                name: `asdf-${i}`,
                uid: `adsf-${i}`,
                createdAt: 1423562354,
                status: 's',
                annotations: {},
                labels: {},
            });
        }
        return res(
            ctx.json({
                items,
                total: items.length,
            })
        );
    });
}
