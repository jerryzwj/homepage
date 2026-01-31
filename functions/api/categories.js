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

export async function onRequestGet(context) {
  // 获取分类列表
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
    const db = env.DB;
    const result = await db.prepare(
      'SELECT * FROM categories WHERE user_id = ? ORDER BY sort ASC'
    ).bind(userId).all();
    
    return new Response(JSON.stringify(result.results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost(context) {
  // 创建分类
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
    const db = env.DB;
    
    // 获取当前最大排序值
    const maxSortResult = await db.prepare(
      'SELECT MAX(sort) as max_sort FROM categories WHERE user_id = ?'
    ).bind(userId).all();
    
    const sort = (maxSortResult.results[0]?.max_sort || 0) + 1;
    
    const result = await db.prepare(
      'INSERT INTO categories (user_id, cate_name, cate_desc, cate_cover, sort, is_public, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
    ).bind(
      userId, 
      body.cate_name, 
      body.cate_desc || '', 
      body.cate_cover || '', 
      sort, 
      body.is_public || 0
    ).run();
    
    return new Response(JSON.stringify({ success: true, id: result.meta.lastInsertRowid }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPut(context) {
  // 更新分类
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
    const db = env.DB;
    
    await db.prepare(
      'UPDATE categories SET cate_name = ?, cate_desc = ?, cate_cover = ?, sort = ?, is_public = ?, update_time = CURRENT_TIMESTAMP WHERE cate_id = ? AND user_id = ?'
    ).bind(
      body.cate_name, 
      body.cate_desc || '', 
      body.cate_cover || '', 
      body.sort, 
      body.is_public || 0,
      body.cate_id,
      userId
    ).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestDelete(context) {
  // 删除分类
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
    const url = new URL(request.url);
    const cateId = url.searchParams.get('id');
    const db = env.DB;
    
    // 先删除分类下的所有收藏
    await db.prepare(
      'DELETE FROM bookmarks WHERE cate_id = ? AND user_id = ?'
    ).bind(cateId, userId).run();
    
    // 再删除分类
    await db.prepare(
      'DELETE FROM categories WHERE cate_id = ? AND user_id = ?'
    ).bind(cateId, userId).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
