import React, { Suspense } from 'react'
import TaskList from '@/components/Tasks/ListTasks'
import { getFields } from '@/actions/tasks'
import { FilterButtons } from './FilterButtons'

export default async function TasksPage() {
  const fields = await getFields()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex items-center gap-2">
          <FilterButtons />
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field.title} className="aspect-video rounded-xl border-1 p-2">
              <TaskList fieldTitle={field.title} />
            </div>
          ))}
        </div>
      </Suspense>
    </div>
  )
}
