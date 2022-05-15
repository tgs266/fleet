/* eslint-disable import/prefer-default-export */

const MIN_MAG = 1000;

const MAGNITUDES = [
    { suffix: 'B', magnitude: MIN_MAG * 1 },
    { suffix: 'KB', magnitude: MIN_MAG ** 1 },
    { suffix: 'MB', magnitude: MIN_MAG ** 2 },
    { suffix: 'GB', magnitude: MIN_MAG ** 3 },
    { suffix: 'TB', magnitude: MIN_MAG ** 4 },
    { suffix: 'PB', magnitude: MIN_MAG ** 5 },
];

export const getUnit = (bytes: number) => {
    if (!bytes) {
        return MAGNITUDES[3];
    }
    const idx = Math.floor(Math.log(bytes) / Math.log(MIN_MAG));
    if (idx > MAGNITUDES.length) {
        return MAGNITUDES[5];
    }

    return MAGNITUDES[idx];
};

export const unit = (bytes: number, precision: number = 2) => {
    const idx = Math.floor(Math.log(bytes) / Math.log(MIN_MAG));
    if (idx > MAGNITUDES.length) {
        return '';
    }

    const { suffix, magnitude } = MAGNITUDES[idx];
    return `${(bytes / magnitude).toPrecision(precision)} ${suffix}`;
};

export const handleUnit = (bytes: number, mag: number) => bytes / mag;

export const scale = (bytes: number, scaleTo: number, roundTo: number) => {
    let val = bytes / scaleTo;
    if (roundTo) {
        const v = 1 / roundTo;
        val = Math.round(val * v) / v;
    }
    return val;
};

export const megabytes = (bytes: number) => scale(bytes, 10 ** 6, null);

export const gigabytes = (bytes: number) => scale(bytes, 10 ** 9, null);
