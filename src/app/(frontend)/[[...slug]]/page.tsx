import { getTasks } from '@/actions/tasks-rest'
import { getTasksREST } from '@/actions/tasks'
import DataTable from '@/components/DataTable/DataTable'
export default async function FieldsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params
  const toFilter = { 'fields.title': { like: slug?.[0] } }
  const response = await getTasks(toFilter)
  return (
    <>
      <DataTable tasks = {response.tasks} />
    </>
  )
}
