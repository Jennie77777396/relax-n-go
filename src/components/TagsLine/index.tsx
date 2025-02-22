import { Tag } from '@/payload-types'

interface TagsLineProps {
  tags: Tag[] | null | undefined
}

export function TagsLine({ tags }: TagsLineProps) {
  {
    /* 🔹 tags Section */
  }
  return (
    <div className="grid grid-cols-2 items-center gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {tags &&
          tags.length > 0 &&
          tags.map((tag: Tag) => (
            <div
              key={tag.id}
              className={`rounded-full text-xs px-2 bg-${tag.color}-500 text-white`}
            >
              {tag.title}
            </div>
          ))}
      </div>
    </div>
  )
}
