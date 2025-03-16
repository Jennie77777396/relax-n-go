'use client'

import { useState } from 'react'
import {
  ArrowUpDown,
  Calendar,
  Clock,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Star,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Task } from '@/payload-types'

// Add this style block
const scrollbarStyles = `
  /* Webkit browsers like Chrome, Safari */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: hsl(var(--background));
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground));
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--foreground));
  }

  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--muted-foreground)) hsl(var(--background));
  }
`

// Sample task data based on the new structure
const sampleTasks = [
  {
    id: 'task1',
    title: 'Complete project proposal',
    emoji: '📝',
    importance: 4,
    tags: ['work', 'urgent'],
    fields: ['project management', 'writing'],
    status: 0,
    start_time: '2023-11-15T09:00:00Z',
    total_spent: 3600, // 1 hour in seconds
    success_attempts: 0,
    total_attempts: 1,
    createdAt: '2023-11-14T14:30:00Z',
    updatedAt: '2023-11-14T14:30:00Z',
  },
  {
    id: 'task2',
    title: 'Go for a 5km run',
    emoji: '🏃',
    importance: 3,
    tags: ['health', 'personal'],
    fields: ['fitness'],
    status: 1,
    start_time: '2023-11-16T06:00:00Z',
    total_spent: 1800, // 30 minutes in seconds
    success_attempts: 1,
    total_attempts: 1,
    createdAt: '2023-11-15T20:00:00Z',
    updatedAt: '2023-11-16T06:35:00Z',
  },
  {
    id: 'task3',
    title: 'Learn React hooks',
    emoji: '⚛️',
    importance: 4,
    tags: ['learning', 'tech'],
    fields: ['programming', 'web development'],
    status: 0,
    start_time: '2023-11-17T13:00:00Z',
    total_spent: 7200, // 2 hours in seconds
    success_attempts: 0,
    total_attempts: 0,
    createdAt: '2023-11-15T10:15:00Z',
    updatedAt: '2023-11-15T10:15:00Z',
  },
  {
    id: 'task4',
    title: 'Meditate',
    emoji: '🧘',
    importance: 2,
    tags: ['health', 'personal'],
    fields: ['mindfulness'],
    status: 1,
    start_time: '2023-11-15T07:00:00Z',
    total_spent: 600, // 10 minutes in seconds
    success_attempts: 5,
    total_attempts: 7,
    createdAt: '2023-11-10T18:45:00Z',
    updatedAt: '2023-11-15T07:12:00Z',
  },
  {
    id: 'task5',
    title: 'Prepare presentation for client meeting',
    emoji: '🖥️',
    importance: 5,
    tags: ['work', 'urgent', 'client'],
    fields: ['communication', 'design'],
    status: 0,
    start_time: '2023-11-18T14:00:00Z',
    total_spent: 5400, // 1.5 hours in seconds
    success_attempts: 0,
    total_attempts: 0,
    createdAt: '2023-11-16T09:30:00Z',
    updatedAt: '2023-11-16T09:30:00Z',
  },
]

export default function SampleSandbox() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [importanceFilter, setImportanceFilter] = useState('All')
  const [taskList, setTaskList] = useState(sampleTasks)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  // Filter tasks based on search term and filters
  const filteredTasks = taskList.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.emoji.includes(searchTerm)

    const matchesStatus = statusFilter === 'All' || task.status.toString() === statusFilter
    const matchesImportance =
      importanceFilter === 'All' || task.importance.toString() === importanceFilter

    return matchesSearch && matchesStatus && matchesImportance
  })

  // Get status badge styling
  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
    ) : (
      <Badge variant="outline">Pending</Badge>
    )
  }

  // Format total_spent to display as HH:MM:SS
  const formatTimer = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Delete task function
  const deleteTask = (taskId: string) => {
    setTaskList(taskList.filter((task) => task.id !== taskId))
    setTaskToDelete(null)
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b p-4 bg-background">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add New Task
          </Button>
        </div>
      </header>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="0">Pending</SelectItem>
                <SelectItem value="1">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={importanceFilter} onValueChange={setImportanceFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Importance</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-md border flex-1 overflow-auto">
          {/* Add this style tag */}
          <style jsx>{scrollbarStyles}</style>
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="w-[50px]">Emoji</TableHead>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead className="min-w-[200px]">Task</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px]">
                  <div className="flex items-center">
                    Importance
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="w-[120px]">
                  <div className="flex items-center">
                    Start Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">Timer</TableHead>
                <TableHead className="w-[120px]">Attempts</TableHead>
                <TableHead className="w-[150px]">Tags</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.emoji}</TableCell>
                    <TableCell className="font-medium">{task.id}</TableCell>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {Array.from({ length: task.importance }).map((_, index) => (
                          <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {new Date(task.start_time).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatTimer(task.total_spent)}
                      </div>
                    </TableCell>
                    <TableCell>{`${task.success_attempts}/${task.total_attempts}`}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Change Status</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setTaskToDelete(task.id as unknown as Task | null)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    No tasks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={taskToDelete !== null}
        onOpenChange={(open: boolean) => !open && setTaskToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task "{taskToDelete?.title}". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => taskToDelete?.id && deleteTask(taskToDelete.id.toString())}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
