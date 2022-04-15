/* eslint-disable import/prefer-default-export */

export const scale = (bytes: number, scaleTo: number, roundTo?: number) => {
    let val = bytes * scaleTo;
    if (roundTo) {
        const v = 1 / roundTo;
        val = Math.round(val * v) / v;
    }
    return val;
};

export const megabytes = (bytes: number) => scale(bytes, 10 ** 6, null);

export const gigabytes = (bytes: number) => scale(bytes, 10 ** 9, null);
