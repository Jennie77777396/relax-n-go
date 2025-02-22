const baseURL = process.env.NEXT_SERVER_URL

export async function getFields({ fieldName }: { fieldName: string | null }) {
  const getFieldsURL = `${baseURL}/api/fields`

  // Construct the query parameters with only the title
  const searchParams = fieldName ? `?where[title][equals]=${encodeURIComponent(fieldName)}` : ''

  try {
    const response = await fetch(getFieldsURL + searchParams, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error fetching fields:', errorData)
      return { success: false, error: errorData.message || 'Failed to fetch fields' }
    }
    const field = await response.json()
    console.log('field in getFields', JSON.stringify(field.docs))
    return { success: true, field: field.docs }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
export async function addFields() {}
export async function deleteFields() {}
export async function updateFields() {}
