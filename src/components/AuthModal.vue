<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ isRegister ? '注册账号' : '登录' }}</h3>
        <button @click="close" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="p-4">
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">用户名</label>
            <input 
              type="text" 
              id="username" 
              v-model="form.username" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              placeholder="请输入用户名"
              required
            >
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">密码</label>
            <input 
              type="password" 
              id="password" 
              v-model="form.password" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              placeholder="请输入密码"
              required
            >
          </div>
          <div v-if="error" class="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
            {{ error }}
          </div>
          <div class="flex justify-end gap-3 mb-4">
            <button 
              type="button" 
              @click="toggleMode" 
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              :disabled="isLoading"
            >
              <span v-if="isLoading">{{ isRegister ? '注册中...' : '登录中...' }}</span>
              <span v-else>{{ isRegister ? '注册' : '登录' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isRegister: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'login-success'])

const form = reactive({
  username: '',
  password: ''
})

const isLoading = ref(false)
const error = ref('')

const close = () => {
  emit('close')
}

const toggleMode = () => {
  emit('toggle-mode')
}

const handleSubmit = async () => {
  error.value = ''
  isLoading.value = true
  
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: props.isRegister ? 'register' : 'login',
        username: form.username,
        password: form.password
      })
    })
    
    const data = await response.json()
    
    if (response.ok && data.success) {
      // 登录成功，保存token到本地存储
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // 触发登录成功事件
      emit('login-success', data.user)
      close()
    } else {
      error.value = data.error || '操作失败'
    }
  } catch (err) {
    error.value = '网络错误，请稍后重试'
  } finally {
    isLoading.value = false
  }
}
</script>
