const path = require('path');
const fs = require('fs');
const glob = require('glob');

exports.default = (context) => {
    const APP_DIR = context.outDir;
    const unpackedFolders = glob.sync('*-unpacked', { cwd: APP_DIR });

    unpackedFolders.forEach((dir) => {
        fs.rmSync(path.join(APP_DIR, dir), { recursive: true, force: true });
    });

    const yamlFiles = glob.sync('*.yaml', { cwd: APP_DIR });
    yamlFiles.forEach((file) => {
        fs.unlinkSync(path.join(APP_DIR, file));
    });

    const ymlFiles = glob.sync('*.yml', { cwd: APP_DIR });
    ymlFiles.forEach((file) => {
        if (file !== 'latest.yml') {
            fs.unlinkSync(path.join(APP_DIR, file));
        }
    });
};
