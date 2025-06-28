import { Recipe } from '../types/recipe';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Garlic Herb Roasted Chicken',
    description: 'Juicy roasted chicken with aromatic herbs and garlic, perfect for a family dinner.',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    reviewCount: 342,
    cookingTime: 75,
    servings: 4,
    calories: 285,
    difficulty: 'Medium',
    mealType: 'Dinner',
    dietaryTags: ['Gluten-Free', 'High-Protein'],
    ingredients: ['chicken', 'garlic', 'rosemary', 'thyme', 'olive oil', 'lemon'],
    equipment: ['oven', 'roasting pan'],
    instructions: [
      'Preheat oven to 425°F (220°C)',
      'Mix herbs, garlic, and olive oil',
      'Rub mixture under and over chicken skin',
      'Roast for 60-75 minutes until internal temp reaches 165°F',
      'Let rest 10 minutes before carving'
    ],
    matchPercentage: 95
  },
  {
    id: '2',
    title: 'Cheesy Broccoli Rice Bowl',
    description: 'Comforting rice bowl with steamed broccoli and melted cheese.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.5,
    reviewCount: 128,
    cookingTime: 25,
    servings: 2,
    calories: 320,
    difficulty: 'Easy',
    mealType: 'Lunch',
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    ingredients: ['rice', 'broccoli', 'cheese', 'butter', 'garlic'],
    equipment: ['stovetop', 'pan', 'pot'],
    instructions: [
      'Cook rice according to package instructions',
      'Steam broccoli until tender',
      'Sauté garlic in butter',
      'Mix rice, broccoli, and cheese',
      'Serve hot with garlic butter'
    ],
    matchPercentage: 87
  },
  {
    id: '3',
    title: 'Mediterranean Grilled Salmon',
    description: 'Fresh salmon fillet grilled to perfection with Mediterranean herbs.',
    image: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    reviewCount: 256,
    cookingTime: 20,
    servings: 2,
    calories: 245,
    difficulty: 'Medium',
    mealType: 'Dinner',
    dietaryTags: ['Keto', 'Low-Carb', 'High-Protein'],
    ingredients: ['salmon', 'olive oil', 'lemon', 'oregano', 'garlic'],
    equipment: ['grill', 'tongs'],
    instructions: [
      'Preheat grill to medium-high heat',
      'Brush salmon with olive oil and seasonings',
      'Grill 4-6 minutes per side',
      'Check internal temperature reaches 145°F',
      'Serve with lemon wedges'
    ],
    matchPercentage: 78
  },
  {
    id: '4',
    title: 'Quick Vegetable Stir Fry',
    description: 'Colorful mix of fresh vegetables stir-fried with savory sauce.',
    image: 'https://images.pexels.com/photos/2233348/pexels-photo-2233348.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    reviewCount: 89,
    cookingTime: 15,
    servings: 3,
    calories: 180,
    difficulty: 'Easy',
    mealType: 'Lunch',
    dietaryTags: ['Vegan', 'Low-Calorie', 'Gluten-Free'],
    ingredients: ['broccoli', 'carrots', 'bell peppers', 'soy sauce', 'garlic', 'ginger'],
    equipment: ['stovetop', 'wok', 'pan'],
    instructions: [
      'Heat oil in wok or large pan',
      'Add garlic and ginger, stir for 30 seconds',
      'Add harder vegetables first (carrots, broccoli)',
      'Stir-fry for 3-4 minutes',
      'Add softer vegetables and sauce, cook 2 minutes more'
    ],
    matchPercentage: 92
  },
  {
    id: '5',
    title: 'Classic Pancakes',
    description: 'Fluffy, golden pancakes perfect for weekend breakfast.',
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    reviewCount: 445,
    cookingTime: 20,
    servings: 4,
    calories: 195,
    difficulty: 'Easy',
    mealType: 'Breakfast',
    dietaryTags: ['Vegetarian'],
    ingredients: ['flour', 'milk', 'eggs', 'butter', 'sugar', 'baking powder'],
    equipment: ['stovetop', 'pan', 'whisk'],
    instructions: [
      'Mix dry ingredients in large bowl',
      'Whisk wet ingredients separately',
      'Combine wet and dry ingredients until just mixed',
      'Cook on medium heat until bubbles form',
      'Flip and cook until golden brown'
    ],
    matchPercentage: 65
  },
  {
    id: '6',
    title: 'Creamy Mushroom Risotto',
    description: 'Rich and creamy risotto with sautéed mushrooms and parmesan.',
    image: 'https://images.pexels.com/photos/8697800/pexels-photo-8697800.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.4,
    reviewCount: 167,
    cookingTime: 45,
    servings: 4,
    calories: 380,
    difficulty: 'Hard',
    mealType: 'Dinner',
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    ingredients: ['arborio rice', 'mushrooms', 'parmesan', 'butter', 'white wine', 'onion'],
    equipment: ['stovetop', 'pan', 'ladle'],
    instructions: [
      'Sauté mushrooms and set aside',
      'Cook onion until translucent',
      'Add rice, stir to coat with oil',
      'Add wine, stir until absorbed',
      'Add warm broth one ladle at a time, stirring constantly',
      'Finish with butter, cheese, and mushrooms'
    ],
    matchPercentage: 71
  }
];

export const availableIngredients = [
  'chicken', 'salmon', 'beef', 'pork', 'eggs', 'milk', 'cheese', 'butter',
  'rice', 'pasta', 'flour', 'bread', 'potatoes',
  'broccoli', 'carrots', 'bell peppers', 'mushrooms', 'onions', 'garlic', 'ginger',
  'tomatoes', 'spinach', 'lettuce', 'cucumbers',
  'olive oil', 'soy sauce', 'salt', 'pepper', 'herbs', 'spices',
  'lemon', 'lime', 'apples', 'bananas'
];

export const availableEquipment = [
  'oven', 'stovetop', 'microwave', 'grill', 'air fryer',
  'pan', 'pot', 'wok', 'baking sheet', 'roasting pan',
  'blender', 'food processor', 'mixer', 'whisk', 'tongs', 'ladle'
];