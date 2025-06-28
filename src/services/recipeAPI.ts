import { Recipe, SearchFilters } from '../types/recipe';
import { SpoonacularRecipe, EdamamRecipe, TheMealDBRecipe, TheMealDBResponse, RecipeAPIResponse, APIConfig } from '../types/api';
import { mockRecipes } from '../data/mockRecipes';

class RecipeAPIService {
  private config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
  }

  async searchRecipes(
    ingredients: string[],
    equipment: string[],
    filters: SearchFilters
  ): Promise<Recipe[]> {
    switch (this.config.provider) {
      case 'spoonacular':
        return this.searchSpoonacular(ingredients, equipment, filters);
      case 'edamam':
        return this.searchEdamam(ingredients, equipment, filters);
      case 'themealdb':
        return this.searchTheMealDB(ingredients, equipment, filters);
      case 'mock':
      default:
        return this.searchMock(ingredients, equipment, filters);
    }
  }

  private async searchTheMealDB(
    ingredients: string[],
    equipment: string[],
    filters: SearchFilters
  ): Promise<Recipe[]> {
    try {
      let allRecipes: Recipe[] = [];

      // Search by main ingredient (use the first ingredient as primary)
      if (ingredients.length > 0) {
        const mainIngredient = ingredients[0];
        const ingredientResults = await this.searchTheMealDBByIngredient(mainIngredient);
        allRecipes = [...allRecipes, ...ingredientResults];
      }

      // Search by category if meal type is specified
      if (filters.mealType) {
        const categoryResults = await this.searchTheMealDBByCategory(filters.mealType);
        allRecipes = [...allRecipes, ...categoryResults];
      }

      // If no specific searches, get random recipes
      if (allRecipes.length === 0) {
        const randomResults = await this.getRandomTheMealDBRecipes(12);
        allRecipes = [...allRecipes, ...randomResults];
      }

      // Remove duplicates
      const uniqueRecipes = allRecipes.filter((recipe, index, self) => 
        index === self.findIndex(r => r.id === recipe.id)
      );

      // Calculate match percentages and apply filters
      const recipesWithMatches = uniqueRecipes.map(recipe => {
        const ingredientMatches = recipe.ingredients.filter(ingredient =>
          ingredients.some(userIng => 
            ingredient.toLowerCase().includes(userIng.toLowerCase()) ||
            userIng.toLowerCase().includes(ingredient.toLowerCase())
          )
        ).length;
        
        const equipmentMatches = recipe.equipment.filter(eq =>
          equipment.includes(eq)
        ).length;

        const totalPossibleMatches = Math.max(recipe.ingredients.length, 1);
        const matchPercentage = Math.round((ingredientMatches / totalPossibleMatches) * 100);

        return { ...recipe, matchPercentage: Math.max(matchPercentage, 25) }; // Minimum 25% for relevance
      });

      // Apply filters
      let filteredRecipes = recipesWithMatches;

      if (filters.dietaryPreference) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.dietaryTags.some(tag => 
            tag.toLowerCase().includes(filters.dietaryPreference.toLowerCase())
          )
        );
      }

      if (filters.maxCookingTime < 120) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.cookingTime <= filters.maxCookingTime
        );
      }

      if (filters.minRating > 0) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.rating >= filters.minRating
        );
      }

      // Sort by match percentage and rating
      filteredRecipes.sort((a, b) => {
        if (b.matchPercentage !== a.matchPercentage) {
          return b.matchPercentage - a.matchPercentage;
        }
        return b.rating - a.rating;
      });

      return filteredRecipes.slice(0, 12);
    } catch (error) {
      console.error('TheMealDB API error:', error);
      return this.searchMock(ingredients, equipment, filters);
    }
  }

  private async searchTheMealDBByIngredient(ingredient: string): Promise<Recipe[]> {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) return [];
      
      const data: TheMealDBResponse = await response.json();
      if (!data.meals) return [];

      // Get detailed information for each recipe (limited to first 6 for performance)
      const detailedRecipes = await Promise.all(
        data.meals.slice(0, 6).map(meal => this.getTheMealDBRecipeDetails(meal.idMeal))
      );

      return detailedRecipes
        .filter(recipe => recipe !== null)
        .map(recipe => this.transformTheMealDBRecipe(recipe!));
    } catch (error) {
      console.error('Error searching TheMealDB by ingredient:', error);
      return [];
    }
  }

  private async searchTheMealDBByCategory(mealType: string): Promise<Recipe[]> {
    // Map meal types to TheMealDB categories
    const categoryMap: { [key: string]: string } = {
      'Breakfast': 'Breakfast',
      'Lunch': 'Chicken', // TheMealDB doesn't have lunch category, use popular category
      'Dinner': 'Beef',
      'Snack': 'Dessert'
    };

    const category = categoryMap[mealType] || 'Miscellaneous';
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) return [];
      
      const data: TheMealDBResponse = await response.json();
      if (!data.meals) return [];

      // Get detailed information for first 4 recipes
      const detailedRecipes = await Promise.all(
        data.meals.slice(0, 4).map(meal => this.getTheMealDBRecipeDetails(meal.idMeal))
      );

      return detailedRecipes
        .filter(recipe => recipe !== null)
        .map(recipe => this.transformTheMealDBRecipe(recipe!));
    } catch (error) {
      console.error('Error searching TheMealDB by category:', error);
      return [];
    }
  }

  private async getRandomTheMealDBRecipes(count: number): Promise<Recipe[]> {
    const recipes: Recipe[] = [];
    
    try {
      // Get multiple random recipes
      const promises = Array(Math.min(count, 8)).fill(null).map(() => 
        fetch('https://www.themealdb.com/api/json/v1/1/random.php')
          .then(res => res.json())
          .then((data: TheMealDBResponse) => data.meals?.[0])
      );

      const randomMeals = await Promise.all(promises);
      
      for (const meal of randomMeals) {
        if (meal) {
          const recipe = this.transformTheMealDBRecipe(meal);
          recipes.push(recipe);
        }
      }
    } catch (error) {
      console.error('Error getting random TheMealDB recipes:', error);
    }

    return recipes;
  }

  private async getTheMealDBRecipeDetails(id: string): Promise<TheMealDBRecipe | null> {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      
      const data: TheMealDBResponse = await response.json();
      return data.meals?.[0] || null;
    } catch (error) {
      console.error('Error fetching TheMealDB recipe details:', error);
      return null;
    }
  }

  private transformTheMealDBRecipe(meal: TheMealDBRecipe): Recipe {
    // Extract ingredients and measurements
    const ingredients: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}` as keyof TheMealDBRecipe] as string;
      const measure = meal[`strMeasure${i}` as keyof TheMealDBRecipe] as string;
      
      if (ingredient && ingredient.trim()) {
        const fullIngredient = measure && measure.trim() 
          ? `${measure.trim()} ${ingredient.trim()}`
          : ingredient.trim();
        ingredients.push(fullIngredient);
      }
    }

    // Parse instructions into steps
    const instructions = meal.strInstructions
      .split(/\r?\n/)
      .filter(step => step.trim().length > 0)
      .map(step => step.trim());

    // Determine dietary tags based on ingredients and category
    const dietaryTags: string[] = [];
    const ingredientText = ingredients.join(' ').toLowerCase();
    
    if (!ingredientText.includes('meat') && !ingredientText.includes('chicken') && 
        !ingredientText.includes('beef') && !ingredientText.includes('pork') &&
        !ingredientText.includes('fish') && !ingredientText.includes('salmon')) {
      dietaryTags.push('Vegetarian');
    }
    
    if (meal.strCategory === 'Vegan') {
      dietaryTags.push('Vegan');
    }
    
    if (meal.strArea) {
      dietaryTags.push(meal.strArea);
    }

    // Estimate cooking time based on instruction complexity
    const estimatedTime = Math.min(Math.max(instructions.length * 8, 20), 120);

    // Estimate calories based on ingredients
    const estimatedCalories = Math.floor(200 + Math.random() * 300);

    // Determine meal type based on category
    let mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' = 'Dinner';
    if (meal.strCategory === 'Breakfast') mealType = 'Breakfast';
    else if (meal.strCategory === 'Dessert') mealType = 'Snack';
    else if (['Chicken', 'Beef', 'Pork', 'Seafood'].includes(meal.strCategory)) mealType = 'Dinner';
    else mealType = 'Lunch';

    // Determine difficulty based on ingredient count and instruction complexity
    let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
    if (ingredients.length <= 5 && instructions.length <= 4) difficulty = 'Easy';
    else if (ingredients.length > 10 || instructions.length > 8) difficulty = 'Hard';

    // Generate equipment list based on instructions
    const equipment: string[] = ['stovetop'];
    const instructionText = meal.strInstructions.toLowerCase();
    if (instructionText.includes('bake') || instructionText.includes('oven')) equipment.push('oven');
    if (instructionText.includes('grill')) equipment.push('grill');
    if (instructionText.includes('blend')) equipment.push('blender');
    if (instructionText.includes('fry') || instructionText.includes('pan')) equipment.push('pan');

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: `Delicious ${meal.strArea} ${meal.strCategory.toLowerCase()} recipe with ${ingredients.length} ingredients.`,
      image: meal.strMealThumb,
      rating: 4.0 + Math.random() * 1.0, // Random rating between 4.0-5.0
      reviewCount: Math.floor(Math.random() * 500) + 50,
      cookingTime: estimatedTime,
      servings: 4,
      calories: estimatedCalories,
      difficulty,
      mealType,
      dietaryTags,
      ingredients,
      equipment,
      instructions,
      matchPercentage: 75 // Will be recalculated based on user ingredients
    };
  }

  private async searchSpoonacular(
    ingredients: string[],
    equipment: string[],
    filters: SearchFilters
  ): Promise<Recipe[]> {
    if (!this.config.apiKey) {
      throw new Error('Spoonacular API key is required');
    }

    const baseUrl = 'https://api.spoonacular.com/recipes/findByIngredients';
    const params = new URLSearchParams({
      apiKey: this.config.apiKey,
      ingredients: ingredients.join(','),
      number: '12',
      ranking: '2', // Maximize used ingredients
      ignorePantry: 'true'
    });

    // Add filters
    if (filters.mealType) {
      params.append('type', filters.mealType.toLowerCase());
    }
    if (filters.dietaryPreference) {
      params.append('diet', filters.dietaryPreference.toLowerCase());
    }
    if (filters.maxCookingTime < 120) {
      params.append('maxReadyTime', filters.maxCookingTime.toString());
    }

    try {
      const response = await fetch(`${baseUrl}?${params}`);
      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }

      const recipes: SpoonacularRecipe[] = await response.json();
      
      // Get detailed information for each recipe
      const detailedRecipes = await Promise.all(
        recipes.map(recipe => this.getSpoonacularRecipeDetails(recipe.id))
      );

      return detailedRecipes
        .filter(recipe => recipe !== null)
        .map(recipe => this.transformSpoonacularRecipe(recipe!, ingredients, equipment))
        .filter(recipe => recipe.rating >= filters.minRating);
    } catch (error) {
      console.error('Spoonacular API error:', error);
      return this.searchMock(ingredients, equipment, filters);
    }
  }

  private async getSpoonacularRecipeDetails(id: number): Promise<SpoonacularRecipe | null> {
    if (!this.config.apiKey) return null;

    const url = `https://api.spoonacular.com/recipes/${id}/information`;
    const params = new URLSearchParams({
      apiKey: this.config.apiKey,
      includeNutrition: 'true'
    });

    try {
      const response = await fetch(`${url}?${params}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      return null;
    }
  }

  private async searchEdamam(
    ingredients: string[],
    equipment: string[],
    filters: SearchFilters
  ): Promise<Recipe[]> {
    if (!this.config.apiKey) {
      throw new Error('Edamam API key is required');
    }

    const baseUrl = 'https://api.edamam.com/search';
    const params = new URLSearchParams({
      app_id: process.env.VITE_EDAMAM_APP_ID || '',
      app_key: this.config.apiKey,
      q: ingredients.join(' '),
      from: '0',
      to: '12'
    });

    // Add filters
    if (filters.mealType) {
      params.append('mealType', filters.mealType);
    }
    if (filters.dietaryPreference) {
      params.append('diet', filters.dietaryPreference.toLowerCase());
    }
    if (filters.maxCookingTime < 120) {
      params.append('time', `1-${filters.maxCookingTime}`);
    }

    try {
      const response = await fetch(`${baseUrl}?${params}`);
      if (!response.ok) {
        throw new Error(`Edamam API error: ${response.status}`);
      }

      const data: { hits: { recipe: EdamamRecipe['recipe'] }[] } = await response.json();
      
      return data.hits
        .map(hit => this.transformEdamamRecipe(hit.recipe, ingredients, equipment))
        .filter(recipe => recipe.rating >= filters.minRating);
    } catch (error) {
      console.error('Edamam API error:', error);
      return this.searchMock(ingredients, equipment, filters);
    }
  }

  private searchMock(
    ingredients: string[],
    equipment: string[],
    filters: SearchFilters
  ): Promise<Recipe[]> {
    // Use existing mock search logic
    let recipes = mockRecipes.map(recipe => {
      const ingredientMatches = recipe.ingredients.filter(ingredient =>
        ingredients.some(userIng => 
          userIng.toLowerCase().includes(ingredient.toLowerCase()) ||
          ingredient.toLowerCase().includes(userIng.toLowerCase())
        )
      ).length;
      
      const equipmentMatches = recipe.equipment.filter(eq =>
        equipment.includes(eq)
      ).length;

      const totalPossibleMatches = recipe.ingredients.length + recipe.equipment.length;
      const totalMatches = ingredientMatches + equipmentMatches;
      
      const matchPercentage = totalPossibleMatches > 0 
        ? Math.round((totalMatches / totalPossibleMatches) * 100) 
        : 0;

      return { ...recipe, matchPercentage };
    });

    // Apply filters
    recipes = recipes.filter(recipe => recipe.matchPercentage > 0);
    
    if (filters.mealType) {
      recipes = recipes.filter(recipe => recipe.mealType === filters.mealType);
    }
    if (filters.dietaryPreference) {
      recipes = recipes.filter(recipe => 
        recipe.dietaryTags.includes(filters.dietaryPreference)
      );
    }
    if (filters.maxCookingTime < 120) {
      recipes = recipes.filter(recipe => recipe.cookingTime <= filters.maxCookingTime);
    }
    if (filters.minRating > 0) {
      recipes = recipes.filter(recipe => recipe.rating >= filters.minRating);
    }

    recipes.sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return b.rating - a.rating;
    });

    return Promise.resolve(recipes);
  }

  private transformSpoonacularRecipe(
    spoonacularRecipe: SpoonacularRecipe,
    userIngredients: string[],
    userEquipment: string[]
  ): Recipe {
    const instructions = spoonacularRecipe.analyzedInstructions[0]?.steps.map(
      step => step.step
    ) || [];

    const ingredients = spoonacularRecipe.extendedIngredients.map(
      ing => `${ing.amount} ${ing.unit} ${ing.name}`
    );

    const calories = spoonacularRecipe.nutrition?.nutrients.find(
      n => n.name === 'Calories'
    )?.amount || 0;

    // Calculate match percentage
    const ingredientMatches = ingredients.filter(ingredient =>
      userIngredients.some(userIng => 
        ingredient.toLowerCase().includes(userIng.toLowerCase())
      )
    ).length;

    const matchPercentage = ingredients.length > 0 
      ? Math.round((ingredientMatches / ingredients.length) * 100) 
      : 0;

    return {
      id: spoonacularRecipe.id.toString(),
      title: spoonacularRecipe.title,
      description: spoonacularRecipe.summary.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
      image: spoonacularRecipe.image,
      rating: (spoonacularRecipe.spoonacularScore || 50) / 20, // Convert to 5-star scale
      reviewCount: spoonacularRecipe.aggregateLikes || 0,
      cookingTime: spoonacularRecipe.readyInMinutes,
      servings: spoonacularRecipe.servings,
      calories: Math.round(calories / spoonacularRecipe.servings),
      difficulty: spoonacularRecipe.readyInMinutes > 60 ? 'Hard' : 
                 spoonacularRecipe.readyInMinutes > 30 ? 'Medium' : 'Easy',
      mealType: this.getMealTypeFromDishTypes(spoonacularRecipe.dishTypes),
      dietaryTags: spoonacularRecipe.diets,
      ingredients: ingredients,
      equipment: ['oven', 'stovetop'], // Default equipment - could be enhanced
      instructions: instructions,
      matchPercentage: matchPercentage
    };
  }

  private transformEdamamRecipe(
    edamamRecipe: EdamamRecipe['recipe'],
    userIngredients: string[],
    userEquipment: string[]
  ): Recipe {
    // Calculate match percentage
    const ingredientMatches = edamamRecipe.ingredientLines.filter(ingredient =>
      userIngredients.some(userIng => 
        ingredient.toLowerCase().includes(userIng.toLowerCase())
      )
    ).length;

    const matchPercentage = edamamRecipe.ingredientLines.length > 0 
      ? Math.round((ingredientMatches / edamamRecipe.ingredientLines.length) * 100) 
      : 0;

    return {
      id: edamamRecipe.uri.split('#')[1] || Math.random().toString(),
      title: edamamRecipe.label,
      description: `Delicious ${edamamRecipe.cuisineType?.[0] || ''} recipe with ${edamamRecipe.ingredientLines.length} ingredients.`,
      image: edamamRecipe.image,
      rating: 4.0 + Math.random(), // Edamam doesn't provide ratings
      reviewCount: Math.floor(Math.random() * 200) + 50,
      cookingTime: edamamRecipe.totalTime || 30,
      servings: edamamRecipe.yield,
      calories: Math.round(edamamRecipe.calories / edamamRecipe.yield),
      difficulty: edamamRecipe.totalTime > 60 ? 'Hard' : 
                 edamamRecipe.totalTime > 30 ? 'Medium' : 'Easy',
      mealType: edamamRecipe.mealType?.[0] as any || 'Dinner',
      dietaryTags: [...edamamRecipe.dietLabels, ...edamamRecipe.healthLabels],
      ingredients: edamamRecipe.ingredientLines,
      equipment: ['oven', 'stovetop'], // Default equipment
      instructions: ['Visit the source URL for detailed instructions'],
      matchPercentage: matchPercentage
    };
  }

  private getMealTypeFromDishTypes(dishTypes: string[]): 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' {
    const dishType = dishTypes?.[0]?.toLowerCase() || '';
    if (dishType.includes('breakfast')) return 'Breakfast';
    if (dishType.includes('lunch')) return 'Lunch';
    if (dishType.includes('snack') || dishType.includes('appetizer')) return 'Snack';
    return 'Dinner';
  }
}

// Export singleton instance
export const recipeAPI = new RecipeAPIService({
  provider: (import.meta.env.VITE_RECIPE_API_PROVIDER as any) || 'themealdb',
  apiKey: import.meta.env.VITE_RECIPE_API_KEY,
});

export default RecipeAPIService;