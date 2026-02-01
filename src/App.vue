<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">收藏夹 Homepage</h1>
        <div class="flex items-center gap-4">
          <button @click="userStore.toggleDarkMode" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
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
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">分类管理</h2>
            <div class="space-y-2" ref="categoriesContainer">
              <!-- 全部选项 -->
              <div 
                class="flex items-center justify-between p-2 rounded bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border border-gray-200 dark:border-gray-600"
                @click="switchCategory(null)"
              >
                <div class="flex items-center gap-2">
                  <span class="text-gray-700 dark:text-gray-300 font-medium">全部</span>
                </div>
              </div>
              <!-- 分类列表 -->
              <div 
                v-for="category in bookmarkStore.categories" 
                :key="category.cate_id" 
                class="flex items-center justify-between p-2 rounded bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border border-gray-200 dark:border-gray-600"
                @click="switchCategory(category.cate_id)"
              >
                <div class="flex items-center gap-2">
                  <span class="text-gray-700 dark:text-gray-300">{{ category.cate_name }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    class="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    @click.stop="openEditCategoryModal(category)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500 dark:text-gray-400"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
                  </button>
                  <button 
                    class="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
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
          
          <!-- 标签容器 -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm p-4 mt-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">标签管理</h2>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in allTags" 
                :key="tag"
                class="px-3 py-1 rounded-full text-sm cursor-pointer transition-colors"
                :class="getTagColorClass(tag)"
                @click="filterByTag(tag)"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- 收藏卡片区域 -->
        <div class="md:col-span-3">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ bookmarkStore.currentCategory ? 
                    bookmarkStore.categories.find(c => c.cate_id === bookmarkStore.currentCategory)?.cate_name : 
                    '所有收藏' 
                }}
              </h2>
              <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div class="flex flex-grow gap-2">
                  <div class="relative flex-grow">
                    <input 
                      type="text" 
                      v-model="searchQuery" 
                      placeholder="搜索收藏..." 
                      class="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                    >
                    <button 
                      class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      @click="clearSearch"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                  <button 
                    class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                    @click="handleSearch"
                  >
                    搜索
                  </button>
                </div>
                <div class="flex gap-2 w-full sm:w-auto">
                  <button 
                    v-if="userStore.isLoggedIn" 
                    class="flex-1 sm:flex-none px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                    @click="openAddBookmarkModal"
                  >
                    添加收藏
                  </button>
                  <button 
                    v-if="userStore.isLoggedIn" 
                    class="flex-1 sm:flex-none px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors"
                    @click="openImportModal"
                  >
                    导入收藏
                  </button>
                  <button 
                    v-if="userStore.isLoggedIn" 
                    class="flex-1 sm:flex-none px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors"
                    @click="openExportModal"
                  >
                    导出收藏
                  </button>
                </div>
              </div>
            </div>
            <!-- 按分类分组显示卡片 -->
            <div v-if="bookmarkStore.categories.length > 0" class="space-y-8" ref="bookmarksContainer">
              <div v-for="category in bookmarkStore.categories" :key="category.cate_id" class="space-y-3">
                <!-- 分类标题 -->
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500 dark:text-purple-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ category.cate_name }}</h3>
                  <span class="text-sm text-gray-500 dark:text-gray-400">({{ bookmarkStore.bookmarks.filter(b => b.cate_id === category.cate_id).length }}个)</span>
                </div>
                <!-- 分类卡片组 -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <div v-for="bookmark in bookmarkStore.bookmarks.filter(b => b.cate_id === category.cate_id)" :key="bookmark.bookmark_id" class="bg-blue-100 dark:bg-purple-900/30 rounded-xl p-3 hover:shadow-md transition-shadow border border-blue-200 dark:border-purple-700 cursor-pointer"
                       @click="window.open(bookmark.url, '_blank', 'noopener,noreferrer')">
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex items-center gap-2 flex-1 min-w-0">
                        <div class="w-6 h-6 rounded-full flex items-center justify-center bg-blue-200 dark:bg-purple-800 text-blue-700 dark:text-purple-200 text-xs font-medium">
                          {{ bookmark.title.charAt(0).toUpperCase() }}
                        </div>
                        <h3 class="font-bold text-sm text-gray-900 dark:text-white truncate whitespace-nowrap overflow-hidden" v-html="highlightKeywords(bookmark.title, searchQuery)"></h3>
                      </div>
                      <div v-if="userStore.isLoggedIn" class="flex items-center gap-1">
                        <button 
                          class="p-1 hover:bg-blue-200 dark:hover:bg-purple-800 rounded"
                          @click.stop="openEditBookmarkModal(bookmark)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500 dark:text-gray-400"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
                        </button>
                        <button 
                          class="p-1 hover:bg-blue-200 dark:hover:bg-purple-800 rounded"
                          @click.stop="deleteBookmark(bookmark.bookmark_id)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </div>
                    </div>
                    <a :href="bookmark.url" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-600 dark:text-gray-400 truncate block" v-html="highlightKeywords(bookmark.url, searchQuery)"></a>
                  </div>
                </div>
              </div>
              <!-- 未分类卡片 -->
              <div v-if="bookmarkStore.bookmarks.filter(b => !b.cate_id || b.cate_id === '').length > 0" class="space-y-3">
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500 dark:text-purple-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">未分类</h3>
                  <span class="text-sm text-gray-500 dark:text-gray-400">({{ bookmarkStore.bookmarks.filter(b => !b.cate_id || b.cate_id === '').length }}个)</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <div v-for="bookmark in bookmarkStore.bookmarks.filter(b => !b.cate_id || b.cate_id === '')" :key="bookmark.bookmark_id" class="bg-blue-100 dark:bg-purple-900/30 rounded-xl p-3 hover:shadow-md transition-shadow border border-blue-200 dark:border-purple-700 cursor-pointer"
                       @click="window.open(bookmark.url, '_blank', 'noopener,noreferrer')">
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex items-center gap-2 flex-1 min-w-0">
                        <div class="w-6 h-6 rounded-full flex items-center justify-center bg-blue-200 dark:bg-purple-800 text-blue-700 dark:text-purple-200 text-xs font-medium">
                          {{ bookmark.title.charAt(0).toUpperCase() }}
                        </div>
                        <h3 class="font-bold text-sm text-gray-900 dark:text-white truncate whitespace-nowrap overflow-hidden" v-html="highlightKeywords(bookmark.title, searchQuery)"></h3>
                      </div>
                      <div v-if="userStore.isLoggedIn" class="flex items-center gap-1">
                        <button 
                          class="p-1 hover:bg-blue-200 dark:hover:bg-purple-800 rounded"
                          @click.stop="openEditBookmarkModal(bookmark)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500 dark:text-gray-400"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
                        </button>
                        <button 
                          class="p-1 hover:bg-blue-200 dark:hover:bg-purple-800 rounded"
                          @click.stop="deleteBookmark(bookmark.bookmark_id)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </div>
                    </div>
                    <a :href="bookmark.url" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-600 dark:text-gray-400 truncate block" v-html="highlightKeywords(bookmark.url, searchQuery)"></a>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="bookmarkStore.bookmarks.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" ref="bookmarksContainer">
              <div v-for="bookmark in bookmarkStore.bookmarks" :key="bookmark.bookmark_id" class="bg-blue-100 dark:bg-purple-900/30 rounded-xl p-3 hover:shadow-md transition-shadow border border-blue-200 dark:border-purple-700 cursor-pointer"
                   @click="window.open(bookmark.url, '_blank', 'noopener,noreferrer')">
                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center gap-2 flex-1 min-w-0">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center bg-blue-200 dark:bg-purple-800 text-blue-700 dark:text-purple-200 text-xs font-medium">
                      {{ bookmark.title.charAt(0).toUpperCase() }}
                    </div>
                    <h3 class="font-bold text-sm text-gray-900 dark:text-white truncate whitespace-nowrap overflow-hidden" v-html="highlightKeywords(bookmark.title, searchQuery)"></h3>
                  </div>
                  <div v-if="userStore.isLoggedIn" class="flex items-center gap-1">
                    <button 
                      class="p-1 hover:bg-blue-200 dark:hover:bg-purple-800 rounded"
                      @click.stop="openEditBookmarkModal(bookmark)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500 dark:text-gray-400"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
                    </button>
                    <button 
                      class="p-1 hover:bg-blue-200 dark:hover:bg-purple-800 rounded"
                      @click.stop="deleteBookmark(bookmark.bookmark_id)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                </div>
                <a :href="bookmark.url" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-600 dark:text-gray-400 truncate block" v-html="highlightKeywords(bookmark.url, searchQuery)"></a>
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
    
    <!-- 导出模态框 -->
    <div v-if="isExportModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-md">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">导出收藏</h3>
          <button @click="closeExportModal" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="p-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            导出收藏为HTML文件，可在Edge浏览器中导入。导出过程会包含所有分类和书签。
          </p>
          <div v-if="exportError" class="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
            {{ exportError }}
          </div>
          <div class="flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeExportModal" 
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
            <button 
              type="button" 
              @click="handleExport" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              开始导出
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

// 标签相关状态
const selectedTag = ref(null)

// 计算所有标签
const allTags = computed(() => {
  const tagsSet = new Set()
  bookmarkStore.bookmarks.forEach(bookmark => {
    if (bookmark.tags) {
      bookmark.tags.split(',').forEach(tag => {
        const trimmedTag = tag.trim()
        if (trimmedTag) {
          tagsSet.add(trimmedTag)
        }
      })
    }
  })
  return Array.from(tagsSet)
})

// 导入模态框状态
const isImportModalOpen = ref(false)
const importFile = ref(null)
const importLoading = ref(false)
const importError = ref('')

// 导出模态框状态
const isExportModalOpen = ref(false)
const exportError = ref('')

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
  // 重置表单状态
  isEditingBookmark.value = false
  currentBookmark.value = null
  // 打开模态框
  isBookmarkModalOpen.value = true
}

// 打开编辑收藏模态框
const openEditBookmarkModal = (bookmark) => {
  // 设置编辑状态
  isEditingBookmark.value = true
  // 复制bookmark对象，避免直接修改原始数据
  currentBookmark.value = { ...bookmark }
  // 打开模态框
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
  // 清除标签筛选，确保搜索结果不受标签影响
  selectedTag.value = null
  
  if (searchQuery.value) {
    const success = await bookmarkStore.searchBookmarks(searchQuery.value)
    if (!success) {
      console.error('搜索失败')
      // 搜索失败时，清空书签列表，避免显示所有书签
      bookmarkStore.bookmarks = []
    }
  } else {
    await bookmarkStore.fetchBookmarks(bookmarkStore.currentCategory)
  }
}

// 清除搜索
const clearSearch = async () => {
  searchQuery.value = ''
  selectedTag.value = null
  await bookmarkStore.fetchBookmarks(bookmarkStore.currentCategory)
}

// 清除标签筛选
const clearTagFilter = async () => {
  selectedTag.value = null
  await bookmarkStore.fetchBookmarks(bookmarkStore.currentCategory)
}

// 为标签生成不同的背景颜色
const getTagColorClass = (tag) => {
  // 基于标签名的哈希值生成颜色索引
  const colors = [
    'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
    'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
    'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200'
  ]
  
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colorIndex = Math.abs(hash) % colors.length
  
  // 如果是选中的标签，添加选中样式
  if (selectedTag.value === tag) {
    return colors[colorIndex] + ' ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400'
  }
  
  return colors[colorIndex]
}

// 按标签筛选
const filterByTag = async (tag) => {
  selectedTag.value = selectedTag.value === tag ? null : tag
  
  if (selectedTag.value) {
    // 筛选包含该标签的书签
    const filteredBookmarks = bookmarkStore.bookmarks.filter(bookmark => {
      if (!bookmark.tags) return false
      return bookmark.tags.split(',').some(t => t.trim() === tag)
    })
    
    // 直接更新bookmarkStore中的bookmarks
    bookmarkStore.bookmarks = filteredBookmarks
  } else {
    // 清除筛选，重新获取数据
    await bookmarkStore.fetchBookmarks(bookmarkStore.currentCategory)
  }
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
        
        // 构建导入数据
        const importData = []
        
        // 提取文件夹（分类）信息
        // 查找所有DT标签，然后过滤出包含H3的（分类）
        const dtNodes = doc.querySelectorAll('dt')
        dtNodes.forEach(dtNode => {
          const h3Node = dtNode.querySelector('h3')
          if (h3Node) {
            const categoryName = h3Node.textContent
            
            // 找到该分类对应的DL标签（包含书签）
            let nextNode = dtNode.nextElementSibling
            while (nextNode) {
              if (nextNode.tagName === 'DL') {
                // 在DL中查找所有书签链接
                const links = nextNode.querySelectorAll('a')
                links.forEach(link => {
                  const title = link.textContent
                  const url = link.getAttribute('href')
                  if (title && url) {
                    importData.push({
                      title: title,
                      url: url,
                      category: categoryName,
                      description: link.getAttribute('title') || '',
                      tags: ''
                    })
                  }
                })
                break
              } else if (nextNode.tagName === 'DT' && nextNode.querySelector('h3')) {
                // 遇到下一个分类，停止当前分类的处理
                break
              }
              nextNode = nextNode.nextElementSibling
            }
          }
        })
        
        // 处理根级书签（不在任何分类中的书签）
        const allLinks = doc.querySelectorAll('a')
        allLinks.forEach(link => {
          const title = link.textContent
          const url = link.getAttribute('href')
          if (title && url) {
            // 检查是否已经在分类中处理过
            const isAlreadyProcessed = importData.some(item => item.url === url)
            if (!isAlreadyProcessed) {
              importData.push({
                title: title,
                url: url,
                category: '未分类',
                description: link.getAttribute('title') || '',
                tags: ''
              })
            }
          }
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

// 打开导出模态框
const openExportModal = () => {
  isExportModalOpen.value = true
  exportError.value = ''
}

// 关闭导出模态框
const closeExportModal = () => {
  isExportModalOpen.value = false
  exportError.value = ''
}

// 处理导出
const handleExport = async () => {
  try {
    // 确保所有数据已加载
    await loadData()
    
    // 构建HTML内容
    let htmlContent = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>`
    
    // 按分类组织书签
    const categories = bookmarkStore.categories
    const bookmarks = bookmarkStore.bookmarks
    
    // 为每个分类生成HTML
    categories.forEach(category => {
      // 找到该分类下的所有书签
      const categoryBookmarks = bookmarks.filter(bookmark => bookmark.cate_id === category.cate_id)
      
      if (categoryBookmarks.length > 0) {
        htmlContent += `<DT><H3>${category.cate_name}</H3>
<DL><p>`
        
        // 为每个书签生成HTML
        categoryBookmarks.forEach(bookmark => {
          htmlContent += `<DT><A HREF="${bookmark.url}"${bookmark.description ? ` TITLE="${bookmark.description}"` : ''}>${bookmark.title}</A>
`
        })
        
        htmlContent += `</DL><p>
`
      }
    })
    
    // 处理未分类的书签
    const uncategorizedBookmarks = bookmarks.filter(bookmark => {
      return !categories.some(category => category.cate_id === bookmark.cate_id)
    })
    
    if (uncategorizedBookmarks.length > 0) {
      htmlContent += `<DT><H3>未分类</H3>
<DL><p>`
      
      uncategorizedBookmarks.forEach(bookmark => {
        htmlContent += `<DT><A HREF="${bookmark.url}"${bookmark.description ? ` TITLE="${bookmark.description}"` : ''}>${bookmark.title}</A>
`
      })
      
      htmlContent += `</DL><p>
`
    }
    
    htmlContent += `</DL><p>`
    
    // 创建Blob对象并下载
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `favorites_${new Date().toISOString().split('T')[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    // 导出成功，关闭模态框
    closeExportModal()
  } catch (error) {
    exportError.value = '导出失败: ' + error.message
  }
}


</script>
