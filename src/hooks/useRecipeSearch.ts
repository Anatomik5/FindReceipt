import { useState, useEffect, useMemo } from 'react';
import { Recipe, SearchFilters } from '../types/recipe';
import { recipeAPI } from '../services/recipeAPI';

export const useRecipeSearch = (
  userIngredients: string[],
  userEquipment: string[],
  filters: SearchFilters
) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchRecipes = async () => {
      if (userIngredients.length === 0 && userEquipment.length === 0) {
        setRecipes([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await recipeAPI.searchRecipes(
          userIngredients,
          userEquipment,
          filters
        );
        setRecipes(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search recipes');
        setRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(searchRecipes, 300);
    return () => clearTimeout(timeoutId);
  }, [userIngredients, userEquipment, filters]);

  return { recipes, isLoading, error };
};