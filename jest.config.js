module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
        '\\.less$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.(j|t)sx?': 'ts-jest',
        '^.+\\.(j|t)s?': 'ts-jest',
    },
    setupFiles: ['jest-canvas-mock'],
    setupFilesAfterEnv: ['<rootDir>/src/testing/setup.js'],
    testEnvironment: 'jsdom',
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
};
