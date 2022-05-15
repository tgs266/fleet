/* eslint-disable import/prefer-default-export */

export const getUnit = (cores: number) => {
    if (!cores) {
        return { suffix: 'Millicores', magnitude: 1000 };
    }
    if (cores < 1) {
        return { suffix: 'Millicores', magnitude: 1000 };
    }
    return { suffix: 'Cores', magnitude: 1 };
};

export const unit = (cores: number, precision: number = 2) => {
    const { suffix, magnitude } = getUnit(cores);
    return `${(cores * magnitude).toPrecision(precision)} ${suffix}`;
};

export const handleUnit = (cores: number, mag: number) => cores * mag;
