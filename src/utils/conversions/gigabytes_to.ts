/* eslint-disable import/prefer-default-export */
export const bytes = (mb: number, int?: boolean) => {
    let val = mb * 10 ** 9;
    if (int) {
        val = Math.floor(val);
    }
    return val;
};
