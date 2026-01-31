<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">收藏夹 Homepage</h1>
        <div class="flex items-center gap-4">
          <button @click="userStore.toggleDarkMode" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <svg v-if="!userStore.darkMode" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600 dark:text-gray-300"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300 dark:text-gray-600"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          </button>
          <div v-if="userStore.isLoggedIn" class="flex items-center gap-2">
            <img v-if="userStore.avatar" :src="userStore.avatar" alt="Avatar" class="w-8 h-8 rounded-full">
            <span class="text-gray-700 dark:text-gray-300">{{ userStore.username || '用户' }}</span>
            <button @click="userStore.logout" class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              登出
            </button>
          </div>
          <button v-else @click="openLoginModal" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              登录
            </button>
        </div>
      </div>
    </header>
    
    <main class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- 分类侧边栏 -->
        <div class="md:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">分类管理</h2>
            <div class="space-y-2" ref="categoriesContainer">
              <div 
                v-for="category in bookmarkStore.categories" 
                :key="category.cate_id" 
                class="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                @click="switchCategory(category.cate_id)"
              >
                <div class="flex items-center gap-2">
                  <span class="text-gray-700 dark:text-gray-300">{{ category.cate_name }}</span>
                  <span v-if="category.is_public" class="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-full">
                    公开
                  </span>
                  <span v-else class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                    私有
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    @click.stop="toggleCategoryPublic(category)"
                    title="切换公开/私有状态"
                  >
                    <svg v-if="category.is_public" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500 dark:text-gray-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </button>
                  <button 
                    class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    @click.stop="openEditCategoryModal(category)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500 dark:text-gray-400"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
                  </button>
                  <button 
                    class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    @click.stop="deleteCategory(category.cate_id)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
              <button 
                v-if="userStore.isLoggedIn" 
                class="w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded mt-4 flex items-center justify-center gap-2"
                @click="openAddCategoryModal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                添加分类
              </button>
              <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                登录后管理分类
              </div>
            </div>
          </div>
        </div>
        
        <!-- 收藏卡片区域 -->
        <div class="md:col-span-3">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ bookmarkStore.currentCategory ? 
                    bookmarkStore.categories.find(c => c.cate_id === bookmarkStore.currentCategory)?.cate_name : 
                    '所有收藏' 
                }}
              </h2>
              <div class="flex items-center gap-2">
                <div class="relative">
                  <input 
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="搜索收藏..." 
                    class="px-3 py-1 pr-8 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                    @input="handleSearch"
                  >
                  <button 
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    @click="clearSearch"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                <button 
                  v-if="userStore.isLoggedIn" 
                  class="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                  @click="openAddBookmarkModal"
                >
                  添加收藏
                </button>
                <button 
                  v-if="userStore.isLoggedIn" 
                  class="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors"
                  @click="openImportModal"
                >
                  导入收藏
                </button>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" ref="bookmarksContainer">
              <div v-for="bookmark in bookmarkStore.bookmarks" :key="bookmark.bookmark_id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-2">
                  <h3 class="font-medium text-gray-900 dark:text-white" v-html="highlightKeywords(bookmark.title, searchQuery)"></h3>
                  <div v-if="userStore.isLoggedIn" class="flex items-center gap-1">
                    <button class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500 dark:text-gray-400"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button 
                      class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      @click.stop="openEditBookmarkModal(bookmark)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500 dark:text-gray-400"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
                    </button>
                    <button 
                      class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      @click.stop="deleteBookmark(bookmark.bookmark_id)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3" v-html="highlightKeywords(bookmark.description, searchQuery)"></p>
                <a :href="bookmark.url" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate block mb-2" v-html="highlightKeywords(bookmark.url, searchQuery)"></a>
                <div class="flex flex-wrap gap-1">
                  <span v-for="tag in bookmark.tags.split(',')" :key="tag" class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="bookmarkStore.bookmarks.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
              <p v-if="userStore.isLoggedIn">暂无收藏，点击「添加收藏」开始</p>
              <p v-else>登录后查看和管理收藏</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- 分类模态框 -->
    <CategoryModal 
      :is-open="isCategoryModalOpen"
      :is-editing="isEditingCategory"
      :category="currentCategory"
      @close="closeCategoryModal"
      @save="saveCategory"
    />
    
    <!-- 收藏模态框 -->
    <BookmarkModal 
      :is-open="isBookmarkModalOpen"
      :is-editing="isEditingBookmark"
      :bookmark="currentBookmark"
      :categories="bookmarkStore.categories"
      @close="closeBookmarkModal"
      @save="saveBookmark"
    />
    
    <!-- 认证模态框 -->
    <AuthModal 
      :is-open="isAuthModalOpen"
      :is-register="isRegisterMode"
      @close="closeAuthModal"
      @toggle-mode="toggleAuthMode"
      @login-success="handleLoginSuccess"
    />
    
    <!-- 导入模态框 -->
    <div v-if="isImportModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">导入收藏</h3>
          <button @click="closeImportModal" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="p-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            请选择浏览器导出的书签HTML文件进行导入。导入过程中会自动创建分类并添加书签。
          </p>
          <div class="mb-4">
            <input 
              type="file" 
              ref="importFileInput"
              accept=".html"
              class="hidden"
              @change="handleFileSelect"
            >
            <button 
              type="button" 
              @click="$refs.importFileInput.click()"
              class="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              选择文件
            </button>
          </div>
          <div v-if="importFile" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
            已选择文件: {{ importFile.name }}
          </div>
          <div v-if="importError" class="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
            {{ importError }}
          </div>
          <div class="flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeImportModal" 
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              :disabled="importLoading"
            >
              取消
            </button>
            <button 
              type="button" 
              @click="handleImport" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              :disabled="!importFile || importLoading"
            >
              <span v-if="importLoading">导入中...</span>
              <span v-else>开始导入</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Sortable from 'sortablejs'
import { useUserStore } from './stores/user'
import { useBookmarkStore } from './stores/bookmark'
import CategoryModal from './components/CategoryModal.vue'
import BookmarkModal from './components/BookmarkModal.vue'
import AuthModal from './components/AuthModal.vue'

const userStore = useUserStore()
const bookmarkStore = useBookmarkStore()
const bookmarksContainer = ref(null)
const categoriesContainer = ref(null)

// 分类模态框状态
const isCategoryModalOpen = ref(false)
const isEditingCategory = ref(false)
const currentCategory = ref(null)

// 收藏模态框状态
const isBookmarkModalOpen = ref(false)
const isEditingBookmark = ref(false)
const currentBookmark = ref(null)

// 认证模态框状态
const isAuthModalOpen = ref(false)
const isRegisterMode = ref(false)

// 搜索状态
const searchQuery = ref('')

// 导入模态框状态
const isImportModalOpen = ref(false)
const importFile = ref(null)
const importLoading = ref(false)
const importError = ref('')

onMounted(async () => {
  // 初始化用户状态
  userStore.init()
  
  // 如果已登录，加载分类和收藏数据
  if (userStore.isLoggedIn) {
    loadData()
  }
  
  // 初始化收藏卡片拖拽排序
  if (bookmarksContainer.value) {
    new Sortable(bookmarksContainer.value, {
      animation: 150,
      ghostClass: 'bg-gray-200 dark:bg-gray-600',
      onEnd: function(evt) {
        const movedBookmark = bookmarkStore.bookmarks.splice(evt.oldIndex, 1)[0]
        bookmarkStore.bookmarks.splice(evt.newIndex, 0, movedBookmark)
        // 更新排序到服务器
        bookmarkStore.updateBookmarkOrder(bookmarkStore.bookmarks)
      }
    })
  }
  
  // 初始化分类拖拽排序
  if (categoriesContainer.value) {
    new Sortable(categoriesContainer.value, {
      animation: 150,
      ghostClass: 'bg-gray-200 dark:bg-gray-600',
      onEnd: function(evt) {
        const movedCategory = bookmarkStore.categories.splice(evt.oldIndex, 1)[0]
        bookmarkStore.categories.splice(evt.newIndex, 0, movedCategory)
        // 更新排序到服务器
        bookmarkStore.updateCategoryOrder(bookmarkStore.categories)
      }
    })
  }
})

// 监听登录状态变化
watch(() => userStore.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    loadData()
  } else {
    // 登出后清空数据
    bookmarkStore.categories = []
    bookmarkStore.bookmarks = []
    bookmarkStore.currentCategory = null
  }
})

// 加载数据
const loadData = async () => {
  await bookmarkStore.fetchCategories()
  await bookmarkStore.fetchBookmarks()
}

// 切换分类
const switchCategory = async (cateId) => {
  await bookmarkStore.fetchBookmarks(cateId)
}

// 打开添加分类模态框
const openAddCategoryModal = () => {
  isEditingCategory.value = false
  currentCategory.value = null
  isCategoryModalOpen.value = true
}

// 打开编辑分类模态框
const openEditCategoryModal = (category) => {
  isEditingCategory.value = true
  currentCategory.value = category
  isCategoryModalOpen.value = true
}

// 关闭分类模态框
const closeCategoryModal = () => {
  isCategoryModalOpen.value = false
}

// 保存分类
const saveCategory = async (categoryData) => {
  try {
    let success
    if (isEditingCategory.value) {
      // 更新分类
      success = await bookmarkStore.updateCategory(categoryData)
    } else {
      // 创建分类
      success = await bookmarkStore.createCategory(categoryData)
    }
    
    if (success) {
      closeCategoryModal()
    }
  } catch (error) {
    console.error('保存分类失败:', error)
  }
}

// 删除分类
const deleteCategory = async (cateId) => {
  if (confirm('确定要删除这个分类吗？分类下的所有收藏也会被删除。')) {
    try {
      const success = await bookmarkStore.deleteCategory(cateId)
      if (success) {
        // 如果删除的是当前选中的分类，切换到所有收藏
        if (bookmarkStore.currentCategory === cateId) {
          await bookmarkStore.fetchBookmarks()
        }
      }
    } catch (error) {
      console.error('删除分类失败:', error)
    }
  }
}

// 打开添加收藏模态框
const openAddBookmarkModal = () => {
  isEditingBookmark.value = false
  currentBookmark.value = null
  isBookmarkModalOpen.value = true
}

// 打开编辑收藏模态框
const openEditBookmarkModal = (bookmark) => {
  isEditingBookmark.value = true
  currentBookmark.value = bookmark
  isBookmarkModalOpen.value = true
}

// 关闭收藏模态框
const closeBookmarkModal = () => {
  isBookmarkModalOpen.value = false
}

// 保存收藏
const saveBookmark = async (bookmarkData) => {
  try {
    let success
    if (isEditingBookmark.value) {
      // 更新收藏
      success = await bookmarkStore.updateBookmark(bookmarkData)
    } else {
      // 创建收藏
      success = await bookmarkStore.createBookmark(bookmarkData)
    }
    
    if (success) {
      closeBookmarkModal()
    }
  } catch (error) {
    console.error('保存收藏失败:', error)
  }
}

// 删除收藏
const deleteBookmark = async (bookmarkId) => {
  if (confirm('确定要删除这个收藏吗？')) {
    try {
      const success = await bookmarkStore.deleteBookmark(bookmarkId)
      if (success) {
        // 删除成功，数据已经通过store更新
      }
    } catch (error) {
      console.error('删除收藏失败:', error)
    }
  }
}

// 打开登录模态框
const openLoginModal = () => {
  isRegisterMode.value = false
  isAuthModalOpen.value = true
}

// 打开注册模态框
const openRegisterModal = () => {
  isRegisterMode.value = true
  isAuthModalOpen.value = true
}

// 关闭认证模态框
const closeAuthModal = () => {
  isAuthModalOpen.value = false
}

// 切换认证模式
const toggleAuthMode = () => {
  isRegisterMode.value = !isRegisterMode.value
}

// 处理登录成功
const handleLoginSuccess = async (user) => {
  // 更新用户状态
  userStore.isLoggedIn = true
  userStore.userId = user.user_id
  userStore.username = user.username
  userStore.avatar = user.avatar
  
  // 加载数据
  await loadData()
}

// 处理搜索
const handleSearch = async () => {
  if (searchQuery.value) {
    await bookmarkStore.searchBookmarks(searchQuery.value)
  } else {
    await bookmarkStore.fetchBookmarks(bookmarkStore.currentCategory)
  }
}

// 清除搜索
const clearSearch = async () => {
  searchQuery.value = ''
  await bookmarkStore.fetchBookmarks(bookmarkStore.currentCategory)
}

// 高亮关键词
const highlightKeywords = (text, keywords) => {
  if (!keywords) return text
  
  const regex = new RegExp(`(${keywords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<span class="bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200">$1</span>')
}

// 打开导入模态框
const openImportModal = () => {
  isImportModalOpen.value = true
  importFile.value = null
  importLoading.value = false
  importError.value = ''
}

// 关闭导入模态框
const closeImportModal = () => {
  isImportModalOpen.value = false
  importFile.value = null
  importLoading.value = false
  importError.value = ''
}

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    importFile.value = file
    importError.value = ''
  }
}

// 处理导入
const handleImport = async () => {
  if (!importFile) {
    importError.value = '请选择要导入的文件'
    return
  }
  
  importLoading.value = true
  importError.value = ''
  
  try {
    // 读取文件内容
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const htmlContent = e.target.result
        
        // 解析HTML内容，提取书签数据
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlContent, 'text/html')
        const bookmarkNodes = doc.querySelectorAll('a')
        
        // 构建导入数据
        const importData = []
        let currentCategory = '未分类'
        
        // 提取文件夹（分类）信息
        const folderNodes = doc.querySelectorAll('h3')
        folderNodes.forEach((folderNode, index) => {
          currentCategory = folderNode.textContent
          // 找到该文件夹下的所有书签
          let nextNode = folderNode.nextElementSibling
          while (nextNode && nextNode.tagName !== 'H3') {
            const links = nextNode.querySelectorAll('a')
            links.forEach(link => {
              importData.push({
                title: link.textContent,
                url: link.getAttribute('href'),
                category: currentCategory,
                description: link.getAttribute('title') || '',
                tags: ''
              })
            })
            nextNode = nextNode.nextElementSibling
          }
        })
        
        // 处理根级书签
        const rootLinks = doc.querySelectorAll('body > a')
        rootLinks.forEach(link => {
          importData.push({
            title: link.textContent,
            url: link.getAttribute('href'),
            category: '未分类',
            description: link.getAttribute('title') || '',
            tags: ''
          })
        })
        
        // 发送导入请求到后端
        const token = localStorage.getItem('token')
        const response = await fetch('/api/bookmarks/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ bookmarks: importData })
        })
        
        if (response.ok) {
          // 导入成功，重新加载数据
          await loadData()
          closeImportModal()
        } else {
          const errorData = await response.json()
          importError.value = errorData.error || '导入失败'
        }
      } catch (error) {
        importError.value = '文件解析失败: ' + error.message
      } finally {
        importLoading.value = false
      }
    }
    
    reader.onerror = () => {
      importError.value = '文件读取失败'
      importLoading.value = false
    }
    
    reader.readAsText(importFile.value)
  } catch (error) {
    importError.value = '导入失败: ' + error.message
    importLoading.value = false
  }
}

// 切换分类公开/私有状态
const toggleCategoryPublic = async (category) => {
  try {
    // 创建更新后的分类对象
    const updatedCategory = {
      ...category,
      is_public: category.is_public ? 0 : 1
    }
    
    // 调用bookmarkStore的方法更新分类
    const success = await bookmarkStore.updateCategory(updatedCategory)
    
    if (success) {
      // 更新成功，无需额外操作，因为bookmarkStore会自动更新分类列表
    }
  } catch (error) {
    console.error('切换分类状态失败:', error)
  }
}
</script>
