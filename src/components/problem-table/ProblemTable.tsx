"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, CheckSquare, Square } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleBatchDelete = () => {
    const selectedIds = selectedRows.map((row: any) => row.id);
    console.log("批量删除题目:", selectedIds);
  };

  const handleSelectAll = () => {
    table.toggleAllPageRowsSelected(true);
  };

  const handleDeselectAll = () => {
    table.toggleAllPageRowsSelected(false);
  };

  return (
    <div className="space-y-4 min-w-[600px]">
      {selectedRows && selectedRows.length > 0 && (
        <div className="flex items-center gap-4 bg-red-50 p-4 rounded-lg border border-red-200">
          <span className="text-sm text-red-700">
            已选择 {selectedRows.length} 个题目
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeselectAll}
            className="gap-2"
          >
            <Square className="h-4 w-4" />
            取消
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="gap-2"
          >
            <CheckSquare className="h-4 w-4" />
            全选
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBatchDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            批量删除
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
