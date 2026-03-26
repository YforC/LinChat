import { defineEventHandler } from 'h3';
import fs from 'node:fs/promises';
import { getModelsConfigPaths } from '../utils/modelsConfig';
import { normalizeModelCatalog } from '../utils/modelCapabilities.js';

// Default models as fallback (same as in availableModels.js)
const DEFAULT_MODELS = [
  {
    category: "Gemini Models",
    logo: "/ai_logos/openai.svg",
    models: [
      {
        id: "gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        description: "High-capability Gemini model for general chat and file understanding.",
        reasoning: false,
        vision: true,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        description: "Fast Gemini model for low-latency chat and multimodal input.",
        reasoning: false,
        vision: true,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "gemini-3-flash-preview",
        name: "Gemini 3 Flash Preview",
        description: "Fast preview Gemini model with multimodal support.",
        reasoning: false,
        vision: true,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "gemini-3-pro-preview",
        name: "Gemini 3 Pro Preview",
        description: "High-end Gemini preview model for multimodal chat.",
        reasoning: false,
        vision: true,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "gemini-3.1-pro-preview",
        name: "Gemini 3.1 Pro Preview",
        description: "Latest Gemini preview model for advanced multimodal tasks.",
        reasoning: false,
        vision: true,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "gemini-imagen",
        name: "Gemini Imagen",
        description: "Gemini image generation model using OpenAI-compatible chat completions payloads.",
        reasoning: false,
        vision: true,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "gemini-veo",
        name: "Gemini Veo",
        description: "Gemini video generation model using OpenAI-compatible chat completions payloads.",
        reasoning: false,
        vision: true,
        extra_functions: [],
        extra_parameters: {}
      }
    ]
  }
];

export default defineEventHandler(async (event) => {
  try {
    const { configDir, configFile } = getModelsConfigPaths();
    // Check if config file exists
    try {
      await fs.access(configFile);
    } catch {
      // If not, ensure directory exists and create file with defaults
      await fs.mkdir(configDir, { recursive: true });
      const normalizedDefaults = normalizeModelCatalog(DEFAULT_MODELS);
      await fs.writeFile(configFile, JSON.stringify(normalizedDefaults, null, 2), 'utf-8');
      return normalizedDefaults;
    }

    // Read and parse config file
    const data = await fs.readFile(configFile, 'utf-8');
    try {
      return normalizeModelCatalog(JSON.parse(data));
    } catch (parseError) {
      console.error('Invalid models config JSON, resetting to defaults:', parseError);
      const normalizedDefaults = normalizeModelCatalog(DEFAULT_MODELS);
      await fs.writeFile(configFile, JSON.stringify(normalizedDefaults, null, 2), 'utf-8');
      return normalizedDefaults;
    }
  } catch (error) {
    console.error('Error reading models config:', error);
    // Return defaults on error
    return normalizeModelCatalog(DEFAULT_MODELS);
  }
});
