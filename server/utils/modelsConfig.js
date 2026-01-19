import path from 'node:path';

const DEFAULT_CONFIG_DIR = path.resolve(process.cwd());

export function getModelsConfigPaths() {
  const envDir = process.env.LIBRE_CONFIG_DIR;
  const configDir = envDir ? path.resolve(envDir) : DEFAULT_CONFIG_DIR;
  return {
    configDir,
    configFile: path.join(configDir, 'config.json')
  };
}
