import { create } from 'zustand'
import { Task } from '@/payload-types'
import {
  getKnowledgeCards,
  createKnowledgeCard,
  updateKnowledgeCard,
  deleteKnowledgeCard,
  createField,
} from '@/app/(frontend)/actions1'

interface KnowledgeStore {
  knowledgeCards: Task[]
  loading: boolean
  error: string | null
  fetchKnowledgeCards: () => Promise<void>
  addKnowledgeCard: (knowledgeCard: Task) => Promise<void>
  updateKnowledgeCard: (id: string, data: Partial<Task>) => Promise<void>
  removeKnowledgeCard: (id: string) => Promise<void>
}

export const useKnowledgeStore = create<KnowledgeStore>((set) => ({
  knowledgeCards: [],
  loading: false,
  error: null,

  fetchKnowledgeCards: async () => {
    set({ loading: true, error: null })
    try {
      const knowledgeCards = await getKnowledgeCards()
      set({ knowledgeCards: knowledgeCards.data?.docs || [], loading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false })
    }
  },

  addKnowledgeCard: async (knowledgeCard) => {
    set({ loading: true, error: null })
    try {
      const response = await createKnowledgeCard({
        taskName: knowledgeCard.taskName,
        taskEmoji: knowledgeCard.taskEmoji,
        taskDescription: knowledgeCard.taskDescription,
        taskAnswer: knowledgeCard.taskAnswer,
        tags: knowledgeCard.tags,
        field: knowledgeCard.field,
        successAttempts: knowledgeCard.successAttempts,
        totalAttempts: knowledgeCard.totalAttempts,
      })

      if (response.success && response.data) {
        set((state) => ({
          knowledgeCards: [...state.knowledgeCards, response.data],
          loading: false,
        }))
      } else {
        set({ error: response.error || 'Failed to create card', loading: false })
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false })
    }
  },

  updateKnowledgeCard: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const updatedKnowledgeCard = await updateKnowledgeCard(id, data)

      set((state) => ({
        knowledgeCards: state.knowledgeCards.map((knowledgeCard) =>
          knowledgeCard.id.toString() === id ? (data as Task) : knowledgeCard,
        ),
        loading: false,
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false })
    }
  },

  removeKnowledgeCard: async (id) => {
    set({ loading: true, error: null })
    try {
      await deleteKnowledgeCard(id)

      set((state) => ({
        knowledgeCards: state.knowledgeCards.filter(
          (knowledgeCard) => knowledgeCard.id.toString() !== id,
        ),
        loading: false,
        error: null,
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false })
    }
  },
}))
