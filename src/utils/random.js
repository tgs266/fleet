module.exports = {
    randUniform: () => {
        const cryp = window.crypto || window.msCrypto;
        return cryp.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
    },
    randId: (size) => {
        const cryp = window.crypto || window.msCrypto;
        const val = cryp.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
        return Math.floor(val * 10 ** size);
    },
};
