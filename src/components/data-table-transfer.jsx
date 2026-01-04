import { useEffect, useMemo, useState } from 'react';

import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';

import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { Search, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NewDataTable } from './data-table';

const fnFilterSingleDate = (row, columnId, filterValue) => {
    if (!filterValue) return true

    const format = "YYYY-MM-DD"
    const rowDate = dayjs(row.getValue(columnId)).format(format)
    const filterDate = dayjs(filterValue).format(format)

    return rowDate === filterDate
}

// helper filter untuk numeric
const numberFilterFn = (row, columnId, filterValue) => {
    if (!filterValue) return true
    const rawValue = row.getValue(columnId)
    return String(rawValue).toLowerCase().includes(String(filterValue).toLowerCase())
}

export function DataTableTransfer({
    type,
    addAll,
    removeAll,
    leftTable,
    rightTable,

    config = {
        pinning: {
            left: [],
            right: [],
        },
        headerSticky: false,
        columnsPinnable: false,
        columnsResizable: false,
        columnsMovable: false,
        columnsVisibility: false,

        showColumnsPinnable: true,

        showPaginationSection: true,
        showTotalRows: true,
        showRowPerPage: true,
        showPageOf: true,
        showPagination: true,
    },
    additionalFilters,
}) {

    const filteredRightData = useMemo(() => {
        return rightTable.data.filter((item) => {
            // Filter by search query (case-insensitive)
            const searchLower = rightTable.searchQuery.toLowerCase();
            const matchesSearch =
                !rightTable.searchQuery ||
                Object.values(item)
                    .join(' ') // Combine all fields into a single string
                    .toLowerCase()
                    .includes(searchLower);
            return matchesSearch;
        });
    }, [rightTable.data, rightTable.searchQuery]);

    const tanRightTable = useReactTable({
        columns: rightTable.columns,
        data: filteredRightData,
        pageCount: Math.ceil((filteredRightData?.length || 0) / rightTable.pagination.pageSize),
        getRowId: (row) => row.id,
        state: {
            pagination: rightTable.pagination,
            columnFilters: rightTable.columnFilters,
            sorting: rightTable.sorting,
        },
        initialState: {
            columnPinning: config.pinning,
        },
        columnResizeMode: 'onChange',
        onPaginationChange: rightTable.setPagination,
        onSortingChange: rightTable.setSorting,
        onColumnFiltersChange: rightTable.setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),

        manualPagination: false, // <— tambahkan ini

        // ⬇️ daftarin filterFn custom
        filterFns: {
            date: fnFilterSingleDate,
            number: numberFilterFn,
        },
    });


    useEffect(() => {
        rightTable.setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [rightTable.data.length]);

    return (
        <div className='grid grid-cols-2 gap-2'>
            <div>
                <div className="flex items-center justify-between">
                    <h5 className="text-xs">Available {type} ({ leftTable.isServerSide ? leftTable?.configDataTable?.pagination?.total.toLocaleString("id-ID") : leftTable?.data?.length.toLocaleString("id-ID") || 0})</h5>
                    <Button variant="dim" className="text-left text-primary" onClick={addAll}>{leftTable?.labelAll || "Select All"}</Button>
                </div>

                <NewDataTable
                    isTransfer={true}
                    loading={leftTable.loading}
                    data={leftTable.data}
                    columns={leftTable.columns}

                    isServerSide={leftTable.isServerSide}
                    serverSideFilterValues={leftTable.serverSideFilterValues}
                    onChangeFilterColumns={leftTable.onChangeFilterColumns}

                    onChangeDataTable={leftTable.onChangeDataTable}

                    pagination={leftTable.configDataTable.pagination}
                    sorting={leftTable.configDataTable.sorting}
                    searchQuery={leftTable.configDataTable.searchQuery}
                    columnFilters={leftTable.configDataTable.columnFilters}

                    columnVisibility={leftTable.columnVisibility}

                    isShowSearch={false}
                    config={
                        {
                            pinning: {
                                left: [],
                                right: [],
                            },
                            headerSticky: true,
                            columnsPinnable: true,
                            columnsResizable: true,
                            columnsMovable: false,
                            columnsVisibility: false,

                            showColumnsPinnable: false,

                            showPaginationSection: true,
                            showTotalRows: false,
                            showRowPerPage: false,
                            showPageOf: true,
                            showPagination: true,
                        }
                    }
                />
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <h5 className='text-xs'>Selected {type} ({rightTable?.data?.length.toLocaleString("id-ID") || 0})</h5>
                    <Button variant="dim" className="text-destructive" onClick={removeAll}>{rightTable?.labelAll || "Unselect All"}</Button>
                </div>
                <NewDataTable
                    isTransfer={true}
                    loading={rightTable.loading}
                    data={rightTable.data}
                    columns={rightTable.columns}

                    isServerSide={false}

                    pagination={rightTable.pagination}
                    sorting={rightTable.sorting}
                    searchQuery={rightTable.searchQuery}
                    columnFilters={rightTable.columnFilters}

                    columnVisibility={rightTable.columnVisibility}

                    isShowSearch={false}
                    config={
                        {
                            pinning: {
                                left: [],
                                right: [],
                            },
                            headerSticky: true,
                            columnsPinnable: true,
                            columnsResizable: true,
                            columnsMovable: false,
                            columnsVisibility: false,

                            showColumnsPinnable: false,

                            showPaginationSection: true,
                            showTotalRows: false,
                            showRowPerPage: false,
                            showPageOf: true,
                            showPagination: true,
                        }
                    }
                />
            </div>
        </div>
    );
}