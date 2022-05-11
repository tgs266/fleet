export default function precisionRound(number: number, precision: number) {
    const factor = 10 ** precision;
    return Math.round(number * factor) / factor;
}
