import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface Chapter {
  id: string;
  name: string;
  description: string;
  order_num: number;
  topics: string[];
}

interface ChapterAccordionProps {
  chapters: Chapter[];
  progress: { [key: string]: { completed: boolean } };
  onStart: (chapter: Chapter) => void;
}

export function ChapterAccordion({ chapters, progress, onStart }: ChapterAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {chapters.map((chapter) => {
        const isOpen = openId === chapter.id;
        const isCompleted = progress[chapter.id]?.completed || false;

        return (
          <div key={chapter.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300">
            <button
              onClick={() => toggle(chapter.id)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
                  {isCompleted ? (
                    <CheckCircle2 className="text-green-600" size={24} />
                  ) : (
                    <BookOpen className="text-blue-600" size={24} />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">
                    Chapter {chapter.order_num}: {chapter.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {chapter.topics.length} Topics • {isCompleted ? 'Completed' : 'Not started'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onStart(chapter);
                  }}
                  variant={isCompleted ? 'outline' : 'primary'}
                >
                  {isCompleted ? 'Review' : 'Start'}
                </Button>
                {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </div>
            </button>

            {isOpen && (
              <div className="p-5 bg-gray-50 border-t border-gray-100">
                <p className="text-gray-600 mb-4 italic text-sm">{chapter.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {chapter.topics.map((topic, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                      <Circle className="text-blue-400 fill-blue-400" size={8} />
                      <span className="text-sm text-gray-700 font-medium">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
