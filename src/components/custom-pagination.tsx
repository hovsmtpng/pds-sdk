import * as React from "react"
import { Button } from "@/components/ui/button"
import { type Table } from "@tanstack/react-table"

interface CustomPaginationProps<TData> {
    table: Table<TData>
    siblings?: number
}

/**
 * Komponen pagination custom untuk TanStack React Table
 */
export default function CustomPagination<TData>({
    table,
    siblings = 1,
}: CustomPaginationProps<TData>) {
    const pageCount = table.getPageCount()
    const pageIndex = table.getState().pagination.pageIndex

    // Hitung range halaman dengan ellipsis
    const pages = React.useMemo<(number | string)[]>(() => {
        const range: (number | string)[] = []

        for (let i = 0; i < pageCount; i++) {
            if (
                i === 0 ||
                i === pageCount - 1 ||
                (i >= pageIndex - siblings && i <= pageIndex + siblings)
            ) {
                range.push(i)
            } else if (range[range.length - 1] !== "...") {
                range.push("...")
            }
        }
        return range
    }, [pageCount, pageIndex, siblings])

    return (
        <div className="flex flex-wrap items-center gap-1">
            {/* Prev */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Previous
            </Button>

            {/* Numeric pages */}
            {pages.map((p, idx) =>
                p === "..." ? (
                    <span key={idx} className="px-2 text-sm">
                        ...
                    </span>
                ) : (
                    <Button
                        key={idx}
                        variant={p === pageIndex ? "primary" : "outline"}
                        size="sm"
                        onClick={() => {
                            if (typeof p === "number") table.setPageIndex(p)
                        }}
                    >
                        {typeof p === "number" ? p + 1 : p}
                    </Button>
                )
            )}


            {/* Next */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Next
            </Button>
        </div>
    )
}
