<template>
  <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
    <h1>重置设置</h1>
    <p>点击下面的按钮清除所有本地设置并重新加载页面。</p>
    <button @click="resetAll" style="padding: 1rem 2rem; font-size: 1.2rem; cursor: pointer; background: #e74c3c; color: white; border: none; border-radius: 8px;">
      清除所有设置并重新加载
    </button>
    <div v-if="message" style="margin-top: 1rem; padding: 1rem; background: #f0f0f0; border-radius: 4px;">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import localforage from 'localforage';

const message = ref('');

async function resetAll() {
  try {
    message.value = '正在清除设置...';

    // Clear all localforage data
    await localforage.clear();

    message.value = '设置已清除，正在重新加载...';

    // Wait a bit then reload
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  } catch (error) {
    message.value = '错误: ' + error.message;
    console.error('Reset error:', error);
  }
}
</script>
