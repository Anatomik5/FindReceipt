import React from 'react';
import { SearchFilters as SearchFiltersType } from '../types/recipe';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const updateFilter = (key: keyof SearchFiltersType, value: string | number) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Filter Results</h3>
      
      {/* Meal Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meal Type
        </label>
        <select
          value={filters.mealType}
          onChange={(e) => updateFilter('mealType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
        >
          <option value="">Any</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snack">Snack</option>
        </select>
      </div>

      {/* Dietary Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dietary Preference
        </label>
        <select
          value={filters.dietaryPreference}
          onChange={(e) => updateFilter('dietaryPreference', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
        >
          <option value="">Any</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Gluten-Free">Gluten-Free</option>
          <option value="Keto">Keto</option>
          <option value="Low-Carb">Low-Carb</option>
          <option value="High-Protein">High-Protein</option>
        </select>
      </div>

      {/* Cooking Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Cooking Time: {filters.maxCookingTime} minutes
        </label>
        <input
          type="range"
          min="10"
          max="120"
          step="5"
          value={filters.maxCookingTime}
          onChange={(e) => updateFilter('maxCookingTime', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10 min</span>
          <span>120 min</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Rating: {filters.minRating} stars
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.minRating}
          onChange={(e) => updateFilter('minRating', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 ⭐</span>
          <span>5 ⭐</span>
        </div>
      </div>
    </div>
  );
};