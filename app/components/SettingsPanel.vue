<script setup>
import { onMounted, ref, watch } from "vue";
import { useSettings } from "@/composables/useSettings";
import { Icon } from "@iconify/vue";
import Logo from "./Logo.vue";
import { availableModels, fetchModels, saveModelsToLocal } from "@/composables/availableModels";

// Define props and emits
const props = defineProps(["isOpen", "initialTab"]);
const emit = defineEmits(["reloadSettings", "close"]);

// --- Reactive State Variables ---
const settingsManager = useSettings();
const currTab = ref("models");
const validTabs = ["models"];

// Model Editor State
const modelsConfig = ref([]);
const expandedCategories = ref({});
const logoOptions = ref([]);
const isLogosLoading = ref(false);

// --- Constants for Navigation ---
const navItems = [
  {
    key: "models",
    label: "模型",
    icon: "material-symbols:view-list"
  }
];

// --- Lifecycle Hooks ---
onMounted(async () => {
  await settingsManager.loadSettings();
  console.log("Loaded settings:", settingsManager.settings);

  // Initialize models config from current state
  await fetchModels();
  modelsConfig.value = JSON.parse(JSON.stringify(availableModels.value));
  await fetchLogoOptions();

  // Expand all categories by default
  modelsConfig.value.forEach((cat, index) => {
    expandedCategories.value[index] = true;
  });

});

watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      currTab.value = validTabs.includes(props.initialTab) ? props.initialTab : "models";
      // Refresh models when opening
      await fetchModels();
      modelsConfig.value = JSON.parse(JSON.stringify(availableModels.value));
      await fetchLogoOptions();
    }
  }
);

// --- Functions ---
function closeSettings() {
  emit("close");
}

async function saveSettings() {
  // Save generic settings
  await settingsManager.saveSettings();

  // Save models
  const localModels = JSON.parse(JSON.stringify(modelsConfig.value));
  availableModels.value = localModels;
  await saveModelsToLocal(localModels);
  try {
    const response = await fetch('/api/models', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(modelsConfig.value)
    });

    if (!response.ok) {
      throw new Error('Failed to save models');
    }

    // Refresh available models
    await fetchModels();

  } catch (error) {
    console.error('Error saving models:', error);
    alert('保存模型配置失败: ' + error.message);
    return;
  }

  // Close settings and refresh the page
  closeSettings();
  location.reload();
}

// --- Model Editor Functions ---

function toggleCategory(index) {
  expandedCategories.value[index] = !expandedCategories.value[index];
}

function addCategory() {
  modelsConfig.value.push({
    category: "New Category",
    logo: "/ai_logos/openai.svg",
    models: []
  });
  expandedCategories.value[modelsConfig.value.length - 1] = true;
}

function removeCategory(index) {
  if (confirm("确定要删除此分类及其所有模型吗？")) {
    modelsConfig.value.splice(index, 1);
  }
}

function logoLabel(path) {
  const parts = String(path || '').split('/');
  return parts[parts.length - 1] || 'logo';
}

function normalizeCategoryLogos() {
  if (!logoOptions.value.length) return;
  modelsConfig.value.forEach((category) => {
    if (!logoOptions.value.includes(category.logo)) {
      category.logo = logoOptions.value[0];
    }
  });
}

async function fetchLogoOptions() {
  isLogosLoading.value = true;
  try {
    const response = await fetch('/api/logos');
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        logoOptions.value = data;
        normalizeCategoryLogos();
      }
    }
  } catch (error) {
    console.error('Error loading logos:', error);
  } finally {
    isLogosLoading.value = false;
  }
}

function addModel(categoryIndex) {
  modelsConfig.value[categoryIndex].models.push({
    id: "new-model-id",
    name: "New Model",
    description: "Model description",
    reasoning: false,
    vision: false,
    extra_functions: [],
    extra_parameters: {}
  });
}

function removeModel(categoryIndex, modelIndex) {
  if (confirm("确定要删除此模型吗？")) {
    modelsConfig.value[categoryIndex].models.splice(modelIndex, 1);
  }
}

async function resetModelsToDefaults() {
  if (confirm("确定要重置所有模型配置为默认值吗？此操作无法撤销。")) {
    try {
      // Deleting the config file triggers fallback to defaults
      // But we can't easily delete via API, so we just clear the list and reload
      // Ideally we'd have a specific reset endpoint, but for now we'll just
      // rely on the user manually fixing it or we could implement a DELETE method on the API.

      // Simpler approach: Just reload the default hardcoded list if we had access to it,
      // but since we moved it to server side, we might need a specific 'reset' flag in the fetch.
      // For now, let's just alert that this requires manual config file deletion or just clearing the UI.

      // Actually, let's just clear the local state and let the user add from scratch or reload page?
      // No, that's bad UX.

      alert("请在服务器上删除 config.json 文件以重置为默认值。");
    } catch (error) {
      console.error(error);
    }
  }
}
</script>

<template>
  <!-- NOTE: v-if="isOpen" and overlay removed to let DialogRoot manage visibility -->
  <div class="settings-panel">
    <!-- Header -->
    <div class="panel-header">
      <div class="header-content">
        <h1 class="panel-title">设置</h1>
      </div>
      <button class="close-btn" @click="closeSettings" aria-label="关闭设置">
        <Icon icon="material-symbols:close" width="20" height="20" />
      </button>
    </div>

    <div class="panel-content-wrapper">
      <!-- Vertical Navigation -->
      <div class="settings-nav">
        <div class="nav-items">
          <div v-for="item in navItems" :key="item.key" class="nav-item">
            <button class="nav-link" :class="{ active: currTab === item.key }" @click="currTab = item.key">
              <Icon :icon="item.icon" width="24" height="24" />
              <span class="nav-label">{{ item.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="panel-content">
        <!-- Models Tab -->
        <div v-show="currTab === 'models'" class="settings-section">
          <div class="settings-content">
            <div class="content-header model-header">
              <div>
                <h2>模型配置</h2>
                <p>管理可用的 AI 模型列表</p>
              </div>
              <button class="reset-btn" @click="resetModelsToDefaults">
                <Icon icon="material-symbols:refresh" width="16" height="16" />
                重置默认
              </button>
            </div>

            <div class="models-editor">
              <div v-for="(category, catIndex) in modelsConfig" :key="catIndex" class="category-block">
                <div class="category-header" @click="toggleCategory(catIndex)">
                  <div class="category-title">
                    <Icon :icon="expandedCategories[catIndex] ? 'material-symbols:keyboard-arrow-down' : 'material-symbols:keyboard-arrow-right'" width="20" height="20" />
                    <input v-model="category.category" @click.stop class="edit-input category-input" placeholder="分类名称" />
                  </div>
                  <div class="category-actions">
                    <div class="logo-picker" @click.stop>
                      <Logo v-if="category.logo" :src="category.logo" :size="20" class="logo-preview" :alt="category.category || 'Logo'" />
                      <select v-model="category.logo" class="logo-select">
                        <option v-if="isLogosLoading" disabled value="">Loading...</option>
                        <option v-else-if="logoOptions.length === 0" disabled value="">No logos found</option>
                        <option v-for="logo in logoOptions" :key="logo" :value="logo">
                          {{ logoLabel(logo) }}
                        </option>
                      </select>
                    </div>
                    <button class="icon-btn delete-btn" @click.stop="removeCategory(catIndex)" title="删除分类">
                      <Icon icon="material-symbols:delete" width="18" height="18" />
                    </button>
                  </div>
                </div>

                <div v-show="expandedCategories[catIndex]" class="models-list">
                  <div v-for="(model, modelIndex) in category.models" :key="modelIndex" class="model-item">
                    <div class="model-row">
                      <div class="model-inputs">
                        <div class="input-group">
                          <label>ID</label>
                          <input v-model="model.id" class="edit-input" placeholder="模型 ID (例如: gpt-4o)" />
                        </div>
                        <div class="input-group">
                          <label>名称</label>
                          <input v-model="model.name" class="edit-input" placeholder="显示名称" />
                        </div>
                      </div>
                      <div class="model-actions">
                        <button class="icon-btn delete-btn" @click="removeModel(catIndex, modelIndex)" title="删除模型">
                          <Icon icon="material-symbols:delete" width="18" height="18" />
                        </button>
                      </div>
                    </div>
                    <div class="model-row description-row">
                      <input v-model="model.description" class="edit-input full-width" placeholder="描述" />
                    </div>
                    <div class="model-row flags-row">
                      <label class="checkbox-label">
                        <input type="checkbox" v-model="model.reasoning" /> 推理
                      </label>
                      <label class="checkbox-label">
                        <input type="checkbox" v-model="model.vision" /> 视觉
                      </label>
                    </div>
                  </div>
                  <button class="add-btn sub-btn" @click="addModel(catIndex)">
                    <Icon icon="material-symbols:add" width="16" height="16" /> 添加模型
                  </button>
                </div>
              </div>

              <button class="add-btn main-btn" @click="addCategory">
                <Icon icon="material-symbols:add" width="18" height="18" /> 添加分类
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="panel-footer">
      <div class="footer-actions">
        <button @click="closeSettings" class="cancel-btn">取消</button>
        <button @click="saveSettings" class="save-btn">保存更改</button>
      </div>
    </div>
  </div>
</template>



<style scoped>
.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.settings-panel {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 1100px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border);
}


/* Header */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  background: var(--bg-primary);
  flex-shrink: 0;
}

.header-content h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: var(--btn-hover);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background: var(--btn-hover);
  color: var(--text-primary);
}

/* Main Content Layout */
.panel-content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Vertical Navigation */
.settings-nav {
  width: 220px;
  border-right: 1px solid var(--border);
  background: var(--bg-primary);
  flex-shrink: 0;
  overflow-y: auto;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
}

.nav-item {
  width: 100%;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  width: 100%;
  text-align: left;
}

.nav-link:hover {
  background: var(--btn-hover-2);
  color: var(--text-primary);
}

.nav-link.active {
  background: var(--btn-hover-2);
  color: var(--primary);
}

.nav-label {
  flex: 1;
}

/* Content Area */
.panel-content {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-secondary);
}

.settings-section {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.content-header h2 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.content-header p {
  margin: 0 0 1.5rem;
  color: var(--text-secondary);
}

/* Settings row */
.setting-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  gap: 0.75rem;
}

.setting-item.textarea-item {
  flex-direction: column;
  align-items: stretch;
}

.setting-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
}

.setting-info p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.setting-item.textarea-item .setting-info {
  margin-bottom: 0.5rem;
}

.input-container {
  width: 100%;
  max-width: 400px;
}

/* Models Editor Styles */
.model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.models-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-block {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  cursor: pointer;
  user-select: none;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
}

.category-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-picker {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-preview {
  display: inline-flex;
}

.logo-select {
  min-width: 140px;
  height: 30px;
  padding: 0 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.75rem;
}

.logo-select:focus {
  outline: none;
  border-color: var(--primary);
}

.models-list {
  padding: 1rem;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.model-item {
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.model-row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.model-inputs {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.input-group label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.edit-input {
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.875rem;
  width: 100%;
}

.edit-input:focus {
  outline: none;
  border-color: var(--primary);
}

.category-input {
  background: transparent;
  border: 1px solid transparent;
  font-weight: 600;
  width: auto;
  min-width: 150px;
}

.category-input:hover, .category-input:focus {
  border-color: var(--border);
  background: var(--bg-primary);
}

.full-width {
  width: 100%;
}

.flags-row {
  justify-content: flex-start;
  padding-top: 0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: var(--btn-hover);
  color: var(--text-primary);
}

.delete-btn:hover {
  color: var(--destructive);
  background: var(--bg-tertiary);
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  border: 1px dashed var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.add-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--bg-secondary);
}

.main-btn {
  width: 100%;
  padding: 0.75rem;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
}

.reset-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.setting-item.textarea-item .input-container {
  max-width: 400px;
}

.custom-input,
.custom-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.875rem;
  resize: vertical;
}

.custom-input:focus,
.custom-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary-a2);
}

.switch-container {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.switch-root {
  width: 42px;
  height: 24px;
  background-color: var(--text-muted);
  border-radius: 9999px;
  position: relative;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  transition: background-color 100ms;
}

.switch-root[data-state='checked'] {
  background-color: var(--primary-600);
}

.switch-thumb {
  width: 20px;
  height: 20px;
  background-color: var(--border);
  border-radius: 9999px;
  box-shadow: 0 2px 2px var(--black-a7);
  transition: transform 100ms;
  transform: translateX(-9px);
  will-change: transform;
  position: relative;
  z-index: 1;
}

.switch-thumb[data-state='checked'] {
  transform: translateX(9px);
}

.dark .switch-thumb {
  background-color: var(--bg-primary);
}

.switch-thumb[data-state='checked'] {
  transform: translateX(8px);
  background-color: var(--bg-primary);
}

/* Footer */
.panel-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border);
  background: var(--bg-primary);
  flex-shrink: 0;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.cancel-btn,
.save-btn {
  padding: 0 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn {
  background: none;
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.cancel-btn:hover {
  background: var(--btn-hover);
  color: var(--text-primary);
}

.save-btn {
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
}

.save-btn:hover {
  background: var(--primary-600);
}

/* Keybinds Styling */
.keybind-group {
  margin-bottom: 2rem;
}

.keybind-group h3 {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.keybind-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.keybind-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
}

.keybind-row:hover {
  border-color: var(--primary-a4);
  background: var(--bg-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.keybind-desc {
  font-size: 0.9375rem;
  color: var(--text-primary);
  font-weight: 450;
}

.keybind-keys {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: 0 2px 0 var(--border), 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.1s ease;
}

.key-plus {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
  margin: 0 2px;
}

/* Responsive */
@media (max-width: 768px) {
  .settings-nav {
    width: 60px;
  }

  .nav-label {
    display: none;
  }

  /* Make nav buttons smaller and center the icon */
  .nav-link {
    width: 36px;
    /* Reduced width */
    height: 36px;
    /* Reduced height, keep it square */
    padding: 0.6rem;
    /* Adjusted padding */
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.25rem auto;
    /* Center the button within the 60px nav item */
  }

  .settings-panel {
    height: 100dvh;
  }

  .settings-overlay {
    padding: 0;
    align-items: stretch;
    justify-content: stretch;
  }

  .settings-panel {
    max-width: 100vw;
    height: 100dvh;
    border-radius: 0;
    box-shadow: none;
  }

  .settings-content {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .input-container {
    max-width: 100%;
  }
}

/* Horizontal Navigation (for tall narrow screens) */
@media (max-aspect-ratio: 2/3) {
  .panel-content-wrapper {
    flex-direction: column;
  }

  .settings-nav {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    overflow-y: hidden;
    overflow-x: auto;
  }

  .nav-items {
    flex-direction: row;
    padding: 0.25rem 0.5rem;
  }
}
</style>
