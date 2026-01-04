import React, { useState } from "react"
import { Column } from "@tanstack/react-table"
import dayjs from "dayjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, CalendarSearch, FunnelPlus } from "lucide-react"
import { DateRange } from "react-day-picker"

type Option = { label: string; value: string }

interface ColumnFilterProps<TData> {
  column: Column<TData, unknown>;
  isServerSide?: boolean;
  onChangeFilterColumns?: (key: string, value: any) => void;
  serverSideFilterValues?: Record<string, any>;
}

export default function ColumnFilter<TData>({
  column,
  isServerSide = false,
  onChangeFilterColumns,
  serverSideFilterValues = {},
}: ColumnFilterProps<TData>) {
  const [open, setOpen] = useState(false)
  const filterType = column.columnDef.meta?.filter
  const columnId = column.id

  const getActiveState = (value: any): boolean => {
    if (isServerSide) {
      const serverValue = serverSideFilterValues[columnId]
      return Boolean(serverValue && (Array.isArray(serverValue) ? serverValue.length : Object.keys(serverValue).length))
    }
    return Boolean(value)
  }

  /** 🔍 SEARCH FILTER */
  if (filterType === "search") {
    const columnFilterValue = (column.getFilterValue() as string) ?? ""
    const [tempValue, setTempValue] = useState(columnFilterValue)
    const isActive = getActiveState(columnFilterValue)

    const applySearch = () => {
      if (isServerSide) onChangeFilterColumns?.(columnId, tempValue)
      else column.setFilterValue(tempValue || undefined)
      setOpen(false)
    }

    const resetSearch = () => {
      setTempValue("")
      if (isServerSide) onChangeFilterColumns?.(columnId, "")
      else column.setFilterValue(undefined)
      setOpen(false)
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button mode="icon" variant="ghost" size="sm">
            <Search className={`size-3.5! ${isActive ? "text-primary" : "opacity-50!"}`} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="flex flex-col gap-2">
            <Input
              placeholder={`Search ${column.columnDef.header}...`}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == 'Enter') {
                  applySearch()
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={resetSearch}>Reset</Button>
              <Button size="sm" onClick={applySearch}>Search</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  /** 📅 SINGLE DATE FILTER */
  if (filterType === "date") {
    const columnFilterValue = column.getFilterValue() as string | undefined
    const isActive = getActiveState(columnFilterValue)

    const handleSelectDate = (date: Date | undefined) => {
      const formatted = date ? dayjs(date).format(column.columnDef.meta?.format || "YYYY-MM-DD") : undefined
      if (isServerSide) onChangeFilterColumns?.(columnId, formatted || "")
      else column.setFilterValue(formatted)
      setOpen(false)
    }

    const resetDate = () => {
      if (isServerSide) onChangeFilterColumns?.(columnId, "")
      else column.setFilterValue(undefined)
      setOpen(false)
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button mode="icon" variant="ghost" size="sm">
            <CalendarSearch className={`size-3.5! ${isActive ? "text-primary" : "opacity-50!"}`} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <Calendar
            mode="single"
            selected={columnFilterValue ? new Date(columnFilterValue) : undefined}
            onSelect={handleSelectDate}
          />
          {columnFilterValue && (
            <div className="flex justify-end mt-2">
              <Button size="sm" variant="outline" onClick={resetDate}>Reset</Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    )
  }

  /** 📆 DATE RANGE FILTER */
  if (filterType === "daterange") {
    const columnFilterValue = column.getFilterValue() as DateRange | undefined
    const isActive = getActiveState(columnFilterValue)

    const handleSelectRange = (range: DateRange | undefined) => {
      if (isServerSide) {
        const formatted = range ? {
          from: range.from ? dayjs(range.from).format("YYYY-MM-DD") : "",
          to: range.to ? dayjs(range.to).format("YYYY-MM-DD") : "",
        } : ""
        onChangeFilterColumns?.(columnId, formatted)
      } else column.setFilterValue(range || undefined)
      setOpen(false)
    }

    const resetRange = () => {
      if (isServerSide) onChangeFilterColumns?.(columnId, "")
      else column.setFilterValue(undefined)
      setOpen(false)
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button mode="icon" variant="ghost" size="sm">
            <CalendarSearch className={`size-3.5! ${isActive ? "text-primary" : "opacity-50!"}`} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <Calendar mode="range" selected={columnFilterValue} onSelect={handleSelectRange} />
          {columnFilterValue && (
            <div className="flex justify-end mt-2">
              <Button size="sm" variant="outline" onClick={resetRange}>Reset</Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    )
  }

  /** 🔽 SINGLE SELECT FILTER */
  if (filterType === "select") {
    const columnFilterValue = column.getFilterValue() as string | undefined
    const options = (column.columnDef.meta?.options as Option[]) ?? []
    const isActive = getActiveState(columnFilterValue)

    const handleSelect = (value: string) => {
      if (isServerSide) onChangeFilterColumns?.(columnId, value)
      else column.setFilterValue(value || undefined)
      setOpen(false)
    }

    const resetSelect = () => {
      if (isServerSide) onChangeFilterColumns?.(columnId, "")
      else column.setFilterValue(undefined)
      setOpen(false)
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button mode="icon" variant="ghost" size="sm">
            <Filter className={`size-3.5! ${isActive ? "text-primary" : "opacity-50!"}`} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2">
          <div className="flex flex-col gap-1">
            {options.map((opt) => (
              <Button
                key={opt.value}
                variant={columnFilterValue === opt.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
            {columnFilterValue && (
              <Button size="sm" variant="outline" onClick={resetSelect}>Reset</Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  /** ✅ MULTI SELECT FILTER */
  if (filterType === "select-multiple") {
    const options = (column.columnDef.meta?.options as Option[]) ?? []
    const columnFilterValue = (column.getFilterValue() as string[]) ?? []
    const [selectedValues, setSelectedValues] = useState<string[]>(columnFilterValue)
    const isActive = getActiveState(selectedValues)

    const toggleOption = (value: string) => {
      setSelectedValues((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      )
    }

    const toggleSelectAll = () => {
      if (selectedValues.length === options.length) {
        setSelectedValues([]) // deselect all
      } else {
        setSelectedValues(options.map((o) => o.value)) // select all
      }
    }

    const applySelect = () => {
      if (isServerSide) onChangeFilterColumns?.(columnId, selectedValues)
      else column.setFilterValue(selectedValues.length ? selectedValues : undefined)
      setOpen(false)
    }

    const resetSelect = () => {
      setSelectedValues([])
      if (isServerSide) onChangeFilterColumns?.(columnId, [])
      else column.setFilterValue(undefined)
      setOpen(false)
    }

    const allSelected = selectedValues.length === options.length && options.length > 0
    const someSelected = selectedValues.length > 0 && !allSelected

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button mode="icon" variant="ghost" size="sm">
            <FunnelPlus className={`size-3.5! ${isActive ? "text-primary" : "opacity-50!"}`} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3">
          <div className="flex flex-col gap-2">
            {/* Select All checkbox */}
            <label className="flex items-center gap-2 border-b pb-2 mb-1">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm font-medium">Select All</span>
            </label>

            {/* Individual options */}
            <div className="flex flex-col gap-1 max-h-48 overflow-auto">
              {options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedValues.includes(opt.value)}
                    onCheckedChange={() => toggleOption(opt.value)}
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={resetSelect}>
                Reset
              </Button>
              <Button size="sm" onClick={applySelect}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }


  return null
}
