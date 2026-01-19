import { ref } from 'vue';
import localforage from 'localforage';

/**
 * Available models from Hack Club
 */
export const DEFAULT_MODEL_ID = "gemini-3-pro-preview";
const MODELS_STORAGE_KEY = 'models_config';

/**
 * Finds a model by its ID in the available models list, including nested categories.
 * @param {Array} models - The list of models to search.
 * @param {string} id - The ID of the model to find.
 * @returns {Object|null} The found model object or null.
 */
export function findModelById(models, id) {
  // Support refs or plain arrays
  const modelsList = Array.isArray(models) ? models : models?.value;
  if (!Array.isArray(modelsList)) return null;

  for (const item of modelsList) {
    if (item.id === id) {
      return item;
    }
    if (item.models && Array.isArray(item.models)) {
      const found = findModelById(item.models, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

// Reactive reference for available models
export const availableModels = ref([]);

// Default models as fallback (should match config.json)
const defaultModels = [
  {
    category: "My Custom Models",
    logo: "/ai_logos/gemini.svg",
    models: [
      {
        id: "gemini-3-pro-preview",
        name: "Gemini 3 Pro Preview",
        description: "Google's next-gen, SOTA multimodal model.",
        reasoning: false,
        vision: true,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "gemini-3-flash-preview",
        name: "Gemini 3 Flash Preview",
        description: "Fast, frontier-level model.",
        reasoning: false,
        vision: true,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "qwen3-coder-plus",
        name: "Qwen 3 Coder Plus",
        description: "Specialized coding model by Qwen.",
        reasoning: false,
        vision: false,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "qwen3-coder-flash",
        name: "Qwen 3 Coder Flash",
        description: "Fast coding model by Qwen.",
        reasoning: false,
        vision: false,
        extra_functions: [],
        extra_parameters: {}
      }
    ]
  }
];

// Initialize with defaults immediately
availableModels.value = defaultModels;

/**
 * Loads models from local storage (client only).
 * @returns {Promise<boolean>} Whether local models were applied.
 */
export async function loadModelsFromLocal() {
  if (!import.meta.client) return false;
  try {
    const storedModels = await localforage.getItem(MODELS_STORAGE_KEY);
    if (Array.isArray(storedModels) && storedModels.length > 0) {
      availableModels.value = storedModels;
      return true;
    }
  } catch (error) {
    console.error('Failed to load local models config:', error);
  }
  return false;
}

/**
 * Persists models to local storage (client only).
 * @param {Array} models
 */
export async function saveModelsToLocal(models) {
  if (!import.meta.client) return;
  try {
    await localforage.setItem(
      MODELS_STORAGE_KEY,
      JSON.parse(JSON.stringify(models))
    );
  } catch (error) {
    console.error('Failed to save local models config:', error);
  }
}

/**
 * Fetches models from the backend API.
 */
export async function fetchModels() {
  if (import.meta.server) return; // Don't fetch on server-side rendering if SSR were enabled

  console.log('fetchModels called');
  try {
    const response = await fetch('/api/models');
    console.log('fetchModels response:', response.ok);
    if (response.ok) {
      const data = await response.json();
      console.log('fetchModels data:', data);
      if (data && Array.isArray(data) && data.length > 0) {
        availableModels.value = data;
        await saveModelsToLocal(data);
        console.log('Models loaded from config:', data);
      }
    }
  } catch (error) {
    console.error('Failed to fetch models config:', error);
    // Fallback to defaults (already set)
  }
}

// Auto-fetch on client side import
if (import.meta.client) {
  (async () => {
    await loadModelsFromLocal();
    await fetchModels();
  })();
}

export default availableModels;
