export function formatCurrency(
    value: number | string,
    decimals: number = 2,
    withLabel: boolean = true
): string {
    if (value === null || value === undefined || value === "") return withLabel ? "Rp0" : "0"

    const number = typeof value === "string" ? parseFloat(value) : value

    if (isNaN(number)) return withLabel ? "Rp0" : "0"

    // Format angka dengan jumlah desimal dinamis
    return (withLabel ? "Rp": "") + number
        .toFixed(decimals)
        .replace(".", ",") // ubah titik jadi koma untuk desimal
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") // tambahkan titik pemisah ribuan
}
