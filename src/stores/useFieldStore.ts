import { create } from 'zustand';
import { Field } from '@/payload-types';
import { getFields, createField, updateField, deleteField } from '@/app/(frontend)/actions';

interface FieldStore {
  fields: Field[];
  loading: boolean;
  error: string | null;
  fetchFields: () => Promise<void>;
  addField: (field: Field) => Promise<void>;
  updateField: (id: string, data: Partial<Field>) => Promise<void>;
  removeField: (id: string) => Promise<void>;
}

export const useFieldStore = create<FieldStore>((set) => ({
  fields: [],
  loading: false,
  error: null,

  fetchFields: async () => {
    set({ loading: true, error: null });
    try {
      const fields = await getFields();
      set({ fields: fields.docs, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
    }
  },

  addField: async (field) => {
    set({ loading: true, error: null });
    try {
      await createField({
        fieldName: field.fieldName,
        color: field.color ?? 'slate',
      });
      set((state) => ({ fields: [...state.fields, field], loading: false }));

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
    }

  },

  updateField: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedField = await updateField(id, data);
      set((state) => ({
        fields: state.fields.map((field) => (field.id.toString() === id ? data as Field : field)),
        loading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
    }
  },

  removeField: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteField(id);
      set((state) => ({
        fields: state.fields.filter((field) => field.id.toString() !== id),
        loading: false,
      }));

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
    }
  },
}));