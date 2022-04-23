export default function getOffset(page: number, pageSize: number, total: number) {
    const calculatedOffset = page * pageSize;
    if (calculatedOffset > total) {
        const diff = calculatedOffset - total;
        return this.state.total - diff;
    }
    return calculatedOffset;
}
