'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Hash, Star, Tag, XCircle } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { MarkdownEditor } from '@/components/Markdown/MarkdownEditor'
import { MarkdownRenderer } from '@/components/Markdown/MarkdownRenderer'

import { Task as TaskType } from '@/payload-types'

export function TaskEditPage({ task: initialTask }: { task: TaskType }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTitleEditing, setIsTitleEditing] = useState(false)

  // Initialize task with a default structure
  const [task, setTask] = useState<TaskType>(initialTask)
  // Handle form field changes
  const handleChange = (field: keyof TaskType, value: any) => {
    setTask((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle markdown content changes
  const handleContentChange = (value: string) => {
    setTask((prev) => ({
      ...prev,
      content: value || '',
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically send the updated task to your API
      console.log('Submitting updated task:', task)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate back or show success
      router.push('/tasks')
    } catch (error) {
      console.error('Error updating task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle tag removal
  const removeTag = (tagId: string) => {
    setTask((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag.id !== tagId),
    }))
  }

  // Handle success/failure recording
  const recordAttempt = (success: boolean) => {
    setTask((prev) => ({
      ...prev,
      success_attempts: success ? prev.success_attempts + 1 : prev.success_attempts,
      total_attempts: prev.total_attempts + 1,
    }))
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div
              className="flex items-center gap-2 group cursor-pointer"
              onClick={() => setIsTitleEditing(true)}
            >
              {isTitleEditing ? (
                <div className="flex items-center gap-2 w-full">
                  <Input
                    value={task.emoji}
                    onChange={(e) => handleChange('emoji', e.target.value)}
                    className="w-16 text-center text-2xl"
                    onBlur={() => setIsTitleEditing(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsTitleEditing(false)}
                  />
                  <Input
                    value={task.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="text-2xl font-bold flex-grow"
                    onBlur={() => setIsTitleEditing(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsTitleEditing(false)}
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <span className="text-3xl">{task.emoji}</span>
                  <h1 className="text-3xl font-bold group-hover:underline">{task.title}</h1>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="edit">
                <TabsList className="mb-4">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <MarkdownEditor value={task.content} onChange={handleContentChange} />
                </TabsContent>
                <TabsContent value="preview" className="prose dark:prose-invert max-w-none">
                  <div className="border rounded-md p-4 min-h-[200px]">
                    <MarkdownRenderer content={task.content} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-medium">
                    {task.success_attempts} / {task.total_attempts} attempts successful
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => recordAttempt(true)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Success
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => recordAttempt(false)}
                  >
                    <XCircle className="h-4 w-4" />
                    Failure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="importance">Importance</Label>
                  <div className="flex items-center space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-2xl cursor-pointer focus:outline-none"
                        onClick={() => handleChange('importance', star)}
                      >
                        {star <= task.importance ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Slider
                    id="status"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[task.status]}
                    onValueChange={(value) => handleChange('status', value[0])}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>0%</span>
                    <span>{Math.round(task.status * 100)}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags & Field</CardTitle>
              </CardHeader>
              {/* <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => removeTag(tag.id)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm" className="h-7">
                      + Add Tag
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="field">Field</Label>
                  <Select
                    value={task.fields?.id}
                    onValueChange={(value) => {
                      // This is a simplified example. In a real app, you'd have a list of fields to choose from.
                      const newField = { id: value, title: 'New Field', color: '#000000' }
                      handleChange('fields', newField)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={task.fields.id}>
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: task.fields.color }}
                          ></div>
                          {task.fields.title}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent> */}
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Relations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="parent_task">Parent Task</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input id="parent_task" value={task.parent_task} readOnly className="flex-1" />
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Subtasks</Label>
                  <div className="flex items-center mt-1">
                    <Hash className="h-4 w-4 text-blue-500 mr-1" />
                    <span>
                      {task.completed_subtasks} / {task.total_subtasks}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <Label className="text-xs">Created At</Label>
                  <div>{format(new Date(task.createdAt), 'PPP p')}</div>
                </div>
                <div>
                  <Label className="text-xs">Updated At</Label>
                  <div>{format(new Date(task.updatedAt), 'PPP p')}</div>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs">Task ID</Label>
                  <div className="font-mono">{task.id}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
