module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
        '\\.scss$': 'identity-obj-proxy',
        '\\.less$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.(j|t)sx?': 'ts-jest',
        '^.+\\.(j|t)s?': 'ts-jest',
        '^.+\\.(j|t)s?': 'ts-jest',
        '\\.(css|less|sass|scss)$': '<rootDir>/src/testing/styleMock.js',
    },
    moduleNameMapper: {
        'monaco-editor': '<rootDir>/src/testing/monacoMock.jsx',
        'xterm-for-react': '<rootDir>/src/testing/xtermMock.jsx',
    },
    transformIgnorePatterns: ['node_modules/(?!.*xterm.*)', 'node_modules/(?!(monaco-editor)/)'],
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
