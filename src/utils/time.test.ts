import { millisecondsToHumanReadable } from './time';

test('millisecondsToHumanReadable', () => {
    const t0 = 1 * 1000;
    const t0s = 2 * 1000;

    const t1 = 61 * 1000;
    const t1s = 120 * 1000;

    const t2 = 61 * 60 * 1000;
    const t2s = 61 * 120 * 1000;

    const t3 = 25 * 61 * 60 * 1000;
    const t3s = 49 * 61 * 60 * 1000;

    expect(millisecondsToHumanReadable(t0)).toBe('1 second');
    expect(millisecondsToHumanReadable(t0s)).toBe('2 seconds');

    expect(millisecondsToHumanReadable(t1)).toBe('1 minute');
    expect(millisecondsToHumanReadable(t1s)).toBe('2 minutes');

    expect(millisecondsToHumanReadable(t2)).toBe('1 hour');
    expect(millisecondsToHumanReadable(t2s)).toBe('2 hours');

    expect(millisecondsToHumanReadable(t3)).toBe('1 day 1 hour');
    expect(millisecondsToHumanReadable(t3s)).toBe('2 days 2 hours');
});
