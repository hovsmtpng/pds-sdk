"use client"

import * as React from "react"
import "./___data-table.css"
import dayjs from "dayjs"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnDef,
  Table as ReactTableType,
  FilterFn,
  SortingState,
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input, InputWrapper } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  ChevronsUpDown,
  Search,
  Filter,
  CalendarSearch,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import CustomPaginationIcon from "./custom-pagination-icon"

// ✅ Custom filterFn untuk date
const fnFilterSingleDate: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue) return true
  const format = "YYYY-MM-DD"
  const rowDate = dayjs(row.getValue(columnId)).format(format)
  const filterDate = dayjs(filterValue).format(format)
  return rowDate === filterDate
}

// ✅ FilterFn untuk number/string
const numberFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue) return true
  const rawValue = row.getValue(columnId)
  return String(rawValue).toLowerCase().includes(String(filterValue).toLowerCase())
}

// ✅ Filter column component
interface ColumnFilterProps {
  column: any
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({ column }) => {
  const [open, setOpen] = React.useState(false)
  const columnFilterValue = column.getFilterValue()

  // 🔍 Text Search
  if (column.columnDef.meta?.filter === "search") {
    const [tempValue, setTempValue] = React.useState<string>(columnFilterValue ?? "")
    const isActive = !!columnFilterValue

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <Search
              className={`h-3 w-3 ${isActive ? "text-primary" : "text-muted-foreground"}`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="flex flex-col gap-2">
            <Input
              placeholder={`Search ${column.columnDef.header}...`}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setTempValue("")
                  column.setFilterValue(undefined)
                  setOpen(false)
                }}
              >
                Reset
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  column.setFilterValue(tempValue || undefined)
                  setOpen(false)
                }}
              >
                Search
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  // 📅 Date Filter
  if (column.columnDef.meta?.filter === "date") {
    const isActive = !!columnFilterValue
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <CalendarSearch
              className={`h-3 w-3 ${isActive ? "text-primary" : "text-muted-foreground"}`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <Calendar
            mode="single"
            selected={columnFilterValue}
            onSelect={(date) => {
              column.setFilterValue(
                date ? dayjs(date).format(column.columnDef.format || "YYYY-MM-DD") : undefined
              )
              setOpen(false)
            }}
          />
          {columnFilterValue && (
            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  column.setFilterValue(undefined)
                  setOpen(false)
                }}
              >
                Reset
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    )
  }

  // 🔽 Select Filter
  if (column.columnDef.meta?.filter === "select") {
    const options = column.columnDef.meta?.options ?? []
    const isActive = !!columnFilterValue
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <Filter
              className={`h-3 w-3 ${isActive ? "text-primary" : "text-muted-foreground"}`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2">
          <div className="flex flex-col gap-1">
            {options.map((opt: any) => (
              <Button
                key={opt.value}
                variant={columnFilterValue === opt.value ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  column.setFilterValue(
                    columnFilterValue === opt.value ? undefined : opt.value
                  )
                  setOpen(false)
                }}
              >
                {opt.label}
              </Button>
            ))}
            {columnFilterValue && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  column.setFilterValue(undefined)
                  setOpen(false)
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return null
}

// ✅ Fixed Column helper
const setFixedColumn = (column: any, fixed: string, allColumns: any[]) => {
  const leftPinned = allColumns.filter((col) => col.columnDef.fixed === "left")
  const rightPinned = allColumns.filter((col) => col.columnDef.fixed === "right")

  const leftOffset = leftPinned
    .slice(0, leftPinned.findIndex((c) => c.id === column.id))
    .reduce((acc, c) => acc + c.getSize(), 0)

  const rightOffset = rightPinned
    .slice(rightPinned.findIndex((c) => c.id === column.id) + 1)
    .reduce((acc, c) => acc + c.getSize(), 0)

  return {
    position: fixed ? "sticky" : "relative",
    zIndex: fixed ? 2 : 0,
    width: column.getSize(),
    left: fixed === "left" ? `${leftOffset}px` : undefined,
    right: fixed === "right" ? `${rightOffset}px` : undefined,
    background: fixed ? "white" : undefined,
  } as React.CSSProperties
}

// ✅ Props utama DataTable
interface DataTableProps<T> {
  columns: ColumnDef<T, any>[]
  data: T[]
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
}

export function DataTable<T extends object>({
  columns,
  data,
  pagination,
  setPagination,
}: DataTableProps<T>) {
  const enhancedColumns = columns.map((col) =>
    col.meta?.filter ? { ...col, enableSorting: false } : { ...col }
  )

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    pageCount: Math.ceil(data.length / pagination.pageSize),
    state: { sorting, columnFilters, pagination },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableRowSelection: true,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange",
    filterFns: { date: fnFilterSingleDate, number: numberFilterFn },
  })

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <InputWrapper>
          <Search />
          <Input type="search" placeholder="Search" onChange={() => {}} />
        </InputWrapper>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table
          className="w-full border-collapse md:table"
          style={{ minWidth: table.getTotalSize() }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { column } = header
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="bg-muted px-2 py-1 text-center text-sm font-medium"
                      style={{
                        ...setFixedColumn(
                          column,
                          column.columnDef.fixed,
                          table.getAllLeafColumns()
                        ),
                      }}
                    >
                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </div>

                        {header.column.getCanFilter() && (
                          <div className="ml-auto flex items-center">
                            {header.column.getCanSort() && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {header.column.getIsSorted() === "asc" ? (
                                  <ArrowUp className="h-3 w-3 text-primary" />
                                ) : header.column.getIsSorted() === "desc" ? (
                                  <ArrowDown className="h-3 w-3 text-primary" />
                                ) : (
                                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                                )}
                              </Button>
                            )}
                            <ColumnFilter column={header.column} />
                          </div>
                        )}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const { column } = cell
                  return (
                    <TableCell
                      key={cell.id}
                      className="py-1.5 text-sm whitespace-nowrap"
                      style={{
                        ...setFixedColumn(
                          column,
                          column.columnDef.fixed,
                          table.getAllLeafColumns()
                        ),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s)
        </div>
        <CustomPaginationIcon table={table as unknown as ReactTableType<T>} />
      </div>
    </>
  )
}
