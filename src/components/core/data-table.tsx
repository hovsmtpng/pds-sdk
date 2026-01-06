import { useEffect, useState, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { apiCall } from "@/api/apiService";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

/* ========================
   Types
======================== */

type AnyRecord = Record<string, any>;

interface ServerPagination extends PaginationState {
  total: number;
  pageCount: number;
}

interface DataTableServerSideProps<TData extends AnyRecord = AnyRecord> {
  uniqueKey?: keyof TData;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  columns: ColumnDef<TData, any>[];

  isShowSearch?: boolean;
  withNumbering?: boolean;
  additionalFilters?: ReactNode;

  enableRowSelection?: boolean;
  rowSelection?: Record<string, boolean>;
  setRowSelection?: (updater: any) => void;

  pinning?: { left?: string[]; right?: string[] };

  dense?: boolean;
  cellBorder?: boolean;
  rowBorder?: boolean;
  rowRounded?: boolean;
  stripped?: boolean;
  headerBackground?: boolean;
  headerBorder?: boolean;
  headerSticky?: boolean;
  width?: "fixed" | "auto";
  columnsVisibility?: boolean;
  columnsResizable?: boolean;
  columnsPinnable?: boolean;
  columnsMovable?: boolean;
  columnsDraggable?: boolean;
  rowsDraggable?: boolean;

  showColumnsPinnable?: boolean;

  showPaginationSection?: boolean;
  showTotalRows?: boolean;
  showRowPerPage?: boolean;
  showPageOf?: boolean;
  showPagination?: boolean;
}

/* ========================
   Component
======================== */

function DataTableServerSide<TData extends AnyRecord = AnyRecord>({
  uniqueKey = "id" as keyof TData,
  method = "POST",
  url,
  columns,

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
  width = "fixed",
  columnsVisibility = false,
  columnsResizable = true,
  columnsPinnable = true,
  columnsMovable = true,
  columnsDraggable = true,
  rowsDraggable = true,

  showColumnsPinnable = false,

  showPaginationSection = true,
  showTotalRows = true,
  showRowPerPage = true,
  showPageOf = true,
  showPagination = true,
}: DataTableServerSideProps<TData>) {

  const numberedColumns: ColumnDef<TData, any>[] = withNumbering
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

  const [data, setData] = useState<TData[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [filterColumns, setFilterColumns] = useState<Record<string, any>>({});

  const [pagination, setPagination] = useState<ServerPagination>({
    pageIndex: 0,
    pageSize: 5,
    total: 0,
    pageCount: 1,
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "customer_name", desc: false },
  ]);

  const internalUpdate = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const onChangeDataTable = ({
    type,
    updater,
  }: {
    type: "pagination" | "sorting" | "filter" | "search";
    updater: any;
  }) => {
    switch (type) {
      case "pagination":
        setPagination((prev) =>
          typeof updater === "function" ? updater(prev) : { ...prev, ...updater }
        );
        break;

      case "sorting":
        setSorting((prev) =>
          typeof updater === "function" ? updater(prev) : updater
        );
        break;

      case "filter":
        break;

      case "search":
        setSearch((prev) =>
          typeof updater === "string" ? updater : prev
        );
        break;
    }
  };

  const onChangeFilterColumns = useCallback((key: string, value: any) => {
    setFilterColumns((prev) => ({ ...prev, [key]: value }));
  }, []);

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

      setData(res.data || []);

      setPagination((prev) => ({
        ...prev,
        total: newMeta.totalData ?? prev.total,
        pageCount:
          newMeta.pageCount ??
          Math.ceil((newMeta.totalData ?? prev.total) / prev.pageSize),
      }));
    } finally {
      setLoading(false);
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
    state: { pagination, sorting, rowSelection },
    initialState: { columnPinning: pinning },
    columnResizeMode: "onChange",
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    manualSorting: true,
    pageCount: pagination.pageCount,
    getRowId: (row) => String(row[uniqueKey]),
    onPaginationChange: (updater) => onChangeDataTable({ type: "pagination", updater }),
    onSortingChange: (updater) => onChangeDataTable({ type: "sorting", updater }),
    onColumnFiltersChange: (updater) => onChangeDataTable({ type: "filter", updater }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const missingMessages: string[] = [];
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
        {isShowSearch && (
          <div className="relative w-[250px]">
            <Search className="size-3 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search ( press Enter ↵ )"
              value={search}
              onChange={(e) => {
                const v = e.target.value;
                setSearch(v);
                if (v === "") onChangeDataTable({ type: "search", updater: "" });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onChangeDataTable({ type: "search", updater: search });
                }
              }}
              className="h-8 text-xs ps-9 pe-9 w-full"
            />
            {search?.length > 0 && (
              <button
                type="button"
                onClick={() => onChangeDataTable({ type: "search", updater: "" })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded hover:bg-muted transition"
              >
                <X className="size-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        )}
        {additionalFilters && <div className="w-full flex items-center justify-end">{additionalFilters}</div>}
      </div>

      <DataGrid
        isLoading={loading}
        table={table}
        recordCount={pagination.total}
        tableLayout={{
          isServerSide: true,
          dense,
          cellBorder,
          rowBorder,
          rowRounded,
          stripped,
          headerBackground,
          headerBorder,
          headerSticky,
          width,
          columnsVisibility,
          columnsResizable,
          columnsPinnable,
          columnsMovable,
          columnsDraggable,
          rowsDraggable,
          showColumnsPinnable,
          showPaginationSection,
          showTotalRows,
          showRowPerPage,
          showPageOf,
          showPagination,
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