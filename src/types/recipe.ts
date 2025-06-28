export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  cookingTime: number;
  servings: number;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  dietaryTags: string[];
  ingredients: string[];
  equipment: string[];
  instructions: string[];
  matchPercentage: number;
}

export interface SearchFilters {
  mealType: string;
  dietaryPreference: string;
  maxCookingTime: number;
  minRating: number;
}

export interface UserInputs {
  ingredients: string[];
  equipment: string[];
}