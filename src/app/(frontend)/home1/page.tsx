'use server'

import CreateTaskButton from './page.client'
import TaskList from './lib/ListTasks'
import type { SearchParamType } from './lib/types'
import { findTasks } from './lib/findByField'
import PageClient from './page.client'
import { stringify, parse } from 'qs-esm'

const HomePage = async function ({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string }>
  searchParams?: Promise<SearchParamType>
}) {
  const findOption =
    (await searchParams) ||
    ({
      search: { title: '' },
      pages: { limit: 3, page: 1 },
    } as SearchParamType)

  const optionObj = parse(stringify(findOption)) as unknown as SearchParamType
  console.log('optionObj', optionObj)

  // || {
  //   search: { title: '' },
  //   pages: { limit: 10, page: 1 },
  // }

  console.log('===findOption', findOption)

  !optionObj?.search && (optionObj.search = { title: '' })
  !optionObj.pages && (optionObj.pages = { limit: 3, page: 1 })
  const tasks = await findTasks(optionObj)
  return (
    <main>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform 🌴✨</h1>
          <p className="text-lg text-gray-600">
            Meet Jennie, an experienced AI full-stack developer with a salary of $175k per year. She
            lives on a tropical island 🌺 and enjoys a fully remote, flexible work lifestyle. Jennie
            is also a talented task manager with a philosophy of <strong>"Relax and Go"</strong>.
            For her, <strong>relaxation is the key to success</strong>. 🧘‍♀️🚀
          </p>
          <PageClient tasks={tasks} />
        </div>
      </div>
    </main>
  )
}
export default HomePage
