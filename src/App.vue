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
          <button v-else @click="userStore.login" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
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
                <span class="text-gray-700 dark:text-gray-300">{{ category.cate_name }}</span>
                <div class="flex items-center gap-2">
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
              <button 
                v-if="userStore.isLoggedIn" 
                class="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                @click="openAddBookmarkModal"
              >
                添加收藏
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" ref="bookmarksContainer">
              <div v-for="bookmark in bookmarkStore.bookmarks" :key="bookmark.bookmark_id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-2">
                  <h3 class="font-medium text-gray-900 dark:text-white">{{ bookmark.title }}</h3>
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
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ bookmark.description }}</p>
                <a :href="bookmark.url" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate block mb-2">{{ bookmark.url }}</a>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Sortable from 'sortablejs'
import { useUserStore } from './stores/user'
import { useBookmarkStore } from './stores/bookmark'
import CategoryModal from './components/CategoryModal.vue'
import BookmarkModal from './components/BookmarkModal.vue'

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

onMounted(() => {
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
</script>
