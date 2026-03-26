function deriveCapabilities(model) {
  const capabilities = ['chat'];
  const id = model?.id || '';

  if (model?.vision) {
    capabilities.push('image_understanding', 'file_understanding');
  }

  if (id.includes('imagen') || id.includes('image-preview') || id.includes('flash-image')) {
    capabilities.push('image_generation');
  }

  if (id.includes('veo')) {
    capabilities.push('video_generation');
  }

  return capabilities;
}

export function normalizeModelCapabilities(model) {
  const explicitCapabilities = Array.isArray(model?.capabilities)
    ? model.capabilities.filter(Boolean)
    : [];

  const mergedCapabilities = explicitCapabilities.length > 0
    ? explicitCapabilities
    : deriveCapabilities(model);

  return [...new Set(mergedCapabilities)];
}

export function normalizeModelCatalog(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => {
    if (Array.isArray(item.models)) {
      return {
        ...item,
        models: item.models.map((model) => ({
          ...model,
          capabilities: normalizeModelCapabilities(model),
        })),
      };
    }

    return {
      ...item,
      capabilities: normalizeModelCapabilities(item),
    };
  });
}

export function hasCapability(model, capability) {
  return Array.isArray(model?.capabilities) && model.capabilities.includes(capability);
}
