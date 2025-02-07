'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useKnowledgeStore } from '@/stores/useKnowledgeStore';
import { useFieldStore } from '@/stores/useFieldStore';
import { Field } from '@/payload-types';
import { Textarea } from '@/components/ui/textarea';

export function CreateQAButton() {
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Input state
  const [taskName, setTaskName] = useState('');
  const [taskAnswer, setTaskAnswer] = useState('');
  const [selectedFieldId, setSelectedFieldId] = useState<string>(''); // Store the selected field's ID
  const [tags, setTags] = useState('');


  // Store hooks
  const { fields } = useFieldStore();
  const { addKnowledgeCard } = useKnowledgeStore();

  // Find the selected field object
  const selectedField = fields.find((field) => field.id.toString() === selectedFieldId);

  const handleCreateQA = async () => {
    setIsLoading(true);
    try {
      const result = await addKnowledgeCard({
        taskName, // Add this if needed
        taskAnswer,
        field: selectedField ? [selectedField] : [], // Pass the selected field object
        status: 'Not Started',
        id: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

      });
      setIsSuccess(true);
      setShowPopover(true);
      setTimeout(() => setShowPopover(false), 2000);

      // Reset form fields
      setTaskName('');
      setTaskAnswer('');
      setSelectedFieldId('');

    } catch (error) {
      setIsSuccess(false);
      setShowPopover(true);
      setTimeout(() => setShowPopover(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <Popover open={showPopover}>
        <PopoverTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTrigger asChild>
              <Button className="group">
                <PlusCircle className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                Create New Q&A Cards
              </Button>
            </DialogTrigger>
          </motion.div>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <div className="flex items-center gap-2">
            {isSuccess ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span>Q&A Card created successfully!</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span>Failed to create Q&A Card</span>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Q&A Card</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="taskDescription">Question</Label>
            <Textarea
              onChange={(e) => setTaskName(e.target.value)}
              value={taskName}
              placeholder="Enter your question"
            />

          </div>
          <div>
            <Label htmlFor="taskAnswer">Answer</Label>
            <Textarea
              onChange={(e) => setTaskAnswer(e.target.value)}
              value={taskAnswer}
              placeholder="Enter your answer"
            />
          </div>
          <div>
            <Label htmlFor="field">Field</Label>
            <Select onValueChange={(value) => setSelectedFieldId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <SelectItem key={field.id} value={field.id.toString()}>
                    {field.fieldName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreateQA} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Q&A Card"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}