import React, { useState } from 'react';
import { Settings, Key, Globe, AlertCircle, Heart } from 'lucide-react';

interface APISettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const APISettings: React.FC<APISettingsProps> = ({ isOpen, onClose }) => {
  const [provider, setProvider] = useState(
    (localStorage.getItem('recipeApiProvider') as any) || 'themealdb'
  );
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('recipeApiKey') || ''
  );
  const [appId, setAppId] = useState(
    localStorage.getItem('edamamAppId') || ''
  );

  const handleSave = () => {
    localStorage.setItem('recipeApiProvider', provider);
    localStorage.setItem('recipeApiKey', apiKey);
    localStorage.setItem('edamamAppId', appId);
    
    // Reload the page to apply new settings
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="text-emerald-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-900">API Settings</h2>
        </div>

        <div className="space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe API Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="themealdb">TheMealDB (Free)</option>
              <option value="spoonacular">Spoonacular API</option>
              <option value="edamam">Edamam API</option>
              <option value="mock">Mock Data (Demo)</option>
            </select>
          </div>

          {/* TheMealDB Info */}
          {provider === 'themealdb' && (
            <div className="p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-2 text-emerald-700 mb-2">
                <Heart size={16} />
                <span className="font-medium">TheMealDB - Free Recipe API</span>
              </div>
              <p className="text-sm text-emerald-600 mb-3">
                A free, open recipe database with thousands of meals from around the world. 
                No API key required!
              </p>
              <div className="text-xs text-emerald-600">
                <p className="font-medium mb-1">Features:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Free to use with no rate limits</li>
                  <li>Search by ingredients</li>
                  <li>International cuisine database</li>
                  <li>Detailed instructions and ingredients</li>
                  <li>High-quality recipe images</li>
                </ul>
              </div>
            </div>
          )}

          {/* Spoonacular Settings */}
          {provider === 'spoonacular' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <Globe size={16} />
                <span className="font-medium">Spoonacular Configuration</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Spoonacular API key"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm text-blue-600">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Get your API key:</p>
                  <a 
                    href="https://spoonacular.com/food-api" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-800"
                  >
                    spoonacular.com/food-api
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Edamam Settings */}
          {provider === 'edamam' && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Globe size={16} />
                <span className="font-medium">Edamam Configuration</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application ID
                </label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="Enter your Edamam App ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Edamam App Key"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm text-green-600">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Get your API credentials:</p>
                  <a 
                    href="https://developer.edamam.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-green-800"
                  >
                    developer.edamam.com
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Mock Data Info */}
          {provider === 'mock' && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Globe size={16} />
                <span className="font-medium">Demo Mode</span>
              </div>
              <p className="text-sm text-gray-600">
                Using sample recipe data for demonstration. Switch to a real API provider for live recipe search.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
};