<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ isEditing ? '编辑分类' : '添加分类' }}</h3>
        <button @click="close" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="p-4">
        <form @submit.prevent="save">
          <div class="mb-4">
            <label for="cate_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">分类名称</label>
            <input 
              type="text" 
              id="cate_name" 
              v-model="form.cate_name" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              placeholder="请输入分类名称"
              required
            >
          </div>
          <div class="mb-4">
            <label for="cate_desc" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">分类描述</label>
            <textarea 
              id="cate_desc" 
              v-model="form.cate_desc" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              placeholder="请输入分类描述（可选）"
              rows="2"
            ></textarea>
          </div>
          <div class="mb-4">
            <label for="cate_cover" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">分类封面</label>
            <input 
              type="url" 
              id="cate_cover" 
              v-model="form.cate_cover" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              placeholder="请输入封面图片URL（可选）"
            >
          </div>
          <div class="mb-6 flex items-center">
            <input 
              type="checkbox" 
              id="is_public" 
              v-model="form.is_public" 
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            >
            <label for="is_public" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">设为公开</label>
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
  category: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  cate_id: null,
  cate_name: '',
  cate_desc: '',
  cate_cover: '',
  is_public: 0
})

const isLoading = ref(false)

// 监听分类数据变化
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    form.cate_id = newCategory.cate_id
    form.cate_name = newCategory.cate_name
    form.cate_desc = newCategory.cate_desc || ''
    form.cate_cover = newCategory.cate_cover || ''
    form.is_public = newCategory.is_public || 0
  }
}, { immediate: true })

// 监听isOpen变化，重置表单
watch(() => props.isOpen, (newIsOpen) => {
  if (newIsOpen && !props.isEditing) {
    resetForm()
  }
})

const resetForm = () => {
  form.cate_id = null
  form.cate_name = ''
  form.cate_desc = ''
  form.cate_cover = ''
  form.is_public = 0
}

const close = () => {
  emit('close')
}

const save = async () => {
  isLoading.value = true
  try {
    emit('save', { ...form })
  } finally {
    isLoading.value = false
  }
}
</script>
