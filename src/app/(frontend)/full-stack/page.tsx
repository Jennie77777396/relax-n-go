import { TasksBlock } from "@/blocks/Tasks/component"
import { getTasks1 } from "../actions"
import { TaskCard } from "@/components/TaskCard"

export default async function FullStackPage() {
  const data = await getTasks1()
  console.log('Data', JSON.stringify(data, null, 2))
  return (
    <main className = 'flex items-center justify-center min-h-screen'>
   <TasksBlock data={data?.docs?.[0]} />
    </main>

  )
}
