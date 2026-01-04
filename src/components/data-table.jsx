import { useMemo, useState } from "react";

import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

const fnFilterSingleDate = (row, columnId, filterValue) => {
    if (!filterValue) return true;

    const format = "YYYY-MM-DD";
    const rowDate = dayjs(row.getValue(columnId)).format(format);
    const filterDate = dayjs(filterValue).format(format);

    return rowDate === filterDate;
};

const numberFilterFn = (row, columnId, filterValue) => {
    if (!filterValue) return true;
    const rawValue = row.getValue(columnId);
    return String(rawValue)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());
};

function NewDataTable({
    id = 'id',
    isTransfer = false,
    loading = false,
    data = [],
    columns = [],
    isServerSide, //mandatory jika mode server-side, optional jika mode client-side
    serverSideFilterValues, //mandatory jika mode server-side, optional jika mode client-side
    onChangeFilterColumns, //mandatory jika mode server-side, optional jika mode client-side
    onChangeDataTable, //mandatory jika mode server-side, optional jika mode client-side
    pagination: serverPagination,
    sorting: serverSorting,
    searchQuery: serverSearchQuery,
    columnFilters: serverColumnFilters,
    columnVisibility,

    rowSelection = {},
    setRowSelection,


    // isShowSearch
    isShowSearch = true,
    config = {
        pinning: { left: [], right: [] },
        width: 'fixed',
        headerSticky: false,
        columnsPinnable: false,
        columnsResizable: false,
        columnsMovable: false,
        columnsVisibility: true,

        showColumnsPinnable: true,
        showPaginationSection: true,
        showTotalRows: true,
        showRowPerPage: true,
        showPageOf: true,
        showPagination: true,
    },
    additionalFilters,
    additionalFilterPosition = "end", // start | end
    scrollHeightClassName = "",
}) {
    // ✅ fallback state untuk client-side mode
    const [localPagination, setLocalPagination] = useState(serverPagination);
    const [localSorting, setLocalSorting] = useState([]);
    const [localFilters, setLocalFilters] = useState([]);
    const [localSearch, setLocalSearch] = useState("");

    // ✅ pilih state berdasarkan mode
    const pagination = isServerSide ? serverPagination : localPagination;
    const sorting = isServerSide ? serverSorting : localSorting;
    const columnFilters = isServerSide ? serverColumnFilters : localFilters;
    const searchQuery = isServerSide ? serverSearchQuery : localSearch;

    const [searchInput, setSearchInput] = useState(searchQuery || "");


    // ✅ search filter lokal
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                !searchQuery ||
                Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchLower);
            return matchesSearch;
        });
    }, [searchQuery, data]);

    const table = useReactTable({
        columns: columns || [],
        data: filteredData || [],
        manualPagination: isServerSide,
        manualSorting: isServerSide,
        manualFiltering: isServerSide,
        pageCount:
            isServerSide && pagination?.pageCount
                ? pagination.pageCount
                : Math.ceil((filteredData?.length || 0) / pagination.pageSize),
        getRowId: (row) => row[id],
        state: {
            pagination,
            sorting,
            columnVisibility,
            columnFilters,
            rowSelection,
        },
        initialState: {
            columnPinning: config.pinning,
        },
        columnResizeMode: "onChange",

        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,

        // ✅ Mode server → panggil onChangeDataTable
        // ✅ Mode client → ubah state lokal
        onPaginationChange: (updater) => {
            if (isServerSide && !onChangeDataTable) return alert("Please define onChangeDataTable function");
            if (isServerSide && onChangeDataTable) {
                onChangeDataTable({ type: "pagination", updater });
            } else {
                setLocalPagination((old) =>
                    typeof updater === "function" ? updater(old) : updater
                );
            }
        },
        onSortingChange: (updater) => {
            if (isServerSide && !onChangeDataTable) return alert("Please define onChangeDataTable function");
            if (isServerSide && onChangeDataTable) {
                onChangeDataTable({ type: "sorting", updater });
            } else {
                setLocalSorting((old) =>
                    typeof updater === "function" ? updater(old) : updater
                );
            }
        },
        onColumnFiltersChange: (updater) => {
            if (isServerSide && !onChangeDataTable) return alert("Please define onChangeDataTable function");
            if (isServerSide && onChangeDataTable) {
                onChangeDataTable({ type: "filter", updater });
            } else {
                setLocalFilters((old) =>
                    typeof updater === "function" ? updater(old) : updater
                );
            }
        },

        getCoreRowModel: getCoreRowModel(),
        ...(isServerSide
            ? {}
            : {
                getFilteredRowModel: getFilteredRowModel(),
                getPaginationRowModel: getPaginationRowModel(),
                getSortedRowModel: getSortedRowModel(),
            }),
        filterFns: {
            date: fnFilterSingleDate,
            number: numberFilterFn,
        },
    });

    return (
        <DataGrid
            isLoading={loading}
            table={table}
            recordCount={filteredData?.length || 0}
            tableLayout={{
                width: config.width,
                headerSticky: config.headerSticky,
                columnsPinnable: config.columnsPinnable,
                columnsResizable: config.columnsResizable,
                columnsMovable: config.columnsMovable,
                columnsVisibility: config.columnsVisibility,
                showColumnsPinnable: config.showColumnsPinnable,
                showPaginationSection: config.showPaginationSection,
                showTotalRows: config.showTotalRows,
                showRowPerPage: config.showRowPerPage,
                showPageOf: config.showPageOf,
                showPagination: config.showPagination,
                isServerSide,
                serverSideFilterValues,
                onChangeFilterColumns,
                totalData: pagination.total,
            }}
        >
            <div className="w-full space-y-2.5">
                {/* Filter */}
                <div className={`grid ${isShowSearch ? "grid-cols-2" : "grid-cols-1"} gap-2.5 items-center`}>
                    {/* Search */}
                    {isShowSearch && <>
                        <div className="relative w-[250px]">
                            {/* Search Icon */}
                            <Search className="size-3 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

                            {/* Input */}
                            <Input
                                placeholder="Search ( press Enter ↵ )"
                                value={searchInput}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setSearchInput(v); // <-- input bisa diketik normal

                                    if (v === "") {
                                        if (isServerSide && onChangeDataTable)
                                            onChangeDataTable({ type: "search", updater: "" });
                                        else setLocalSearch("");
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        if (isServerSide && onChangeDataTable)
                                            onChangeDataTable({ type: "search", updater: searchInput });
                                        else setLocalSearch(searchInput);
                                    }
                                }}
                                className="h-8 text-xs ps-9 pe-9 w-full"
                            />

                            {/* X Icon */}
                            {searchQuery?.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchInput(""); // <-- reset tampilan input

                                        if (isServerSide && onChangeDataTable)
                                            onChangeDataTable({ type: "search", updater: "" });
                                        else setLocalSearch("");
                                    }}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded hover:bg-muted transition"
                                >
                                    <X className="size-3.5 text-muted-foreground" />
                                </button>
                            )}
                        </div>
                    </>}

                    {/* Additional Filters */}
                    {additionalFilters && <div className="w-full items-center">{additionalFilters}</div>}
                </div>

                <DataGridContainer>
                    <ScrollArea
                        className={
                            scrollHeightClassName ||
                            (isTransfer
                            ? "max-h-[31vh] min-h-[31vh]"
                            : "max-h-[43rem]")
                        }
                        >
                        <DataGridTable />
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </DataGridContainer>
                <DataGridPagination />
            </div>
        </DataGrid>
    );
}

export { NewDataTable };