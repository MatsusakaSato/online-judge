"use client";

import { useState } from "react";
import { columns } from "@/components/user-list/UserColumns";
import ProblemTable from "@/components/problem-table/ProblemTable";
import { UserSelectModel } from "@/schema/user.schema";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface UserListClientProps {
  initialData: UserSelectModel[];
  total: number;
}

const PAGE_SIZE = 20;

export default function UserListClient({
  initialData,
  total,
}: UserListClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<UserSelectModel[]>(initialData);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    const offset = (page - 1) * PAGE_SIZE;
    const response = await fetch(
      `/api/users?limit=${PAGE_SIZE}&offset=${offset}`
    );
    const newData = await response.json();
    setData(newData);
  };

  return (
    <div className="space-y-6">
      <ProblemTable columns={columns} data={data} />

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
