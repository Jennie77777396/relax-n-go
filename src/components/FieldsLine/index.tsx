import { Field } from '@/payload-types'

interface FieldsLineProps {
  fields: Field[] | null | undefined
}

export function FieldsLine({ fields }: FieldsLineProps) {
  {
    /* 🔹 Fields Section */
  }
  return (
    <div className="grid grid-cols-2 items-center gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {fields?.length ? (
          fields.map((field: Field) => (
            <div
              key={field.id}
              className={`rounded-full text-xs px-2 bg-${field.color}-500 text-white`}
            >
              {field.title}
            </div>
          ))
        ) : (
          <span className="text-gray-500">No field</span>
        )}
      </div>
    </div>
  )
}
