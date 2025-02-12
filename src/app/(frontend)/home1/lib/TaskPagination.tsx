'use client'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PaginatedDocs } from 'payload'
import { PaginationType } from './types'
type ChangeHandle = (page: PaginationType) => Promise<void>
const TaskPagination = ({
  page,
  changeHandle,
}: {
  page: PaginatedDocs
  changeHandle: ChangeHandle
}) => {
  const [currentPage, setCurrentPage] = useState<number>(page.page || 1)
  const [turning, SetTurning] = useState<boolean>(false)
  const firstRef = useRef(true)

  return (
    <div>
      {/* 🔹 ShadCN Pagination */}
      <Pagination className="mt-4">
        <PaginationContent className="gap-2">
          <PaginationItem>
            {page.hasPrevPage ? (
              <PaginationLink
                onClick={() => {
                  SetTurning(true)
                  changeHandle({ limit: page.limit, page: currentPage - 1 })
                }}
                isActive={!turning && page && page.hasPrevPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </PaginationLink>
            ) : (
              <PaginationLink className="pointer-events-none opacity-50">
                <ChevronLeft className="h-4 w-4" />
              </PaginationLink>
            )}
          </PaginationItem>
          {[...Array(page.totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => {
                  SetTurning(true)
                  changeHandle({ limit: page.limit, page: i + 1 })
                }}
                isActive={!turning && currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationLink
              isActive={!turning && page && page.hasNextPage}
              onClick={() => {
                SetTurning(true)
                changeHandle({ limit: page.limit, page: currentPage + 1 })
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
export default TaskPagination
