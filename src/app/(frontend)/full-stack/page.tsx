import { getTasks, getKnowledgeCards } from '../actions1'
import { CreateTaskButton2 } from '@/components/CreateTaskButton'
import { CreateQAButton } from '@/components/CreateQAButton'
import { AccordionKnowledgeCard } from '@/components/KnowledgeCard'
import { FullTaskCard } from '@/components/TaskCard'

export default async function FullStackPage() {
  const tasks = await getTasks()
  const knowledge = await getKnowledgeCards()

  return (
    <main className="flex flex-row items-start justify-center min-h-screen bg-gray-100 p-8 gap-8">
      {/* Tasks Section (Left) */}
      <div className="w-1/2 bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span role="img" aria-label="Tasks" className="mr-2">
              📋
            </span>
            Tasks
          </h2>
          <div className="flex space-x-4">
            <CreateTaskButton2 />
            <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <span role="img" aria-label="Grid View">
                ⬛
              </span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <span role="img" aria-label="List View">
                📄
              </span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {tasks.docs.map((task) => (
            <FullTaskCard key={task.id} data={task} />
          ))}
        </div>
      </div>

      {/* Knowledge Cards Section (Right) */}
      <div className="w-1/2 bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span role="img" aria-label="Knowledge" className="mr-2">
              🧠
            </span>
            Knowledge Cards
          </h2>
          <div className="flex space-x-4">
            <CreateQAButton />
            <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <span role="img" aria-label="Grid View">
                ⬛
              </span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <span role="img" aria-label="List View">
                📄
              </span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {knowledge.data?.docs?.map((card) => <AccordionKnowledgeCard key={card.id} {...card} />)}
        </div>
      </div>
    </main>
  )
}
