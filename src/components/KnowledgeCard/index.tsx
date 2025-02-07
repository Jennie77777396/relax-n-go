"use client";

import { useKnowledgeStore } from "@/stores/useKnowledgeStore";
import type { Task as KnowledgeCardType } from "@/payload-types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export function AccordionKnowledgeCard(card: KnowledgeCardType) {
  const { updateKnowledgeCard } = useKnowledgeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  // Calculate success ratio
  const successRatio = (card.successAttempts || 0) / (card.totalAttempts || 1) || 0;
  const successPercentage = Math.round(successRatio * 100);

  // Handle accordion open/close
  const handleAccordionOpen = () => {
    if (!isOpen && !hasAttempted) {
      // Increment totalAttempts when the accordion is opened for the first time
      updateKnowledgeCard(card.id.toString(), {
        totalAttempts: (card.totalAttempts || 0) + 1,
      });
      setHasAttempted(true);
    }
    setIsOpen(!isOpen);
  };

  // Handle success attempt
  const handleSuccess = () => {
    updateKnowledgeCard(card.id.toString(), {
      successAttempts: (card.successAttempts || 0) + 1,
    });
  };

  return (
    <div className="w-full">
      <Accordion key={card.id} type="single" collapsible className="w-full">
        <AccordionItem value={card.id?.toString() ?? "0"} className="border p-2 rounded-lg">
          <div className="flex items-center justify-between gap-4">
            <AccordionTrigger
              onClick={handleAccordionOpen}
              className="hover:no-underline flex-1 text-left flex items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{card.taskEmoji}</span>
                <span className="font-medium">{card.taskName || "No Title"}</span>
              </div>
            </AccordionTrigger>

            {/* Success Ratio and Progress Bar */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-semibold">
                {successPercentage}%
              </span>
              <Progress
                value={successPercentage}
                className="w-24 h-2 bg-gray-200 [&>div]:bg-green-500"
              />
              <span className="text-sm text-gray-500">
                ({card.successAttempts}/{card.totalAttempts})
              </span>
            </div>
          </div>

          <AccordionContent>
            <div className="space-y-4 mt-4">
              <p className="text-gray-700">{card.taskAnswer || "No Answer"}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSuccess}
                  className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700"
                >
                  <Check className="h-4 w-4" />
                  <span>I got it right</span>
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}