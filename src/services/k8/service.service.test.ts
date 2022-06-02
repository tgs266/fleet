import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { TableSort } from '../../components/SortableTableHeaderCell';
import Services from './service.service';

const server = setupServer(rest.get(`${Services.base}/*`, (req, res, ctx) => res(ctx.json(''))));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('getServices', () => {
    const s = new Services(true, true);
    const sort: TableSort = {
        sortableId: 'adsf',
        ascending: true,
    };
    s.list({ namespace: '_all_', sort });
});

test('getServices2', () => {
    const s = new Services(true, true);
    const sort: TableSort = {
        sortableId: 'adsf',
        ascending: false,
    };
    s.list({ namespace: '_all_', sort });
});

test('getServices3', () => {
    const s = new Services(true, true);
    const sort: TableSort = {
        sortableId: 'adsf',
        ascending: false,
    };
    s.list({ namespace: '_all_', sort });
});
