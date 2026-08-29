'use client';

import { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { allFoods } from '@/lib/food-database';
import { FoodItem } from '@/lib/types';

interface FoodSearchProps {
  onSelect?: (food: FoodItem) => void;
}

export default function FoodSearch({ onSelect }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const filtered = allFoods
      .filter(food =>
        food.name.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 8);

    setResults(filtered);
    setIsOpen(filtered.length > 0);
  };

  const handleSelect = (food: FoodItem) => {
    onSelect?.(food);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <h2 className="text-headline-md font-semibold text-on-surface mb-3">Eat anything new today?</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          placeholder="Search food to log..."
          className="w-full pl-11 pr-10 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-surface rounded-xl shadow-elevated border border-outline-variant/20 overflow-hidden">
          {results.map((food) => (
            <button
              key={food.id}
              onClick={() => handleSelect(food)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition-colors text-left"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">{food.name}</p>
                <p className="text-xs text-on-surface-variant">
                  {food.nutrition.calories} kcal · {food.nutrition.protein}g protein
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
