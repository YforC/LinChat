import { defineEventHandler } from 'h3';
import fs from 'node:fs/promises';
import path from 'node:path';

const LOGO_DIR = path.resolve(process.cwd(), 'public', 'ai_logos');
const IMAGE_EXTENSIONS = new Set(['.svg', '.png', '.jpg', '.jpeg', '.webp']);

export default defineEventHandler(async () => {
  try {
    const entries = await fs.readdir(LOGO_DIR, { withFileTypes: true });
    const logos = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
      .map((name) => `/ai_logos/${name}`);

    return logos;
  } catch (error) {
    console.error('Failed to list logos:', error);
    return [];
  }
});
