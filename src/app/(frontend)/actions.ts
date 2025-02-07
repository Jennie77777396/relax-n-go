'use server';
import { getPayload } from 'payload';
import config from '@payload-config';
import type { Task } from '@/payload-types';
import type { Field } from '@/payload-types';
import { colorOptions } from '@/blocks/Color/config';

export interface CreateFieldInput {
  fieldName: string;
  color: (typeof colorOptions)[number];
}

// Initialize Payload
const payload = await getPayload({ config });

// Fetch all tasks
export async function getTasks() {
  'use server';

  try {
    const tasks = await payload.find({
      collection: 'tasks',
    });
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
}

export async function getTask(id: number) {
  'use server';

  try {
    const task = await payload.findByID({
      collection: 'tasks',
      id,
    });

    return task;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw new Error('Failed to fetch task');
  }
}
// Fetch all fields
export async function getFields() {
  'use server';

  try {
    const fields = await payload.find({
      collection: 'fields',
    });
    return fields;
  } catch (error) {
    console.error('Error fetching fields:', error);
    throw new Error('Failed to fetch fields');
  }
}




// Create a new task
export async function createTask(input: Task) {
  'use server';

  try {
    const task = await payload.create({
      collection: 'tasks',
      data: {
        taskName: input.taskName,
        taskEmoji: input.taskEmoji,
        status: input.status,
      },
    });

    
    return { success: true, data: task };
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false, error: 'Failed to create task' };
  }
}

// Update a task
export async function updateTask(id: number, data: Partial<Task>) {
  'use server';

  try {
    // Ensure startTime is properly handled
    const updateData = {
      ...data,
      // Convert undefined to null for the database
      startTime: data.startTime === undefined ? null : data.startTime,
      // Ensure totalMinutesSpent is a number
      totalMinutesSpent: typeof data.totalMinutesSpent === 'number' ? data.totalMinutesSpent : 0,
    };

    const task = await payload.update({
      collection: 'tasks',
      id,
      data: updateData,
    });
    
    return { success: true, data: task };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, error: 'Failed to update task' };
  }
}

// Delete a task
export async function deleteTask(id: number) {
  'use server';

  try {
    await payload.delete({
      collection: 'tasks',
      id,
    });

    
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: 'Failed to delete task' };
  }
}

// Delete a field
export async function deleteField(id: string) {
  'use server';

  try {
    await payload.delete({
      collection: 'fields',
      id,
    });

    
    return { success: true };
  } catch (error) {
    console.error('Error deleting field:', error);
    return { success: false, error: 'Failed to delete field' };
  }
}

// Create a new field
export const createField = async (data: CreateFieldInput) => {
  'use server';

  try {
    const response = await payload.create({
      collection: 'fields',
      data: {
        fieldName: data.fieldName,
        color: data.color as (typeof colorOptions)[number],
      },
    });

    

    return { success: true, data: response };
  } catch (error) {
    console.error('Error creating field:', error);
    return { success: false, error: 'Failed to create field' };
  }
};

// Update a field
export async function updateField(id: string, data: Partial<Field>) {
  'use server';

  try {
    const field = await payload.update({
      collection: 'fields',
      id,
      data,
    });

    
    return { success: true, data: field };
  } catch (error) {
    console.error('Error updating field:', error);
    return { success: false, error: 'Failed to update field' };
  }
}

export async function createKnowledgeCard(data: Partial<Task>) {
  'use server';


  try {
    const response = await payload.create({
      collection: 'tasks',
      data: {
        taskName: data.taskName || '',
        taskEmoji: data.taskEmoji || '',
        taskDescription: data.taskDescription,
        taskAnswer: data.taskAnswer,
        tags: data.tags || [],
        field: data.field || [],
        successAttempts: 0,
        totalAttempts: 0,
        importance: data.importance,
        status: 'Not Started',
      },
    });


    return { success: true, data: response };
  } catch (error) {
    console.error('Error creating knowledge card:', error);
    return { success: false, error: 'Failed to create knowledge card' };
  }
}

export async function updateKnowledgeCard(id: string, data: Partial<Task>) {
  'use server';

  try {
    const response = await payload.update({
      collection: 'tasks',
      id,
      data,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error('Error updating knowledge card:', error);
    return { success: false, error: 'Failed to update knowledge card' };
  }
}   

export async function deleteKnowledgeCard(id: string) {
  'use server';

  try {
    await payload.delete({
      collection: 'tasks',
      id,
    });

    return { success: true };
  } catch (error) {
      console.error('Error deleting knowledge card:', error);
      return { success: false, error: 'Failed to delete knowledge card' };
    }
  }

export async function getKnowledgeCards() {
  'use server';

  try {
    const response = await payload.find({ 
      collection: 'tasks'
    });


    return { success: true, data: response };
  } catch (error) {
    console.error('Error getting knowledge card:', error);
    return { success: false, error: 'Failed to get knowledge card' };
  }
} 









