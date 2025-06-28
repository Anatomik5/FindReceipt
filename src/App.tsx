import React, { useState } from 'react';
import { ChefHat, Search, Settings } from 'lucide-react';
import { IngredientInput } from './components/IngredientInput';
import { EquipmentSelector } from './components/EquipmentSelector';
import { SearchFilters } from './components/SearchFilters';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetail } from './components/RecipeDetail';
import { APISettings } from './components/APISettings';
import { useRecipeSearch } from './hooks/useRecipeSearch';
import { Recipe, SearchFilters as SearchFiltersType } from './types/recipe';

function App() {
  const [userIngredients, setUserIngredients] = useState<string[]>([]);
  const [userEquipment, setUserEquipment] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFiltersType>({
    mealType: '',
    dietaryPreference: '',
    maxCookingTime: 120,
    minRating: 0
  });
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAPISettings, setShowAPISettings] = useState(false);

  const { recipes, isLoading, error } = useRecipeSearch(userIngredients, userEquipment, filters);

  const hasSearchCriteria = userIngredients.length > 0 || userEquipment.length > 0;
  const currentProvider = localStorage.getItem('recipeApiProvider') || 'mock';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <ChefHat className="text-emerald-600" size={32} />
                <h1 className="text-2xl font-bold text-gray-900">RecipeMatch</h1>
              </div>
              <span className="text-gray-500">Find recipes with what you have</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAPISettings(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <Settings size={18} />
                <span className="hidden sm:inline">API Settings</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Search size={20} className="text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">Search Recipes</h2>
              </div>
              
              <div className="space-y-6">
                <IngredientInput
                  selectedIngredients={userIngredients}
                  onIngredientsChange={setUserIngredients}
                />
                
                <EquipmentSelector
                  selectedEquipment={userEquipment}
                  onEquipmentChange={setUserEquipment}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="lg:block">
              <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3">
            {!hasSearchCriteria ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <ChefHat size={64} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Cook Something Amazing?
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Add your available ingredients and cooking equipment to discover delicious recipes 
                  you can make right now!
                </p>
                <div className="text-sm text-gray-500">
                  Try adding ingredients like "chicken", "broccoli", or "rice"
                </div>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Recipe Results
                    </h2>
                    <p className="text-gray-600">
                      {isLoading ? 'Searching...' : `Found ${recipes.length} recipes`}
                      {currentProvider !== 'mock' && (
                        <span className="ml-2 text-emerald-600 font-medium">
                          via {currentProvider}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Error State */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-red-700">
                      <Search size={20} />
                      <span className="font-medium">Search Error</span>
                    </div>
                    <p className="text-red-600 mt-1">{error}</p>
                    <p className="text-red-500 text-sm mt-2">
                      Falling back to demo data. Check your API settings.
                    </p>
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                        <div className="w-full h-48 bg-gray-200"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recipe Results */}
                {!isLoading && recipes.length > 0 && (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={() => setSelectedRecipe(recipe)}
                      />
                    ))}
                  </div>
                )}

                {/* No Results */}
                {!isLoading && recipes.length === 0 && !error && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Search size={64} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Recipes Found
                    </h3>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto">
                      We couldn't find any recipes matching your criteria. 
                      Try adjusting your ingredients, equipment, or filters.
                    </p>
                    <button
                      onClick={() => {
                        setFilters({
                          mealType: '',
                          dietaryPreference: '',
                          maxCookingTime: 120,
                          minRating: 0
                        });
                      }}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* API Settings Modal */}
      <APISettings
        isOpen={showAPISettings}
        onClose={() => setShowAPISettings(false)}
      />
    </div>
  );
}

export default App;