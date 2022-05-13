export default function skipTicksCallback(every: number) {
    return function (tickValue: string | number, index: number) {
        return index % every ? '' : tickValue;
    };
}

export const COLORS = [
    '#147EB3',
    '#29A634',
    '#D1980B',
    '#D33D17',
    '#9D3F9D',
    '#00A396',
    '#DB2C6F',
    '#8EB125',
    '#946638',
    '#7961DB',
];
