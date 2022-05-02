import { TextEncoder, TextDecoder } from 'util';

const nodeCrypto = require('crypto');
const msw = require('msw');
const { setupServer } = require('msw/node');
const { default: Auth } = require('../services/auth.service');

process.env.TEST_ENV = true;

window.crypto = {
    getRandomValues(buffer) {
        return nodeCrypto.randomFillSync(buffer);
    },
};

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const server = setupServer(
    msw.rest.get(`${Auth.base}/cani`, (req, res, ctx) => res(ctx.json({ allowed: true })))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

export default server;
