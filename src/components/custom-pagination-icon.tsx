import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Table } from "@tanstack/react-table"

interface CustomPaginationIconProps<TData> {
  table: Table<TData>
  siblings?: number
}

/**
 * Komponen Pagination dengan ikon navigasi (First, Prev, Next, Last)
 * Mendukung pengaturan jumlah baris per halaman.
 */
export default function CustomPaginationIcon<TData>({
  table,
  siblings = 1,
}: CustomPaginationIconProps<TData>) {
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
    <div className="flex flex-wrap items-center gap-2">
      {/* Rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Rows per page</span>
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="w-[60px]" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 5, 10, 20, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={String(pageSize)}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Page indicator */}
      <span className="text-sm">
        Page {pageIndex + 1} of {pageCount}
      </span>

      {/* First */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Prev */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Next */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.setPageIndex(pageCount - 1)}
        disabled={!table.getCanNextPage()}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
