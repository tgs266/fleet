/* eslint-disable import/prefer-default-export */

export const millisecondsToHumanReadable = (ms: number): string => {
    const base = Math.floor(ms / 1000);
    const seconds = base;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    switch (true) {
        case seconds < 60:
            return `${Math.round(seconds)} second${Math.round(seconds) > 1 ? 's' : ''}`;
        case minutes < 60:
            return `${Math.round(minutes)} minute${Math.round(minutes) > 1 ? 's' : ''}`;
        case hours < 24:
            return `${Math.round(hours)} hour${Math.round(hours) > 1 ? 's' : ''}`;
        default: {
            // days
            const leftOverTime = base - Math.floor(days) * (60 * 60 * 24);
            return `${Math.floor(days)} day${
                Math.floor(days) > 1 ? 's' : ''
            } ${millisecondsToHumanReadable(leftOverTime * 1000)}`;
        }
    }
};

export const millisecondsToOrigination = (ms: number): Date => new Date(Date.now() - ms);

export const createdAtToHumanReadable = (ms: number): string =>
    millisecondsToHumanReadable(new Date().getTime() - ms);

export const createdAtToOrigination = (ms: number): string =>
    millisecondsToOrigination(new Date().getTime() - ms).toLocaleString();
