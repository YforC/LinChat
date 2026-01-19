<template>
  <div class="svg-logo" v-html="svgContent"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 24
  }
});

const svgContent = ref('<svg></svg>'); // Reactive reference for SVG content

const loadSvgContent = async () => {
  try {
    const response = await fetch(props.src);
    const content = await response.text();
    // Update reactive variable instead of direct DOM manipulation
    svgContent.value = content;
  } catch (error) {
    console.error('Error loading SVG:', error);
    svgContent.value = '<svg></svg>'; // Fallback
  }
};

// Flag to track if component is still mounted
const isMounted = ref(true);

onMounted(() => {
  loadSvgContent();
});

// Watch for changes to the src prop and reload the SVG content when it changes
watch(() => props.src, () => {
  if (isMounted.value) {
    loadSvgContent();
  }
});

onUnmounted(() => {
  isMounted.value = false;
});
</script>

<style scoped>
.svg-logo {
  width: v-bind('props.size + "px"');
  height: v-bind('props.size + "px"');
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.svg-logo :deep(svg) {
  width: 100%;
  height: 100%;
  fill: currentColor;
  color: inherit;
  /* Do not apply stroke to preserve original visual weight */
}
</style>