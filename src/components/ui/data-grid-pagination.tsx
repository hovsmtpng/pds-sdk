import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useDataGrid } from '@/components/ui/data-grid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronLeftIcon, ChevronRight, ChevronRightIcon, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataGridPaginationProps {
  sizes?: number[];
  sizesInfo?: string;
  sizesLabel?: string;
  sizesDescription?: string;
  sizesSkeleton?: ReactNode;
  more?: boolean;
  moreLimit?: number;
  info?: string;
  infoSkeleton?: ReactNode;
  className?: string;
  rowsPerPageLabel?: string;
  previousPageLabel?: string;
  nextPageLabel?: string;
  ellipsisText?: string;
}

function DataGridPagination(props: DataGridPaginationProps) {
  const { props: dataGridProps, table, recordCount, isLoading } = useDataGrid();

  const defaultProps: Partial<DataGridPaginationProps> = {
    sizes: [5, 10, 25, 50, 100],
    sizesLabel: 'Show',
    sizesDescription: 'per page',
    sizesSkeleton: <Skeleton className="h-8 w-44" />,
    moreLimit: 5,
    more: false,
    info: 'Page {currentPage} of {pageCount}',
    infoSkeleton: <Skeleton className="h-8 w-60" />,
    rowsPerPageLabel: 'Rows per page',
    previousPageLabel: 'Go to previous page',
    nextPageLabel: 'Go to next page',
    ellipsisText: '...',
  };

  const mergedProps: DataGridPaginationProps = { ...defaultProps, ...props };

  const btnBaseClasses = 'size-7 p-0 text-sm';
  const btnArrowClasses = btnBaseClasses + ' rtl:transform rtl:rotate-180';
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, recordCount);
  const pageCount = table.getPageCount();

  const currentPage = pageIndex + 1;

  // Replace placeholders in paginationInfo
  // Replace placeholders in paginationInfo
  const paginationInfo = mergedProps?.info
    ? mergedProps.info
      .replace('{currentPage}', currentPage.toString())
      .replace('{pageCount}', pageCount.toLocaleString("id-ID"))
    : `Page ${currentPage} of ${pageCount}`;

  // Pagination limit logic
  const paginationMoreLimit = mergedProps?.moreLimit || 5;

  // Determine the start and end of the pagination group
  const currentGroupStart = Math.floor(pageIndex / paginationMoreLimit) * paginationMoreLimit;
  const currentGroupEnd = Math.min(currentGroupStart + paginationMoreLimit, pageCount);

  // Render page buttons based on the current group
  const renderPageButtons = () => {
    const buttons = [];
    for (let i = currentGroupStart; i < currentGroupEnd; i++) {
      buttons.push(
        <Button
          key={i}
          size="sm"
          mode="icon"
          variant="ghost"
          className={cn(btnBaseClasses, 'text-muted-foreground', {
            'bg-accent text-accent-foreground': pageIndex === i,
          })}
          onClick={() => {
            if (pageIndex !== i) {
              table.setPageIndex(i);
            }
          }}
        >
          {i + 1}
        </Button>,
      );
    }
    return buttons;
  };

  // Render a "previous" ellipsis button if there are previous pages to show
  const renderEllipsisPrevButton = () => {
    if (currentGroupStart > 0) {
      return (
        <Button
          size="sm"
          mode="icon"
          className={btnBaseClasses}
          variant="ghost"
          onClick={() => table.setPageIndex(currentGroupStart - 1)}
        >
          {mergedProps.ellipsisText}
        </Button>
      );
    }
    return null;
  };

  // Render a "next" ellipsis button if there are more pages to show after the current group
  const renderEllipsisNextButton = () => {
    if (currentGroupEnd < pageCount) {
      return (
        <Button
          className={btnBaseClasses}
          variant="ghost"
          size="sm"
          mode="icon"
          onClick={() => table.setPageIndex(currentGroupEnd)}
        >
          {mergedProps.ellipsisText}
        </Button>
      );
    }
    return null;
  };

  return (
    <div
      data-slot="data-grid-pagination"
      className={cn(
        'flex flex-wrap flex-col sm:flex-row justify-between items-center gap-2.5 py-2.5 sm:py-0 grow',
        mergedProps?.className,
      )}
    >
      <div className="flex flex-wrap items-center space-x-2.5 pb-2.5 sm:pb-0 order-2 sm:order-1">
        {dataGridProps.tableLayout?.showPaginationSection && dataGridProps.tableLayout?.showTotalRows && (
          <div className="text-sm text-muted-foreground">
            {(table.getState().pagination.total || table.getFilteredRowModel().rows.length).toLocaleString("id-ID")} row(s).
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-2.5 pt-2.5 sm:pt-0 order-1 sm:order-2">
        {
          dataGridProps.tableLayout?.showPaginationSection && dataGridProps.tableLayout?.showRowPerPage && (
            <>
        {isLoading ? (
          mergedProps?.sizesSkeleton
        ) : (
          <>
            <div className="text-sm text-muted-foreground">{mergedProps.rowsPerPageLabel}</div>
            <Select
              value={`${pageSize}`}
              indicatorPosition="right"
              onValueChange={(value) => {
                const newPageSize = Number(value);
                table.setPageSize(newPageSize);
              }}
            >
              <SelectTrigger className="w-fit" size="sm">
                <SelectValue placeholder={`${pageSize}`} />
              </SelectTrigger>
              <SelectContent side="top" className="min-w-[50px]">
                {mergedProps?.sizes?.map((size: number) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
            </>
          )
        }

        {
          dataGridProps.tableLayout?.showPaginationSection && (
            <>
        {isLoading ? (
          mergedProps?.infoSkeleton
        ) : (
          <>
                  <div className="text-sm text-muted-foreground text-nowrap order-2 sm:order-1">
                    {dataGridProps.tableLayout?.showPageOf && paginationInfo}
                  </div>
                  {pageCount > 1 && dataGridProps.tableLayout?.showPagination && (
              <div className="flex items-center space-x-1 order-1 sm:order-2">
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

                      {/* <Button
                  size="sm"
                  mode="icon"
                  variant="ghost"
                  className={btnArrowClasses}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">{mergedProps.previousPageLabel}</span>
                  <ChevronLeftIcon className="size-4" />
                </Button> */}

                      {/* {renderEllipsisPrevButton()}

                {renderPageButtons()}

                {renderEllipsisNextButton()} */}

                      {/* <Button
                  size="sm"
                  mode="icon"
                  variant="ghost"
                  className={btnArrowClasses}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">{mergedProps.nextPageLabel}</span>
                  <ChevronRightIcon className="size-4" />
                </Button> */}

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
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                      >
                        <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
            </>
          )
        }

      </div>
    </div>
  );
}

export { DataGridPagination, type DataGridPaginationProps };
