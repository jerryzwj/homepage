import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userId: null,
    username: null,
    avatar: null,
    darkMode: false,
    isLoading: false
  }),
  
  getters: {
    userInfo: (state) => ({
      userId: state.userId,
      username: state.username,
      avatar: state.avatar
    })
  },
  
  actions: {
    async login() {
      // Cloudflare Access会自动处理登录重定向
      // 这里可以添加登录后的处理逻辑
      this.isLoading = true
      try {
        // 登录后获取用户信息
        const response = await fetch('/api/users', {
          method: 'GET',
          credentials: 'include'
        })
        
        if (response.ok) {
          const userData = await response.json()
          this.isLoggedIn = true
          this.userId = userData.user_id
          this.username = userData.username
          this.avatar = userData.avatar
          this.darkMode = userData.dark_mode === 1
          
          // 保存到本地存储
          localStorage.setItem('user', JSON.stringify({
            userId: userData.user_id,
            username: userData.username,
            avatar: userData.avatar
          }))
          
          // 设置黑暗模式
          if (this.darkMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        } else if (response.status === 401) {
          // 用户未登录，清除本地存储
          this.isLoggedIn = false
          this.userId = null
          this.username = null
          this.avatar = null
          localStorage.removeItem('user')
        }
      } catch (error) {
        console.error('登录失败:', error)
        // 发生错误时，确保登录状态为false
        this.isLoggedIn = false
      } finally {
        this.isLoading = false
      }
    },
    
    logout() {
      // 清除用户状态
      this.isLoggedIn = false
      this.userId = null
      this.username = null
      this.avatar = null
      
      // 清除本地存储
      localStorage.removeItem('user')
      
      // 重定向到登录页面（Cloudflare Access会处理）
      window.location.href = '/'
    },
    
    async toggleDarkMode() {
      this.darkMode = !this.darkMode
      
      // 更新DOM
      if (this.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      // 保存到本地存储
      localStorage.setItem('darkMode', this.darkMode ? 'true' : 'false')
      
      // 如果已登录，同步到服务器
      if (this.isLoggedIn) {
        try {
          await fetch('/api/users', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dark_mode: this.darkMode ? 1 : 0 }),
            credentials: 'include'
          })
        } catch (error) {
          console.error('更新黑暗模式失败:', error)
        }
      }
    },
    
    init() {
      // 从本地存储恢复状态
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        this.userId = userData.userId
        this.username = userData.username
        this.avatar = userData.avatar
        this.isLoggedIn = true
      }
      
      // 恢复黑暗模式设置
      const savedDarkMode = localStorage.getItem('darkMode')
      if (savedDarkMode === 'true') {
        this.darkMode = true
        document.documentElement.classList.add('dark')
      } else if (savedDarkMode === 'false') {
        this.darkMode = false
        document.documentElement.classList.remove('dark')
      } else {
        // 跟随系统设置
        this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (this.darkMode) {
          document.documentElement.classList.add('dark')
        }
      }
    }
  }
})
