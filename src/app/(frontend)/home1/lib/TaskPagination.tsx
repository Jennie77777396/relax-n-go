'use client'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PaginatedDocs } from 'payload'
const TaskPagination = ({ page }: { page: PaginatedDocs }) => {
  const [currentPage, setCurrentPage] = useState<number>(page.page || 1)
  const [totalPages, setTotalPages] = useState<number>(page.totalPages || 1)
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(page.hasPrevPage || false)
  const [hasNextPage, setHasNextPage] = useState<boolean>(page.hasNextPage || false)
  return (
    <div>
      {/* 🔹 ShadCN Pagination */}
      <Pagination className="mt-4">
        <PaginationContent className="gap-2">
          <PaginationItem>
            {hasPrevPage ? (
              <PaginationLink onClick={() => setCurrentPage((prev) => prev - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </PaginationLink>
            ) : (
              <PaginationLink className="pointer-events-none opacity-50">
                <ChevronLeft className="h-4 w-4" />
              </PaginationLink>
            )}
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            {hasNextPage ? (
              <PaginationLink onClick={() => setCurrentPage((prev) => prev + 1)}>
                <ChevronRight className="h-4 w-4" />
              </PaginationLink>
            ) : (
              <PaginationLink className="pointer-events-none opacity-50">
                <ChevronRight className="h-4 w-4" />
              </PaginationLink>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
export default TaskPagination
