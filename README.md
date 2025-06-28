# Recipe Finder Application

A beautiful, production-ready recipe finder that helps users discover recipes based on their available ingredients and cooking equipment.

## Features

- 🔍 **Smart Recipe Search** - Find recipes using ingredients you have
- 🍳 **Equipment Matching** - Filter by available cooking equipment
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎯 **Advanced Filters** - Filter by meal type, dietary preferences, cooking time, and ratings
- 📊 **Match Percentage** - See how well recipes match your available ingredients
- 📄 **Recipe Downloads** - Download recipes as text files
- 🔧 **Multiple API Support** - Supports TheMealDB, Spoonacular, Edamam, and mock data

## API Integration

### Supported Recipe APIs

1. **TheMealDB** (Recommended - FREE!)
   - Completely free with no API key required
   - Thousands of recipes from around the world
   - High-quality images and detailed instructions
   - Search by ingredients and categories
   - No rate limits or usage restrictions
   - Website: [themealdb.com](https://www.themealdb.com/api.php)

2. **Spoonacular API**
   - Comprehensive recipe database
   - Detailed nutritional information
   - Equipment and ingredient matching
   - Get API key: [spoonacular.com/food-api](https://spoonacular.com/food-api)

3. **Edamam Recipe API**
   - Large recipe database
   - Health and diet labels
   - Nutritional analysis
   - Get API key: [developer.edamam.com](https://developer.edamam.com/)

4. **Mock Data**
   - Demo mode with sample recipes
   - No API key required
   - Perfect for testing and development

### Quick Start with TheMealDB (FREE)

The easiest way to get started is with TheMealDB - it's completely free and requires no setup:

1. **No API key needed!** - TheMealDB is free to use
2. **Click "API Settings"** in the header
3. **Select "TheMealDB (Free)"** as your provider
4. **Click "Save & Apply"**
5. **Start searching immediately!**

### Setup Instructions for Other APIs

1. **Choose Your API Provider**
   - Click the "API Settings" button in the header
   - Select your preferred provider
   - Enter your API credentials (if required)

2. **Spoonacular Setup**
   ```bash
   # Get your API key from https://spoonacular.com/food-api
   # Add to .env file:
   VITE_RECIPE_API_PROVIDER=spoonacular
   VITE_RECIPE_API_KEY=your_spoonacular_api_key
   ```

3. **Edamam Setup**
   ```bash
   # Get your credentials from https://developer.edamam.com/
   # Add to .env file:
   VITE_RECIPE_API_PROVIDER=edamam
   VITE_EDAMAM_APP_ID=your_app_id
   VITE_EDAMAM_APP_KEY=your_app_key
   ```

### API Features Comparison

| Feature | TheMealDB | Spoonacular | Edamam | Mock Data |
|---------|-----------|-------------|---------|-----------|
| **Cost** | ✅ FREE | 💰 Paid | 💰 Paid | ✅ FREE |
| **API Key Required** | ❌ No | ✅ Yes | ✅ Yes | ❌ No |
| **Recipe Search** | ✅ | ✅ | ✅ | ✅ |
| **Ingredient Matching** | ✅ | ✅ | ✅ | ✅ |
| **International Cuisine** | ✅ | ✅ | ✅ | ✅ |
| **Detailed Instructions** | ✅ | ✅ | ❌* | ✅ |
| **High-Quality Images** | ✅ | ✅ | ✅ | ✅ |
| **Nutritional Info** | ❌ | ✅ | ✅ | ✅ |
| **Equipment Filtering** | ❌ | ✅ | ❌ | ✅ |
| **Recipe Ratings** | ❌ | ✅ | ❌ | ✅ |
| **Rate Limits** | ❌ None | 150 calls/day | 5 calls/min | ❌ None |

*Edamam provides source URLs for full instructions

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd recipe-finder

# Install dependencies
npm install

# Start with TheMealDB (no setup required!)
npm run dev
```

### Environment Variables (Optional)
```bash
# Default: Uses TheMealDB (free, no API key needed)
VITE_RECIPE_API_PROVIDER=themealdb

# For Spoonacular
VITE_RECIPE_API_PROVIDER=spoonacular
VITE_RECIPE_API_KEY=your_spoonacular_api_key

# For Edamam
VITE_RECIPE_API_PROVIDER=edamam
VITE_EDAMAM_APP_ID=your_edamam_app_id
VITE_EDAMAM_APP_KEY=your_edamam_app_key
```

### Building for Production
```bash
npm run build
```

## Architecture

### Key Components
- **RecipeAPIService** - Handles all API integrations including TheMealDB
- **useRecipeSearch** - Custom hook for recipe searching with debouncing
- **APISettings** - UI for configuring API providers
- **Recipe Components** - Modular UI components for displaying recipes

### API Service Architecture
The application uses a service layer pattern that abstracts different recipe APIs:

```typescript
// Switch between providers seamlessly
const recipeAPI = new RecipeAPIService({
  provider: 'themealdb', // or 'spoonacular', 'edamam', 'mock'
  apiKey: 'your-api-key' // not needed for TheMealDB
});

// Unified interface for all providers
const recipes = await recipeAPI.searchRecipes(ingredients, equipment, filters);
```

### TheMealDB Integration Features
- **Ingredient-based search** - Find recipes by main ingredients
- **Category filtering** - Browse by meal types and cuisines
- **Random recipe discovery** - Get inspiration with random recipes
- **Detailed recipe information** - Full ingredients, instructions, and images
- **International cuisine** - Recipes from around the world
- **Smart matching** - Calculate ingredient match percentages

### Error Handling
- Graceful fallback to mock data if API fails
- User-friendly error messages
- Automatic retry logic for transient failures

## Why TheMealDB?

TheMealDB is the perfect choice for this recipe finder because:

- **🆓 Completely Free** - No API keys, no rate limits, no costs
- **🌍 Global Recipes** - Thousands of recipes from different cuisines
- **📸 High-Quality Images** - Beautiful food photography for every recipe
- **📝 Detailed Instructions** - Step-by-step cooking instructions
- **🔍 Flexible Search** - Search by ingredients, categories, or get random recipes
- **⚡ Fast & Reliable** - Well-maintained API with good uptime
- **🚀 Easy Integration** - Simple REST API that's easy to work with

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details