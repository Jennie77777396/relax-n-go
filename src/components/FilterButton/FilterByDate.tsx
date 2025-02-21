'use client'

import { Button } from '@/components/ui/button'
import { CalendarDays } from 'lucide-react'
import { motion } from 'framer-motion'
import { getTasks } from '@/actions/tasks'

export default function FilterByDate() {
  const handleFilter = async () => {
    try {
      const result = await getTasks()
      console.log('filter result: ', result)
    } catch (error) {
      console.error('Error filtering tasks by date:', error)
    }
  }

  return (
    <Button variant="outline" className="flex items-center gap-2 rounded-md">
      <motion.span
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 90 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <CalendarDays className="w-4 h-4" />
      </motion.span>
      Today
    </Button>
  )
}
