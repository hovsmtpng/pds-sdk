// src/types/react-table.d.ts
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // ✅ Extend PaginationState
  interface PaginationState {
    /** Total rows dari server-side */
    total?: number;
  }

  interface ColumnMeta<TData extends unknown, TValue> {
    /** Jenis filter (search/date/select/number/daterange) */
    filter?: "search" | "date" | "select" | "number" | "daterange" | "select-multiple";
    /** Opsi select (jika filter === "select") */
    options?: { label: string; value: string | number }[];

    /** Format tampilan atau parsing date */
    format?: string;
  }

  interface ColumnDef<TData extends unknown, TValue = unknown> {
    /** Posisi kolom (sticky left/right) */
    fixed?: "left" | "right";
    /** Format tanggal */
    format?: string;
  }

  interface TableMeta<TData extends unknown> {
    /** Opsional — update data inline */
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}
