import { defineStore } from 'pinia'

export const useBookmarkStore = defineStore('bookmark', {
  state: () => ({
    categories: [],
    bookmarks: [],
    currentCategory: null,
    isLoading: false
  }),
  
  getters: {
    currentCategoryBookmarks: (state) => {
      if (!state.currentCategory) {
        return state.bookmarks
      }
      return state.bookmarks.filter(bookmark => bookmark.cate_id === state.currentCategory)
    }
  },
  
  actions: {
    async fetchCategories() {
      this.isLoading = true
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/categories', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        })
        
        if (response.ok) {
          this.categories = await response.json()
        }
      } catch (error) {
        console.error('获取分类失败:', error)
      } finally {
        this.isLoading = false
      }
    },
    
    async fetchBookmarks(cateId = null) {
      this.isLoading = true
      try {
        let url = '/api/bookmarks'
        if (cateId) {
          url += `?cate_id=${cateId}`
        }
        
        const token = localStorage.getItem('token')
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        })
        
        if (response.ok) {
          this.bookmarks = await response.json()
          this.currentCategory = cateId
        }
      } catch (error) {
        console.error('获取收藏失败:', error)
      } finally {
        this.isLoading = false
      }
    },
    
    async createCategory(categoryData) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(categoryData),
          credentials: 'include'
        })
        
        if (response.ok) {
          await this.fetchCategories()
          return true
        }
        return false
      } catch (error) {
        console.error('创建分类失败:', error)
        return false
      }
    },
    
    async updateCategory(categoryData) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/categories', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(categoryData),
          credentials: 'include'
        })
        
        if (response.ok) {
          await this.fetchCategories()
          return true
        }
        return false
      } catch (error) {
        console.error('更新分类失败:', error)
        return false
      }
    },
    
    async deleteCategory(cateId) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/categories?id=${cateId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        })
        
        if (response.ok) {
          await this.fetchCategories()
          await this.fetchBookmarks()
          return true
        }
        return false
      } catch (error) {
        console.error('删除分类失败:', error)
        return false
      }
    },
    
    async createBookmark(bookmarkData) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bookmarkData),
          credentials: 'include'
        })
        
        if (response.ok) {
          await this.fetchBookmarks(this.currentCategory)
          return true
        }
        return false
      } catch (error) {
        console.error('创建收藏失败:', error)
        return false
      }
    },
    
    async updateBookmark(bookmarkData) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/bookmarks', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bookmarkData),
          credentials: 'include'
        })
        
        if (response.ok) {
          await this.fetchBookmarks(this.currentCategory)
          return true
        }
        return false
      } catch (error) {
        console.error('更新收藏失败:', error)
        return false
      }
    },
    
    async deleteBookmark(bookmarkId) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/bookmarks?id=${bookmarkId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        })
        
        if (response.ok) {
          await this.fetchBookmarks(this.currentCategory)
          return true
        }
        return false
      } catch (error) {
        console.error('删除收藏失败:', error)
        return false
      }
    },
    
    async searchBookmarks(query) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/bookmarks/search?q=${encodeURIComponent(query)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        })
        
        if (response.ok) {
          this.bookmarks = await response.json()
          return true
        }
        return false
      } catch (error) {
        console.error('搜索收藏失败:', error)
        return false
      }
    },
    
    async updateBookmarkOrder(bookmarks) {
      // 批量更新收藏排序
      try {
        // 这里可以实现批量更新逻辑
        // 为了简化，我们逐个更新
        for (let i = 0; i < bookmarks.length; i++) {
          await this.updateBookmark({
            ...bookmarks[i],
            sort: i
          })
        }
        return true
      } catch (error) {
        console.error('更新收藏排序失败:', error)
        return false
      }
    },
    
    async updateCategoryOrder(categories) {
      // 批量更新分类排序
      try {
        for (let i = 0; i < categories.length; i++) {
          await this.updateCategory({
            ...categories[i],
            sort: i
          })
        }
        return true
      } catch (error) {
        console.error('更新分类排序失败:', error)
        return false
      }
    }
  }
})
