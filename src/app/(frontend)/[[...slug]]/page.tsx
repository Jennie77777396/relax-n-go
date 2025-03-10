import { getTasks } from '@/actions/tasks-rest'
import DataTable from '@/components/DataTable/DataTable'
export default async function FieldsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params
  let toFilter
  if (slug?.[0]) {
    toFilter = { 'fields.title': { like: decodeURIComponent(slug?.[0]) } }
  }
  const response = await getTasks(toFilter)
  return (
    <>
      <DataTable tasks={response.tasks} />
    </>
  )
}
