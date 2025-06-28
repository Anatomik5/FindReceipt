import React from 'react';
import { Clock, Users, Star, TrendingUp } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
    >
      {/* Recipe Image */}
      <div className="relative overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium text-emerald-600 bg-emerald-100">
            {recipe.mealType}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
          <TrendingUp size={12} className="text-emerald-600" />
          <span className="text-xs font-medium text-emerald-600">{recipe.matchPercentage}%</span>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {recipe.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Star className="fill-yellow-400 text-yellow-400" size={14} />
            <span className="font-medium text-gray-900">{Number(recipe.rating).toFixed(2)}</span>
            <span>({recipe.reviewCount})</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{recipe.cookingTime}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{recipe.servings}</span>
            </div>
          </div>
        </div>

        {/* Dietary Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.dietaryTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-xs"
            >
              {tag}
            </span>
          ))}
          {recipe.dietaryTags.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-xs">
              +{recipe.dietaryTags.length - 3} more
            </span>
          )}
        </div>

        {/* Calories */}
        <div className="text-sm">
          <span className="font-medium text-gray-900">{recipe.calories}</span>
          <span className="text-gray-500"> calories per serving</span>
        </div>
      </div>
    </div>
  );
};