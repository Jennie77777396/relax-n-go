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
  const currentPage = Number(page.page)
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
                {1 + i}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationLink
              isActive={currentPage < page.totalPages}
              onClick={() => {
                if (currentPage === page.totalPages) return
                SetTurning(true)
                changeHandle({ limit: page.limit, page: currentPage + 1 })
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
export default TaskPagination
