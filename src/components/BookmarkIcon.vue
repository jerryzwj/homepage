<template>
  <div class="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden transition-colors duration-300" :class="colorClass">
    <img
      v-if="src"
      :src="src"
      :alt="bookmark.title || ''"
      class="w-5 h-5 object-contain select-none pointer-events-none"
      draggable="false"
      loading="lazy"
      @error="onImgError"
    >
    <span v-else class="text-sm font-semibold select-none">{{ letter }}</span>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  bookmark: {
    type: Object,
    required: true
  },
  colorClass: {
    type: String,
    default: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
  },
  // 父组件刷新图标时递增，强制重新加载（即使 icon URL 未变化）
  refreshVersion: {
    type: Number,
    default: 0
  }
})

const ICON_CACHE_PREFIX = 'favicon_cache_'

const src = ref('')

const letter = computed(() => {
  const text = props.bookmark.title || props.bookmark.url || '?'
  return text.charAt(0).toUpperCase()
})

// 从 localStorage 读取图标缓存
const getCachedIcon = (iconUrl) => {
  try {
    return localStorage.getItem(ICON_CACHE_PREFIX + iconUrl)
  } catch (e) {
    return null
  }
}

// 写入图标缓存（base64 data URL）
const setIconCache = (iconUrl, dataUrl) => {
  try {
    localStorage.setItem(ICON_CACHE_PREFIX + iconUrl, dataUrl)
  } catch (e) {
    // 存储满或不可用时忽略，仅降级为直接加载远程图标
    console.warn('图标缓存失败（可能存储已满）:', e)
  }
}

// 加载并缓存图标
const loadIcon = () => {
  const iconUrl = props.bookmark.icon
  if (!iconUrl) {
    src.value = ''
    return
  }
  // 命中本地缓存直接使用
  const cached = getCachedIcon(iconUrl)
  if (cached) {
    src.value = cached
    return
  }
  // 未命中：先尝试跨域加载转 base64 缓存
  tryLoadWithCors(iconUrl, true)
}

const tryLoadWithCors = (iconUrl, withCors) => {
  const img = new Image()
  if (withCors) {
    img.crossOrigin = 'anonymous'
  }
  img.onload = () => {
    if (withCors) {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth || 64
        canvas.height = img.naturalHeight || 64
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const dataUrl = canvas.toDataURL('image/png')
        setIconCache(iconUrl, dataUrl)
        src.value = dataUrl
        return
      } catch (e) {
        // canvas 被跨域污染，降级直接显示远程图标（不做缓存）
      }
    }
    src.value = iconUrl
  }
  img.onerror = () => {
    if (withCors) {
      // 部分站点不允许跨域，去掉 crossOrigin 重试一次
      tryLoadWithCors(iconUrl, false)
    } else {
      // 图标加载失败，回退为首字母
      src.value = ''
    }
  }
  img.src = iconUrl
}

// 图标或刷新版本变化时重新加载（新增/编辑/手动刷新后）
watch([() => props.bookmark.icon, () => props.refreshVersion], () => {
  loadIcon()
}, { immediate: true })

// 暴露清除缓存方法（供刷新图标时调用）
const clearCache = () => {
  const iconUrl = props.bookmark.icon
  if (iconUrl) {
    try {
      localStorage.removeItem(ICON_CACHE_PREFIX + iconUrl)
    } catch (e) { /* 忽略 */ }
  }
  src.value = ''
}

defineExpose({ clearCache })

const onImgError = () => {
  src.value = ''
}
</script>
