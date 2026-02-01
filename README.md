# 收藏夹 Homepage 应用 📁

基于 Cloudflare Pages + D1 的个人收藏夹管理应用，支持分类管理、登录验证、访客权限、拖动排序、黑暗模式等功能，为您提供高效、美观的收藏管理体验。

## 🎯 项目特点

- **现代化技术栈**：Vue3 + Vite + Tailwind CSS + Pinia
- **云原生架构**：Cloudflare Pages + Functions + D1
- **响应式设计**：完美适配电脑、平板、手机等多种设备
- **用户友好**：直观的界面设计，流畅的交互体验
- **安全可靠**：用户数据隔离，密码加密存储

## 🛠️ 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Vue | 3.x |
| 构建工具 | Vite | 6.x |
| CSS 框架 | Tailwind CSS | 3.x |
| 状态管理 | Pinia | 2.x |
| 拖拽排序 | SortableJS | 1.15.x |
| 后端 | Cloudflare Pages Functions | - |
| 数据库 | Cloudflare D1 (SQLite) | - |
| 认证 | JWT | - |

## ✨ 核心功能

### 1. 🔐 登录验证与权限控制
- 基于用户名/密码的传统认证系统
- 登录用户拥有全权限，访客仅能浏览公开分类
- 用户数据隔离，确保数据安全
- 密码加密存储，保障用户账户安全

### 2. 📂 分类管理
- 分类的增删改查操作
- 拖拽排序功能，自定义分类顺序
- 公开/私有设置，支持访客浏览

### 3. 📄 收藏卡片管理
- 收藏的增删改查操作
- 自动抓取网页信息（标题、描述、图标）
- 标签管理，支持多标签
- 卡片点击在新标签页打开链接

### 4. 🎨 视觉设计
- 亮色/黑暗模式切换
- 系统主题跟随
- 卡片使用首字母作为图标
- 名称显示不换行，太长自动隐藏
- 容器一行显示5个卡片

### 5. 📱 响应式设计
- 适配电脑、平板、手机等多种设备
- 流畅的布局切换
- 优化的移动端体验

### 6. 🚀 其他功能
- 书签导入/导出功能
- 关键词搜索
- 标签筛选
- 数据持久化存储

## 📁 项目结构

```
homepage/
├── src/                    # 前端源代码
│   ├── components/         # Vue 组件
│   │   ├── AuthModal.vue        # 登录/注册模态框
│   │   ├── BookmarkModal.vue    # 收藏管理模态框
│   │   └── CategoryModal.vue    # 分类管理模态框
│   ├── stores/             # Pinia 状态管理
│   │   ├── user.js              # 用户状态管理
│   │   └── bookmark.js          # 收藏状态管理
│   ├── App.vue             # 主应用组件
│   ├── main.js             # 应用入口
│   └── style.css           # 全局样式
├── functions/              # Cloudflare Pages Functions
│   └── api/                # API 处理函数
│       ├── users.js             # 用户相关 API
│       ├── categories.js        # 分类相关 API
│       ├── fetch-url.js         # URL 信息抓取 API
│       └── bookmarks/           # 收藏相关 API
│           ├── index.js         # 收藏基础操作
│           ├── import.js        # 收藏导入功能
│           └── search.js        # 收藏搜索功能
├── schema.sql              # D1 数据库表结构
├── package.json            # 项目配置和依赖
├── vite.config.js          # Vite 构建配置
├── tailwind.config.js      # Tailwind CSS 配置
├── postcss.config.js       # PostCSS 配置
└── dist/                   # 生产环境构建文件
```

## 📦 安装与部署

### 1. 本地开发

```bash
# 克隆仓库
git clone <repository-url>
cd homepage

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 2. 部署到 Cloudflare Pages

1. **准备代码仓库**
   - 将代码推送到 GitHub/GitLab 仓库

2. **创建 Cloudflare Pages 项目**
   - 登录 Cloudflare 控制台
   - 导航到 Pages，点击「创建项目」
   - 关联你的代码仓库

3. **配置构建设置**
   - 构建命令：`npm run build`
   - 输出目录：`dist`
   - 环境变量：无需额外配置

4. **配置 Cloudflare Pages Functions**
   - 代码已放在 `/functions` 目录，Cloudflare 会自动识别

5. **创建 D1 数据库**
   - 导航到 D1，点击「创建数据库」
   - 命名数据库（如 `bookmark-db`）
   - 执行 `schema.sql` 脚本创建表结构

6. **绑定 D1 数据库**
   - 在 Pages 项目设置中，导航到「函数」→「D1 数据库绑定」
   - 添加绑定，变量名设为 `DB`，选择你创建的数据库

7. **部署完成**
   - 代码推送后，Cloudflare 会自动构建并部署
   - 部署完成后，你可以通过分配的域名访问应用

## 📖 使用说明

### 1. 首次登录
- 访问应用域名，点击右上角的「登录」按钮
- 在登录模态框中点击「没有账号？去注册」链接
- 填写用户名和密码，点击「注册」按钮
- 注册成功后，系统会自动登录并创建用户记录

### 2. 创建分类
- 在左侧侧边栏点击「添加分类」按钮
- 填写分类名称、描述（可选）、封面（可选）
- 设置是否公开（公开分类可被访客浏览）
- 点击「保存」按钮

### 3. 添加收藏
- 在右侧收藏区域点击「添加收藏」按钮
- 输入网址，点击「抓取信息」按钮自动获取网页信息
- 选择分类，添加标签（可选）
- 点击「保存」按钮

### 4. 管理收藏
- 点击收藏卡片上的编辑按钮修改收藏信息
- 点击删除按钮删除收藏
- 拖拽卡片调整排序顺序
- 点击卡片在新标签页打开链接

### 5. 切换主题
- 点击右上角的主题切换按钮
- 系统会记住你的主题偏好

### 6. 分享公开分类
- 将分类设置为公开
- 分享应用链接给其他用户
- 其他用户无需登录即可浏览公开分类

## 🗄️ 数据库表结构

### users 表
| 字段名 | 数据类型 | 描述 |
|--------|---------|------|
| `user_id` | TEXT | 用户唯一标识 |
| `username` | TEXT | 用户名 |
| `password` | TEXT | 密码（加密存储） |
| `avatar` | TEXT | 头像地址 |
| `dark_mode` | INTEGER | 黑暗模式设置 |
| `create_time` | DATETIME | 创建时间 |
| `update_time` | DATETIME | 更新时间 |

### categories 表
| 字段名 | 数据类型 | 描述 |
|--------|---------|------|
| `cate_id` | INTEGER | 分类 ID |
| `user_id` | TEXT | 关联用户 |
| `cate_name` | TEXT | 分类名称 |
| `cate_desc` | TEXT | 分类描述 |
| `cate_cover` | TEXT | 分类封面 |
| `sort` | INTEGER | 排序值 |
| `is_public` | INTEGER | 是否公开 |
| `create_time` | DATETIME | 创建时间 |
| `update_time` | DATETIME | 更新时间 |

### bookmarks 表
| 字段名 | 数据类型 | 描述 |
|--------|---------|------|
| `bookmark_id` | INTEGER | 收藏 ID |
| `cate_id` | INTEGER | 关联分类 |
| `user_id` | TEXT | 关联用户 |
| `title` | TEXT | 网页标题 |
| `url` | TEXT | 网页地址 |
| `icon` | TEXT | 网页图标 |
| `description` | TEXT | 网页描述 |
| `tags` | TEXT | 标签（逗号分隔） |
| `sort` | INTEGER | 排序值 |
| `create_time` | DATETIME | 创建时间 |
| `update_time` | DATETIME | 更新时间 |

## 🔌 API 文档

### 认证机制
- 所有需要认证的API都需要在请求头中添加 `Authorization: Bearer <token>`
- Token 由登录/注册接口返回，有效期为7天

### 1. 用户相关 API

#### 1.1 注册
- **URL**: `/api/users`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "action": "register",
    "username": "用户名",
    "password": "密码"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "token": "JWT token",
    "user": {
      "user_id": "用户ID",
      "username": "用户名"
    }
  }
  ```

#### 1.2 登录
- **URL**: `/api/users`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "action": "login",
    "username": "用户名",
    "password": "密码"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "token": "JWT token",
    "user": {
      "user_id": "用户ID",
      "username": "用户名",
      "avatar": "头像URL",
      "dark_mode": 0
    }
  }
  ```

### 2. 分类相关 API

#### 2.1 获取分类列表
- **URL**: `/api/categories`
- **方法**: `GET`
- **请求头**: `Authorization: Bearer <token>`
- **响应**: 分类列表数组

#### 2.2 创建分类
- **URL**: `/api/categories`
- **方法**: `POST`
- **请求头**: `Authorization: Bearer <token>`
- **请求体**: 分类信息对象

#### 2.3 更新分类
- **URL**: `/api/categories`
- **方法**: `PUT`
- **请求头**: `Authorization: Bearer <token>`
- **请求体**: 分类信息对象

#### 2.4 删除分类
- **URL**: `/api/categories?id=1`
- **方法**: `DELETE`
- **请求头**: `Authorization: Bearer <token>`

### 3. 书签相关 API

#### 3.1 获取书签列表
- **URL**: `/api/bookmarks?cate_id=1`
- **方法**: `GET`
- **请求头**: `Authorization: Bearer <token>`
- **参数**: `cate_id` (可选，指定分类ID)

#### 3.2 创建书签
- **URL**: `/api/bookmarks`
- **方法**: `POST`
- **请求头**: `Authorization: Bearer <token>`
- **请求体**: 书签信息对象

#### 3.3 更新书签
- **URL**: `/api/bookmarks`
- **方法**: `PUT`
- **请求头**: `Authorization: Bearer <token>`
- **请求体**: 书签信息对象

#### 3.4 删除书签
- **URL**: `/api/bookmarks?id=1`
- **方法**: `DELETE`
- **请求头**: `Authorization: Bearer <token>`

#### 3.5 导入书签
- **URL**: `/api/bookmarks/import`
- **方法**: `POST`
- **请求头**: `Authorization: Bearer <token>`
- **请求体**: 书签数组

#### 3.6 搜索书签
- **URL**: `/api/bookmarks/search?q=关键词`
- **方法**: `GET`
- **请求头**: `Authorization: Bearer <token>`
- **参数**: `q` (搜索关键词)

### 4. URL 信息抓取 API

#### 4.1 抓取网页信息
- **URL**: `/api/fetch-url`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "url": "https://example.com"
  }
  ```
- **响应**: 包含标题、描述、图标的对象

## 🔧 后续维护

### 1. 数据备份
- Cloudflare D1 支持定时备份
- 可通过 Cloudflare 控制台查看和恢复备份

### 2. 性能优化
- 前端已配置代码分割和树摇
- 后端已实现数据缓存
- 可根据实际使用情况调整缓存策略

### 3. 功能扩展
- 支持添加批量导入/导出功能
- 可集成更多第三方服务
- 支持添加更多自定义配置选项

## 🚨 故障排查

### 1. 登录问题
- 检查用户名和密码是否正确
- 确认网络连接是否正常

### 2. 数据问题
- 检查 D1 数据库连接状态
- 确认表结构是否正确创建

### 3. 部署问题
- 检查构建日志，确认是否有构建错误
- 确认 Pages Functions 配置是否正确

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 感谢 Vue.js 团队提供优秀的前端框架
- 感谢 Tailwind CSS 团队提供美观的样式系统
- 感谢 Cloudflare 提供强大的云服务
- 感谢所有为开源做出贡献的开发者

---

**享受收藏管理的乐趣！** 🎉
