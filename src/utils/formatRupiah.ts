export const formatRupiah = (
    value: number | string | null | undefined
): string => {
    if (value === null || value === undefined || value === '') {
        return '';
    }

    let numberValue: number;

    if (typeof value === 'number') {
        numberValue = value;
    } else {
        // support "1.234,56", "1234.56", "Rp 1.234,56"
        const normalized = value
            .toString()
            .replace(/\s/g, '')
            .replace(/Rp/gi, '')
            .replace(/\./g, '')
            .replace(/,/g, '.')
            .replace(/[^0-9.-]/g, '');

        numberValue = Number(normalized);
    }

    if (Number.isNaN(numberValue)) {
        return '';
    }

    const hasDecimal = Math.round(numberValue * 100) % 100 !== 0;

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: hasDecimal ? 2 : 0,
        maximumFractionDigits: 2,
    }).format(numberValue);
};

export const transformThousands = (
    value: string | number | null | undefined,
    mode: "format" | "parse" = "format"
): string | number => {
    if (value === null || value === undefined) {
        return mode === "format" ? "" : 0;
    }

    const str = value.toString();

    if (mode === "parse") {
        const normalized = str
            .replace(/\./g, "")
            .replace(/,/g, ".")
            .replace(/[^0-9.]/g, "");

        const num = Number(normalized);
        return isNaN(num) ? 0 : num;
    }

    // ===== FORMAT MODE =====

    const endsWithComma = str.endsWith(",");

    const cleaned = str.replace(/[^0-9,]/g, "");
    const [intRaw = "", decRaw = ""] = cleaned.split(",");

    const intPart = intRaw.replace(/\D/g, "");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    let decimalPart = decRaw.replace(/\D/g, "").slice(0, 2);

    // Case: user baru mengetik koma → simpan koma
    if (endsWithComma && decimalPart.length === 0) {
        return `${formattedInt},`;
    }

    if (decimalPart.length > 0) {
        return `${formattedInt},${decimalPart}`;
    }

    return formattedInt;
};
