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
    const sort: TableSort = {
        sortableId: 'adsf',
        ascending: true,
    };
    Deployments.getDeployments('_all_', sort);
});

test('getDeployment2', () => {
    const sort: TableSort = {
        sortableId: 'adsf',
        ascending: false,
    };
    Deployments.getDeployments('_all_', sort);
});

test('getDeployment3', () => {
    const sort: TableSort = {
        sortableId: 'adsf',
        ascending: false,
    };
    Deployments.getDeployments(null, sort);
});
