'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createField } from '@/app/(frontend)/actions';
import { colorOptions } from '@/blocks/Color/config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateFieldButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [field, setField] = useState('');
  const [color, setColor] = useState(colorOptions[0]);


  const handleCreateField = async () => {
    setIsLoading(true);
    try {
      await createField({
        fieldName: field,
        color: color || 'slate',
      });
      // First close create dialog
      setOpen(false);
      // Reset form
      setField('');
      setColor(colorOptions[0]);

      
      // Then show success dialog after a small delay
      setTimeout(() => {
        setIsSuccess(true);
        setShowSuccessDialog(true);
      }, 100);
    } catch (error) {
      setIsSuccess(false);
      setShowSuccessDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-hide success dialog after 3 seconds (increased from 2)
  useEffect(() => {
    if (showSuccessDialog) {
      const timer = setTimeout(() => {
        setShowSuccessDialog(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessDialog]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="group">
            <PlusCircle className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
            Create New Field
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fieldName">Field Name</Label>
              <Input
                id="fieldName"
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="Enter field name"
              />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center gap-2">
                        <div 
                          className={`h-4 w-4 rounded-full bg-${color}-500`}
                        />
                        <span className="capitalize">{color}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateField} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Field"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isSuccess ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>Field Created!</div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>Error</div>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            {isSuccess ? (
              <p className="text-gray-500">Your field has been created successfully.</p>
            ) : (
              <p className="text-gray-500">Failed to create field. Please try again.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}