import * as XLSX from "xlsx-js-style"
import dayjs from "dayjs"

export interface SheetConfig {
    sheetName: string
    headers: string[]
    rows: (string | number | null | undefined)[][]
    colWidths?: { wch: number }[]
    alignments?: ("left" | "center" | "right")[]
    headerStyle?: XLSX.CellStyle
}

interface ExcelOptions {
    sheets: SheetConfig[]
    fileName?: string
}

/**
 * Export multi-sheet Excel dengan style dan alignment dinamis
 * Library: xlsx-js-style
 */
export const exportExcel = ({
    sheets,
    fileName = `Export_${dayjs().format("DD-MM-YYYY_HH-mm-ss")}.xlsx`,
}: ExcelOptions): void => {
    const wb = XLSX.utils.book_new()

    sheets.forEach(({ sheetName, headers, rows, colWidths = [], alignments = [], headerStyle }) => {
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])

        const baseHeaderStyle: XLSX.CellStyle = headerStyle || {
            fill: { patternType: "solid", fgColor: { rgb: "e2e2e2" } },
            font: { bold: true, color: { rgb: "000000" } },
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
        }

        // Style header
        headers.forEach((_, c) => {
            const ref = XLSX.utils.encode_cell({ r: 0, c })
            if (ws[ref]) ws[ref].s = baseHeaderStyle
        })

        // Alignment data
        for (let r = 1; r <= rows.length; r++) {
            for (let c = 0; c < headers.length; c++) {
                const ref = XLSX.utils.encode_cell({ r, c })
                if (!ws[ref]) continue
                const alignment = alignments[c] || "left"
                ws[ref].s = {
                    alignment: { horizontal: alignment, vertical: "center", wrapText: true },
                }
            }
        }

        // Column width
        if (colWidths.length) ws["!cols"] = colWidths

        // Tambahkan sheet ke workbook
        XLSX.utils.book_append_sheet(wb, ws, sheetName)
    })

    XLSX.writeFile(wb, fileName)
}
