"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { UserSelectModel } from "@/schema/user.schema";

const columns: ColumnDef<UserSelectModel>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
  },
  {
    accessorKey: "email",
    header: "邮箱",
    size: 200,
  },
  {
    accessorKey: "username",
    header: "用户名",
    size: 150,
  },
  {
    accessorKey: "role",
    header: "角色",
    size: 100,
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const roleColor = role === "admin" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700";
      return (
        <span className={`px-2 py-1 text-xs rounded-full ${roleColor}`}>
          {role === "admin" ? "管理员" : "用户"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "创建时间",
    size: 150,
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      return createdAt ? createdAt.toLocaleString() : "-";
    },
  },
  {
    id: "actions",
    header: "操作",
    size: 100,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              console.log("删除用户:", user.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export { columns };
