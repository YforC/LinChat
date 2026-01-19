import { defineEventHandler, readBody } from 'h3';
import fs from 'node:fs/promises';
import { getModelsConfigPaths } from '../utils/modelsConfig';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!Array.isArray(body)) {
      event.node.res.statusCode = 400;
      return { error: 'Invalid body: expected array of model categories' };
    }

    const { configDir, configFile } = getModelsConfigPaths();
    // Ensure directory exists
    await fs.mkdir(configDir, { recursive: true });

    // Write to file
    await fs.writeFile(configFile, JSON.stringify(body, null, 2), 'utf-8');

    return { success: true };
  } catch (error) {
    console.error('Error saving models config:', error);
    event.node.res.statusCode = 500;
    return { error: error.message || 'Failed to save models configuration' };
  }
});
