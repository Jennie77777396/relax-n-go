// app/components/CreateTaskButton/index.tsx
import { getFields } from '@/app/(frontend)/field.actions';
import CreateTaskButtonClient from './CreateTaskButton.client';

export default async function CreateTaskButton() {

  return <CreateTaskButtonClient />;
}