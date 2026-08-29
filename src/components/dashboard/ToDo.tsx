'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, UtensilsCrossed, Dumbbell, Heart } from 'lucide-react';

interface ToDoItem {
  id: string;
  label: string;
  type: 'meal' | 'exercise' | 'habit';
  completed: boolean;
}

const defaultItems: ToDoItem[] = [
  { id: 'breakfast', label: 'Log breakfast', type: 'meal', completed: true },
  { id: 'lunch', label: 'Log lunch', type: 'meal', completed: true },
  { id: 'dinner', label: 'Log dinner', type: 'meal', completed: false },
  { id: 'snack', label: 'Log snack', type: 'meal', completed: false },
  { id: 'workout', label: 'Complete workout', type: 'exercise', completed: true },
  { id: 'walk', label: '10k steps', type: 'exercise', completed: false },
  { id: 'water', label: 'Drink 8 glasses water', type: 'habit', completed: false },
  { id: 'sleep', label: 'Sleep before 11 PM', type: 'habit', completed: false },
];

const typeIcons = {
  meal: <UtensilsCrossed className="w-4 h-4" />,
  exercise: <Dumbbell className="w-4 h-4" />,
  habit: <Heart className="w-4 h-4" />,
};

const typeColors = {
  meal: 'text-tertiary',
  exercise: 'text-primary',
  habit: 'text-secondary',
};

export default function ToDo() {
  const [items, setItems] = useState<ToDoItem[]>(defaultItems);

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-headline-md font-semibold text-on-surface">Today&apos;s Tasks</h2>
        <span className="text-sm text-on-surface-variant">
          {completedCount}/{totalCount} done
        </span>
      </div>

      <div className="h-2 bg-surface-container rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        />
      </div>

      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-container transition-colors text-left"
          >
            {item.completed ? (
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-outline-variant shrink-0" />
            )}
            <span className={`shrink-0 ${typeColors[item.type]}`}>
              {typeIcons[item.type]}
            </span>
            <span className={`text-sm ${item.completed ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
