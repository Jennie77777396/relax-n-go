'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react'; // Icons
import { motion } from 'framer-motion'; // Animations

export function GoToQAGame() {
  const router = useRouter();

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    >
      <Button
        onClick={() => router.push('/full-stack')}
        className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
      >
        <Play className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" /> {/* Game icon */}
        <span>Go to Q&A Game</span>
      </Button>
    </motion.div>
  );
}