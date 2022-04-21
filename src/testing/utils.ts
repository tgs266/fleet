/* eslint-disable import/prefer-default-export */

export function delay(time: number) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, time));
}
