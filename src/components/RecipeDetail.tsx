import React from 'react';
import { X, Clock, Users, Star, Download, ChefHat, TrendingUp } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onClose }) => {
  const handleDownload = (format: 'pdf' | 'txt') => {
    // Mock download functionality
    const content = `
${recipe.title}

${recipe.description}

Cooking Time: ${recipe.cookingTime} minutes
Servings: ${recipe.servings}
Calories per serving: ${recipe.calories}
Difficulty: ${recipe.difficulty}

Ingredients:
${recipe.ingredients.map(ing => `• ${ing}`).join('\n')}

Equipment Needed:
${recipe.equipment.map(eq => `• ${eq}`).join('\n')}

Instructions:
${recipe.instructions.map((inst, idx) => `${idx + 1}. ${inst}`).join('\n')}

Dietary Information: ${recipe.dietaryTags.join(', ')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format === 'pdf' ? 'txt' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-medium">
                {recipe.mealType}
              </span>
              <span className="px-3 py-1 bg-white/90 text-gray-800 rounded-full text-sm font-medium">
                {recipe.difficulty}
              </span>
              <div className="flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full">
                <TrendingUp size={14} className="text-emerald-600" />
                <span className="text-sm font-medium text-emerald-600">{recipe.matchPercentage}% match</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          {/* Stats Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="fill-yellow-400 text-yellow-400" size={20} />
                <span className="text-lg font-semibold">{recipe.rating}</span>
                <span className="text-gray-500">({recipe.reviewCount} reviews)</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} />
                <span>{recipe.cookingTime} minutes</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={18} />
                <span>{recipe.servings} servings</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <ChefHat size={18} />
                <span>{recipe.calories} cal/serving</span>
              </div>
            </div>

            {/* Download buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload('txt')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Download size={16} />
                Download Recipe
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            {recipe.description}
          </p>

          {/* Dietary Tags */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Dietary Information</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="capitalize">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Equipment */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Equipment Needed</h3>
              <ul className="space-y-2">
                {recipe.equipment.map((equipment, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="capitalize">{equipment}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Instructions</h3>
            <ol className="space-y-3">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};