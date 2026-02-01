<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ isEditing ? '编辑收藏' : '添加收藏' }}</h3>
        <button @click="close" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="p-4">
        <form @submit.prevent="save">
          <div class="mb-4">
            <label for="url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">网址</label>
            <div class="flex gap-2">
              <input 
                type="url" 
                id="url" 
                v-model="form.url" 
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                placeholder="请输入网址"
                required
              >
              <button 
                type="button" 
                @click="fetchUrlInfo" 
                class="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                :disabled="!form.url || isFetching"
              >
                <span v-if="isFetching">抓取中...</span>
                <span v-else>抓取信息</span>
              </button>
            </div>
          </div>
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">标题</label>
            <input 
              type="text" 
              id="title" 
              v-model="form.title" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              placeholder="请输入标题"
              required
            >
          </div>
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">描述</label>
            <textarea 
              id="description" 
              v-model="form.description" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              placeholder="请输入描述（可选）"
              rows="3"
            ></textarea>
          </div>
          <div class="mb-4">
            <label for="icon" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">图标</label>
            <input 
              type="url" 
              id="icon" 
              v-model="form.icon" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              placeholder="请输入图标URL（可选）"
            >
          </div>
          <div class="mb-4">
            <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">分类</label>
            <select 
              id="category" 
              v-model="form.cate_id" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">请选择分类</option>
              <option v-for="category in categories" :key="category.cate_id" :value="category.cate_id">
                {{ category.cate_name }}
              </option>
            </select>
          </div>
          <div class="mb-6">
            <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">标签</label>
            <input 
              type="text" 
              id="tags" 
              v-model="form.tags" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              placeholder="请输入标签，用逗号分隔（可选）"
            >
          </div>
          <div class="flex justify-end gap-3">
            <button 
              type="button" 
              @click="close" 
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              :disabled="isLoading"
            >
              <span v-if="isLoading">保存中...</span>
              <span v-else>保存</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  bookmark: {
    type: Object,
    default: null
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  bookmark_id: null,
  cate_id: '',
  title: '',
  url: '',
  icon: '',
  description: '',
  tags: ''
})

const isLoading = ref(false)
const isFetching = ref(false)

// 监听收藏数据变化
watch(() => props.bookmark, (newBookmark) => {
  if (newBookmark) {
    form.bookmark_id = newBookmark.bookmark_id
    form.cate_id = newBookmark.cate_id
    form.title = newBookmark.title
    form.url = newBookmark.url
    form.icon = newBookmark.icon || ''
    form.description = newBookmark.description || ''
    form.tags = newBookmark.tags || ''
  }
}, { immediate: true })

// 监听isOpen变化，重置表单
watch(() => props.isOpen, (newIsOpen) => {
  if (newIsOpen && !props.isEditing) {
    resetForm()
  }
})

const resetForm = () => {
  form.bookmark_id = null
  form.cate_id = ''
  form.title = ''
  form.url = ''
  form.icon = ''
  form.description = ''
  form.tags = ''
}

const close = () => {
  emit('close')
}

const save = async () => {
  isLoading.value = true
  try {
    // 处理标签，支持空格和中文逗号作为分隔符
    const processedForm = { ...form }
    if (processedForm.tags) {
      // 将空格和中文逗号替换为英文逗号，然后分割并过滤空标签，最后重新连接
      processedForm.tags = processedForm.tags
        .replace(/[\s，]/g, ',') // 替换空格和中文逗号为英文逗号
        .split(',') // 分割标签
        .map(tag => tag.trim()) // 去除每个标签的前后空格
        .filter(tag => tag) // 过滤空标签
        .join(',') // 重新连接为逗号分隔的字符串
    }
    emit('save', processedForm)
  } finally {
    isLoading.value = false
  }
}

const fetchUrlInfo = async () => {
  if (!form.url) return
  
  isFetching.value = true
  try {
    // 调用后端API来抓取网页信息
    const response = await fetch('/api/fetch-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: form.url })
    })
    
    if (response.ok) {
      const urlInfo = await response.json()
      // 直接替换，无论输入框是否已有内容
      form.title = urlInfo.title
      form.description = urlInfo.description
      form.icon = urlInfo.icon
    } else {
      // 如果API调用失败，使用备用方案
      const hostname = new URL(form.url).hostname
      // 直接替换，无论输入框是否已有内容
      form.title = hostname
      form.description = `来自 ${hostname} 的链接`
      form.icon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
    }
  } catch (error) {
    console.error('抓取网址信息失败:', error)
    // 抓取失败时使用默认值
    const hostname = new URL(form.url).hostname
    // 直接替换，无论输入框是否已有内容
    form.title = hostname
    form.description = `来自 ${hostname} 的链接`
    form.icon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
  } finally {
    isFetching.value = false
  }
}
</script>
