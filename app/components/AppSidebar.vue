<script setup>
import { ref, onBeforeUnmount, onMounted } from "vue";
import localforage from "localforage";
import { Icon } from "@iconify/vue";
import { useRouter, useRoute } from 'vue-router';
import { emitter } from '~/composables/emitter';

const emit = defineEmits([
  "reloadSettings",
  "toggleDark",
  "closeSidebar",
  "open-settings",
]);
const props = defineProps(["currConvo", "messages", "isDark", "isOpen"]);

const router = useRouter();
const route = useRoute();

const metadata = ref([]);
const windowWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 1200,
);

function handleResize() {
  windowWidth.value = window.innerWidth;
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

async function updateConversations() {
  const stored = await localforage.getItem("conversations_metadata");
  metadata.value = stored || [];
}

updateConversations(); // Initial load

emitter.on("updateConversations", updateConversations);

onBeforeUnmount(() => {
  emitter.off("updateConversations", updateConversations);
});

function closeSidebar() {
  emit("closeSidebar");
}

function handleNewConversation() {
  // Navigate to the new conversation page
  router.push('/');
}


async function handleDeleteConversation(id) {
  // Delete from localforage
  try {
    await localforage.removeItem(`conversation_${id}`);

    // Remove from metadata
    const storedMetadata = await localforage.getItem("conversations_metadata");
    if (storedMetadata) {
      const updatedMetadata = storedMetadata.filter(conv => conv.id !== id);
      await localforage.setItem("conversations_metadata", updatedMetadata);

      // Update local ref
      metadata.value = updatedMetadata;

      // If we're currently on this conversation, navigate away
      if (route.params.id === id) {
        router.push('/');
      }
    }
  } catch (error) {
    console.error('Error deleting conversation:', error);
  }
}
</script>

<template>
  <div>
    <div :class="['sidebar-overlay', { active: props.isOpen }]" @click="closeSidebar"></div>
    <div :class="['sidebar', { active: props.isOpen }]">
      <div class="sidebar-header">
        <button class="close-button" aria-label="关闭侧边栏" @click="closeSidebar">
          <Icon icon="material-symbols:side-navigation" width="24" height="24" />
        </button>
        <span class="sidebar-title">历史记录</span>
        <button class="settings-button" aria-label="打开设置" @click="$emit('open-settings')">
          <Icon icon="material-symbols:settings" width="24" height="24" />
        </button>
      </div>
      <button id="new-chat-button" class="new-chat-btn" @click="handleNewConversation">
        <span>新对话</span>
      </button>
      <div class="main-content">
        <div class="conversation-list" v-if="metadata.length">
          <div class="conversation-wrapper" v-for="data in [...metadata].reverse()" :key="data.id">
            <NuxtLink
              class="conversation-button"
              :to="`/${data.id}`"
              :class="{ active: data.id == route.params.id }"
            >
              {{ data.title }}
            </NuxtLink>
            <button class="delete-button no-hover" @click.stop="handleDeleteConversation(data.id)"
              aria-label="删除对话">
              <Icon icon="material-symbols:delete" width="16" height="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100dvh;
  width: 280px;
  max-width: 90vw;
  z-index: 1001;
  background: linear-gradient(180deg, color-mix(in srgb, var(--surface-strong) 90%, transparent), color-mix(in srgb, var(--surface-glass) 88%, transparent));
  color: var(--text-primary);
  border-right: 1px solid var(--editorial-outline);
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(.4, 1, .6, 1);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--editorial-shadow);
}

.sidebar.active {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  color: var(--text-primary);
  padding: 0 12px;
  position: relative;
  flex-shrink: 0;
  border-bottom: 1px solid var(--editorial-outline);
}

.sidebar-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: inherit;
  letter-spacing: 0.01em;
}

#new-chat-button {
  margin: 18px 16px 14px 16px;
  width: calc(100% - 32px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 14px;
  height: 44px;
  padding: 0;
  font-size: 1em;
  font-weight: 600;
  transition:
    background 0.18s,
    box-shadow 0.18s,
    transform 0.15s;
  flex-shrink: 0;
  box-shadow: var(--editorial-shadow-soft);
}

#new-chat-button:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
}

.main-content {
  flex: 1 1 0;
  overflow-y: auto;
  padding: 0 14px 14px;
  margin-bottom: 8px;
}

.conversation-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 8px;
}

.conversation-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 3px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-strong) 58%, transparent);
  border: 1px solid transparent;
}

.conversation-button {
  flex-grow: 1;
  text-align: left;
  background: none;
  color: var(--text-primary);
  border: none;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 0.95em;
  font-family: inherit;
  font-weight: 500;
  text-decoration: none;
  transition:
    background 0.18s,
    color 0.18s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.conversation-button:hover {
  background: color-mix(in srgb, var(--surface-strong) 92%, transparent);
  color: var(--primary);
}

.conversation-button.active {
  background: color-mix(in srgb, var(--primary) 10%, var(--surface-strong));
  color: var(--primary);
  font-weight: 700;
}

.dark .conversation-button {
  color: var(--text-secondary);
}

.delete-button.no-hover {
  background: color-mix(in srgb, var(--surface-strong) 92%, transparent);
  border: none;
  padding: 4px;
  opacity: 0.82;
  flex-shrink: 0;
  border-radius: 10px;
}

.delete-button.no-hover:hover {
  opacity: 1;
}

.delete-button :deep(svg) {
  color: var(--danger);
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(28, 17, 12, 0.36);
  opacity: 0;
  z-index: 1000;
  transition: opacity 0.3s cubic-bezier(.4, 1, .6, 1);
  will-change: opacity;
  pointer-events: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.sidebar-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.settings-button {
  border-radius: 12px;
  height: 40px;
  width: 40px;
  transition: background 0.18s;
  flex-shrink: 0;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-button:hover {
  background: var(--btn-hover);
}

.close-button {
  border-radius: 12px;
  height: 40px;
  width: 40px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  transition: background 0.18s;
  flex-shrink: 0;
}

.close-button:hover {
  background: var(--btn-hover);
}

@media (min-width: 950px) {
  .sidebar {
    position: fixed;
  }

  .sidebar-overlay {
    display: none;
  }
}

@media (max-width: 949px) {
  .sidebar {
    position: fixed;
    width: 80vw;
    max-width: 340px;
    box-shadow: var(--editorial-shadow);
  }

  .dark .sidebar {
    box-shadow: 4px 0 24px #0004;
  }
}

@media (max-width: 600px) {
  .sidebar-title {
    font-size: 1.15rem;
  }

  .conversation-button {
    font-size: 0.9em;
  }
}
</style>
