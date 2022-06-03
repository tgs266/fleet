import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { generateDeployment } from '../../testing/type_mocks';
import Deployments from './deployment.service';

const server = setupServer(
    rest.get(`${Deployments.base}/*`, (req, res, ctx) => res(ctx.json(generateDeployment('test'))))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('getDeployment', () => {
    const d = new Deployments(true, true);
    const sort: TableSort = {
        sortableId: 'adsf',
        ascending: true,
    };
    d.list({ namespace: '_all_', sort });
});

test('getDeployment2', () => {
    const d = new Deployments(true, true);
    const sort: TableSort = {
        sortableId: 'adsf',
        ascending: false,
    };
    d.list({ namespace: '_all_', sort });
});

test('getDeployment3', () => {
    const d = new Deployments(true, true);
    const sort: TableSort = {
        sortableId: 'adsf',
        ascending: false,
    };
    d.list({ sort });
});
