-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  username TEXT,
  password TEXT,
  avatar TEXT,
  dark_mode INTEGER DEFAULT 0,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  cate_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  cate_name TEXT,
  cate_desc TEXT,
  cate_cover TEXT,
  sort INTEGER DEFAULT 0,
  is_public INTEGER DEFAULT 0,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 创建收藏表
CREATE TABLE IF NOT EXISTS bookmarks (
  bookmark_id INTEGER PRIMARY KEY AUTOINCREMENT,
  cate_id INTEGER,
  user_id TEXT,
  title TEXT,
  url TEXT,
  icon TEXT,
  description TEXT,
  tags TEXT,
  sort INTEGER DEFAULT 0,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cate_id) REFERENCES categories(cate_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort);
CREATE INDEX IF NOT EXISTS idx_bookmarks_cate_id ON bookmarks(cate_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_url ON bookmarks(url);
CREATE INDEX IF NOT EXISTS idx_bookmarks_sort ON bookmarks(sort);
