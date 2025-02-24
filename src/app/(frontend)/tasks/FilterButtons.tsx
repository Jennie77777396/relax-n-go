'use client'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
export function FilterButtons({ initialParams }: { initialParams?: any }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentFilters = {
    today: searchParams.get('today') === 'true',
    lastThreeDays: searchParams.get('lastThreeDays') === 'true',
    reviewOnly: searchParams.get('reviewOnly') === 'true',
    hideCompleted: searchParams.get('hideCompleted') === 'true',
  }
  const handleFilterChange = (filterKey: string) => {
    const params = new URLSearchParams(searchParams)

    // 切换过滤器状态
    if (params.get(filterKey) === 'true') {
      params.delete(filterKey)
    } else {
      params.set(filterKey, 'true')
    }

    // 根据 Next.js 15 路由最佳实践更新 URL[2](@ref)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => handleFilterChange('today')}
        variant={currentFilters.today ? 'default' : 'outline'}
        size="sm"
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        Today
      </Button>
      <Button
        onClick={() => handleFilterChange('lastThreeDays')}
        variant={currentFilters.lastThreeDays ? 'default' : 'outline'}
        size="sm"
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        Last 3 days
      </Button>
      <Button
        onClick={() => handleFilterChange('reviewOnly')}
        variant={currentFilters.reviewOnly ? 'default' : 'outline'}
        size="sm"
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        Review Only
      </Button>
      <Button
        onClick={() => handleFilterChange('hideCompleted')}
        variant={currentFilters.hideCompleted ? 'default' : 'outline'}
        size="sm"
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        Hide Completed Tasks
      </Button>
    </div>
  )
}
