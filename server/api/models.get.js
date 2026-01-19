import { defineEventHandler } from 'h3';
import fs from 'node:fs/promises';
import { getModelsConfigPaths } from '../utils/modelsConfig';

// Default models as fallback (same as in availableModels.js)
const DEFAULT_MODELS = [
  {
    category: "My Custom Models",
    logo: "/ai_logos/openai.svg",
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
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        description: "Low-latency, highly efficient model.",
        reasoning: false,
        vision: true,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "gemini-2.5-flash-lite",
        name: "Gemini 2.5 Flash Lite",
        description: "Lightweight variant for speed.",
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
  },
  {
    category: "Standard / Custom",
    logo: "/ai_logos/openai.svg",
    models: [
      {
        id: "gpt-4o",
        name: "GPT-4o",
        description: "OpenAI's high-intelligence flagship model",
        reasoning: false,
        vision: true,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5 Turbo",
        description: "Fast, inexpensive model for simple tasks",
        reasoning: false,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "claude-3-5-sonnet-20240620",
        name: "Claude 3.5 Sonnet",
        description: "Anthropic's most intelligent model",
        reasoning: false,
        vision: true,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "llama3",
        name: "Llama 3 (Ollama/Local)",
        description: "Standard model ID for local Llama 3 instances",
        reasoning: false,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "gemini-1.5-pro-latest",
        name: "Gemini 1.5 Pro",
        description: "Google's capable multimodal model",
        reasoning: false,
        vision: true,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "gemini-2.0-flash-exp",
        name: "Gemini 2.0 Flash",
        description: "Google's next-gen fast model",
        reasoning: false,
        vision: true,
        extra_functions: [],
        extra_parameters: {}
      },
      {
        id: "user-defined",
        name: "Generic Custom Model",
        description: "Sends 'user-defined' as model ID. Use with proxies that default to a specific model.",
        reasoning: false,
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
      await fs.writeFile(configFile, JSON.stringify(DEFAULT_MODELS, null, 2), 'utf-8');
      return DEFAULT_MODELS;
    }

    // Read and parse config file
    const data = await fs.readFile(configFile, 'utf-8');
    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.error('Invalid models config JSON, resetting to defaults:', parseError);
      await fs.writeFile(configFile, JSON.stringify(DEFAULT_MODELS, null, 2), 'utf-8');
      return DEFAULT_MODELS;
    }
  } catch (error) {
    console.error('Error reading models config:', error);
    // Return defaults on error
    return DEFAULT_MODELS;
  }
});
