'use client'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

// Define a type for the button keys
type ButtonKey = 'today' | 'lastThreeDays' | 'reviewOnly' | 'hideCompleted'

export function FilterButtons() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (filterKey: ButtonKey) => {
    const currentFilters = {
      today: searchParams.get('fromDate') === new Date().toISOString().split('T')[0],
      lastThreeDays:
        searchParams.get('fromDate') ===
        new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split('T')[0],
      reviewOnly: searchParams.get('reviewOnly') === 'true',
      hideCompleted: searchParams.get('hideCompleted') === 'false',
    }

    const newFilters = { ...currentFilters }

    if (filterKey === 'today') {
      newFilters.today = !newFilters.today
      newFilters.lastThreeDays = false
    } else if (filterKey === 'lastThreeDays') {
      newFilters.lastThreeDays = !newFilters.lastThreeDays
      newFilters.today = newFilters.lastThreeDays ? false : newFilters.today
    } else {
      newFilters[filterKey] = !newFilters[filterKey]
    }

    // Update the URL with new filters
    router.replace(`?${new URLSearchParams(newFilters as any).toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => handleFilterChange('lastThreeDays')}
        variant={
          searchParams.get('fromDate') ===
            new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split('T')[0] ||
          searchParams.get('lastThreeDays') === 'true'
            ? 'default'
            : 'outline'
        }
        size="sm"
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        Last 3 days
      </Button>
      <Button
        onClick={() => handleFilterChange('today')}
        variant={
          searchParams.get('fromDate') === new Date().toISOString().split('T')[0] ||
          searchParams.get('today') === 'true'
            ? 'default'
            : 'outline'
        }
        size="sm"
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        Today
      </Button>
      <Button
        onClick={() => handleFilterChange('reviewOnly')}
        variant={searchParams.get('reviewOnly') === 'true' ? 'default' : 'outline'}
        size="sm"
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        Review Only
      </Button>
      <Button
        onClick={() => handleFilterChange('hideCompleted')}
        variant={searchParams.get('hideCompleted') === 'true' ? 'default' : 'outline'}
        size="sm"
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        Hide Completed Tasks
      </Button>
    </div>
  )
}
