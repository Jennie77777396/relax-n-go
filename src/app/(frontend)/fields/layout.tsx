'use client'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

export default function FieldsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isModalRoute = pathname.startsWith('/fields/') && pathname !== '/fields'

  return (
    <div className="relative min-h-screen">
      {/* Render the task list (fields/page.tsx) */}
      <main className="p-4">{children}</main>

      {/* Overlay for modal content when on /fields/[id] */}
      {isModalRoute && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}
