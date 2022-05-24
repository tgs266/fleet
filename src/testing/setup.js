/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
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
global.ResizeObserver = require('resize-observer-polyfill');

jest.mock('use-resize-observer', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    })),
}));

// jest.mock("monaco-editor/esm/vs/editor/editor.api.js");

class ResizeObserver {
    observe() {
        // do nothing
    }

    unobserve() {
        // do nothing
    }

    disconnect() {
        // do nothing
    }
}

window.ResizeObserver = ResizeObserver;

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const server = setupServer(
    msw.rest.get(`${Auth.base}/cani`, (req, res, ctx) => res(ctx.json({ allowed: true })))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

export default server;
