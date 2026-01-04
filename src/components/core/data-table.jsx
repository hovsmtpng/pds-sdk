import { useEffect, useState, useRef, useCallback } from "react";
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
import { apiCall } from "@/api/apiService";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

function DataTableServerSide({
    // mandatory
    uniqueKey = "id",
    method = "POST",
    url,
    columns,

    // optional
    isShowSearch = true,
    withNumbering = true,
    additionalFilters,

    enableRowSelection = false,
    rowSelection,
    setRowSelection,

    pinning = { left: [], right: [] },

    dense = false,
    cellBorder = false,
    rowBorder = true,
    rowRounded = false,
    stripped = false,
    headerBackground = true,
    headerBorder = true,
    headerSticky = true,
    width = 'fixed',
    columnsVisibility = false,
    columnsResizable = true,
    columnsPinnable = true,
    columnsMovable = true,
    columnsDraggable = true,
    rowsDraggable = true,

    showColumnsPinnable = false,

    showPaginationSection = true, //harus true untuk : showTotalRows, showRowPerPage, showPageOf, showPagination
    showTotalRows = true,
    showRowPerPage = true,
    showPageOf = true,
    showPagination = true,
}) {

    const numberedColumns = withNumbering
        ? [
            {
                id: "rowNumber",
                header: "#",
                size: 50,
                enableSorting: false,
                cell: ({ row }) => {
                    const { pageIndex, pageSize } = pagination;
                    return <span>{pageIndex * pageSize + row.index + 1}</span>;
                },
            },
            ...columns,
        ]
        : columns;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [filterColumns, setFilterColumns] = useState({});

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
        total: 0,
        pageCount: 1,
    });

    const [sorting, setSorting] = useState([{ id: "customer_name", asc: true }]);

    // Flag to prevent infinite loop when updating internal state
    const internalUpdate = useRef(false);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    const onChangeDataTable = ({ type, updater }) => {
        switch (type) {
            case "pagination": {
                setPagination((prev) =>
                    typeof updater === "function"
                        ? updater(prev)
                        : { ...prev, ...updater }
                );
                break;
            }

            case "sorting": {
                setSorting((prev) =>
                    typeof updater === "function" ? updater(prev) : updater
                );
                break;
            }

            case "filter": {
                // setFilterColumns((prev) =>
                //     typeof updater === "function" ? updater(prev) : updater
                // );
                break;
            }

            case "search": {
                setSearch((prev) =>
                    typeof updater === "string" ? updater : prev
                );
                break;
            }

            default:
                break;
        }
    };

    const onChangeFilterColumns = useCallback((key, value) => {
        setFilterColumns((prev) => {
            return {
                ...prev,
                [key]: value
            }
        });
    }, [setFilterColumns]);

    const fetchData = async () => {
        if (!url) return;

        try {
            setLoading(true);
            internalUpdate.current = true;

            const params = {
                pageIndex: pagination.pageIndex + 1,
                pageSize: pagination.pageSize,
                search: debouncedSearch,
                sorting,
                filterColumns,
            };

            const res = await apiCall(url, method, params);

            const newMeta = res?.meta?.pagination || {};

            console.log(res.data)
            setData(res.data || []);

            // IMPORTANT:
            // Hanya update nilai yang aman, tidak overwrite pagination dari server
            setPagination((prev) => ({
                ...prev,
                total: newMeta.totalData ?? prev.total,
                pageCount: newMeta.pageCount ?? Math.ceil((newMeta.totalData ?? prev.total) / prev.pageSize),
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);

            // Reset internal update
            setTimeout(() => {
                internalUpdate.current = false;
            });
        }
    };

    useEffect(() => {
        if (internalUpdate.current) return;
        fetchData();
    }, [
        url,
        method,
        debouncedSearch,
        pagination.pageIndex,
        pagination.pageSize,
        JSON.stringify(sorting),
        JSON.stringify(filterColumns),
    ]);

    const table = useReactTable({
        data,
        columns: numberedColumns,
        state: {
            pagination,
            sorting,
            rowSelection,
        },
        
        initialState: {
            columnPinning: pinning,
        },

        columnResizeMode: "onChange",

        enableRowSelection: enableRowSelection,
        onRowSelectionChange: setRowSelection,

        manualPagination: true,
        manualSorting: true,
        pageCount: pagination.pageCount,
        getRowId: (row) => row[uniqueKey],

        onPaginationChange: (updater) => onChangeDataTable({ type: "pagination", updater }),
        onSortingChange: (updater) => onChangeDataTable({ type: "sorting", updater }),
        onColumnFiltersChange: (updater) => onChangeDataTable({ type: "filter", updater }),

        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const missingMessages = [];
    if (!url) missingMessages.push("URL is mandatory.");
    if (!columns || columns.length === 0) missingMessages.push("Columns are mandatory.");

    if (missingMessages.length > 0) {
        return (
            <div className="p-4 border rounded-md bg-red-50 text-red-600 text-sm space-y-1">
                {missingMessages.map((msg, i) => (
                    <div key={i}>{msg}</div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className={`grid ${isShowSearch ? "grid-cols-2" : "grid-cols-1"} gap-2.5 items-center`}>
                {/* Search */}
                {isShowSearch && <>
                    <div className="relative w-[250px]">
                        {/* Search Icon */}
                        <Search className="size-3 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

                        {/* Input */}
                        <Input
                            placeholder="Search ( press Enter ↵ )"
                            value={search}
                            onChange={(e) => {
                                const v = e.target.value;
                                setSearch(v);

                                if (v === "") {
                                    onChangeDataTable({ type: "search", updater: "" });
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    onChangeDataTable({ type: "search", updater: search });
                                }
                            }}
                            className="h-8 text-xs ps-9 pe-9 w-full"
                        />

                        {/* X Icon */}
                        {search?.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    onChangeDataTable({ type: "search", updater: "" });
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded hover:bg-muted transition"
                            >
                                <X className="size-3.5 text-muted-foreground" />
                            </button>
                        )}
                    </div>
                </>}

                {/* Additional Filters */}
                {additionalFilters && <div className="w-full flex items-center justify-end">{additionalFilters}</div>}
            </div>

            <DataGrid
                isLoading={loading}
                table={table}
                recordCount={pagination.total}
                tableLayout={{
                    isServerSide: true,

                    pinning: pinning,

                    dense: dense,
                    cellBorder: cellBorder,
                    rowBorder: rowBorder,
                    rowRounded: rowRounded,
                    stripped: stripped,
                    headerBackground: headerBackground,
                    headerBorder: headerBorder,
                    headerSticky: headerSticky,
                    width: width,
                    columnsVisibility: columnsVisibility,
                    columnsResizable: columnsResizable,
                    columnsPinnable: columnsPinnable,
                    columnsMovable: columnsMovable,
                    columnsDraggable: columnsDraggable,
                    rowsDraggable: rowsDraggable,

                    showColumnsPinnable: showColumnsPinnable,
                    showPaginationSection: showPaginationSection,
                    showTotalRows: showTotalRows,
                    showRowPerPage: showRowPerPage,
                    showPageOf: showPageOf,
                    showPagination: showPagination,

                    serverSideFilterValues: filterColumns,
                    onChangeFilterColumns,
                }}
            >
                <div className="w-full space-y-2.5">
                    <DataGridContainer>
                        <ScrollArea className="max-h-96">
                            <DataGridTable />
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </DataGridContainer>

                    <DataGridPagination />
                </div>
            </DataGrid>
        </div>
    );
}

export default DataTableServerSide;
