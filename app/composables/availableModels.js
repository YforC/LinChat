import { ref } from 'vue';
import localforage from 'localforage';


export let DEFAULT_MODEL_ID = "";
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

// Initialize as empty
availableModels.value = [];

/**
 * Updates available models and DEFAULT_MODEL_ID from data.
 * @param {Array} data 
 */
function updateModelsFromData(data) {
  if (data && Array.isArray(data) && data.length > 0) {
    availableModels.value = data;

    // Set DEFAULT_MODEL_ID to the first available model if it's not already set
    if (!DEFAULT_MODEL_ID) {
      for (const item of data) {
        if (item.models && item.models.length > 0) {
          DEFAULT_MODEL_ID = item.models[0].id;
          break;
        }
        if (item.id) {
          DEFAULT_MODEL_ID = item.id;
          break;
        }
      }
    }
    console.log('Models loaded, DEFAULT_MODEL_ID set to:', DEFAULT_MODEL_ID);
    return true;
  }
  return false;
}

/**
 * Loads models from local storage (client only).
 * @returns {Promise<boolean>} Whether local models were applied.
 */
export async function loadModelsFromLocal() {
  if (!import.meta.client) return false;
  try {
    const storedModels = await localforage.getItem(MODELS_STORAGE_KEY);
    return updateModelsFromData(storedModels);
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
      if (updateModelsFromData(data)) {
        await saveModelsToLocal(data);
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
