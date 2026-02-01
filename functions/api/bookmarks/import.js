// 从请求头获取token
function getTokenFromRequest(request) {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// 验证JWT token
function verifyToken(token) {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload.user_id;
  } catch (error) {
    return null;
  }
}

export async function onRequestPost(context) {
  // 导入书签
  const { request, env } = context;
  
  // 从请求头获取token
  const token = getTokenFromRequest(request);
  const userId = verifyToken(token);
  
  if (!userId) {
    return new Response(JSON.stringify({ error: '未登录' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const body = await request.json();
    const bookmarks = body.bookmarks;
    const db = env.DB;
    
    if (!bookmarks || !Array.isArray(bookmarks)) {
      return new Response(JSON.stringify({ error: '无效的导入数据' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 分类映射，用于快速查找分类ID
    const categoryMap = new Map();
    
    // 获取所有现有分类
    const existingCategories = await db.prepare(
      'SELECT cate_id, cate_name FROM categories WHERE user_id = ?'
    ).bind(userId).all();
    
    // 构建分类映射
    existingCategories.results.forEach(category => {
      categoryMap.set(category.cate_name, category.cate_id);
    });
    
    // 处理每个书签
    for (const bookmark of bookmarks) {
      const { title, url, category: categoryName, description, tags } = bookmark;
      
      // 验证必填字段
      if (!title || !url) {
        continue; // 跳过无效书签
      }
      
      // 确保分类名有默认值
      const safeCategoryName = categoryName || '未分类';
      
      // 检查是否已存在相同URL的书签
      const existingBookmark = await db.prepare(
        'SELECT bookmark_id FROM bookmarks WHERE user_id = ? AND url = ?'
      ).bind(userId, url).all();
      
      if (existingBookmark.results.length > 0) {
        continue; // 跳过重复书签
      }
      
      // 确保分类存在
      let cateId;
      if (categoryMap.has(safeCategoryName)) {
        // 使用现有分类
        cateId = categoryMap.get(safeCategoryName);
      } else {
        // 创建新分类
        const maxSortResult = await db.prepare(
          'SELECT MAX(sort) as max_sort FROM categories WHERE user_id = ?'
        ).bind(userId).all();
        
        const sort = (maxSortResult.results[0]?.max_sort || 0) + 1;
        
        const newCategoryResult = await db.prepare(
          'INSERT INTO categories (user_id, cate_name, cate_desc, cate_cover, sort, is_public, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
        ).bind(
          userId, 
          safeCategoryName, 
          '', 
          '', 
          sort, 
          0
        ).run();
        
        cateId = newCategoryResult.meta.lastInsertRowid;
        categoryMap.set(safeCategoryName, cateId);
      }
      
      // 获取当前分类下的最大排序值
      const maxSortResult = await db.prepare(
        'SELECT MAX(sort) as max_sort FROM bookmarks WHERE user_id = ? AND cate_id = ?'
      ).bind(userId, cateId).all();
      
      const sort = (maxSortResult.results[0]?.max_sort || 0) + 1;
      
      // 插入书签
      await db.prepare(
        'INSERT INTO bookmarks (cate_id, user_id, title, url, icon, description, tags, sort, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
      ).bind(
        cateId, 
        userId, 
        title || '', 
        url || '', 
        '', // 自动抓取图标可以在后续实现
        description || '', 
        tags || '', 
        sort
      ).run();
    }
    
    return new Response(JSON.stringify({ success: true, imported: bookmarks.length }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
