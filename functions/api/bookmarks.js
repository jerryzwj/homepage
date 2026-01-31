export async function onRequestGet(context) {
  // 获取收藏列表
  const { request, env } = context;
  const userId = request.headers.get('CF-Access-Identity');
  const url = new URL(request.url);
  const cateId = url.searchParams.get('cate_id');
  
  if (!userId) {
    return new Response(JSON.stringify({ error: '未登录' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const db = env.DB;
    let query = 'SELECT * FROM bookmarks WHERE user_id = ?';
    let params = [userId];
    
    if (cateId) {
      query += ' AND cate_id = ?';
      params.push(cateId);
    }
    
    query += ' ORDER BY sort ASC';
    
    const result = await db.prepare(query).bind(...params).all();
    
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
  // 创建收藏
  const { request, env } = context;
  const userId = request.headers.get('CF-Access-Identity');
  
  if (!userId) {
    return new Response(JSON.stringify({ error: '未登录' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const body = await request.json();
    const db = env.DB;
    
    // 检查是否已存在相同URL的收藏
    const existing = await db.prepare(
      'SELECT * FROM bookmarks WHERE user_id = ? AND url = ?'
    ).bind(userId, body.url).all();
    
    if (existing.results.length > 0) {
      return new Response(JSON.stringify({ error: '该链接已收藏' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 获取当前分类下的最大排序值
    const maxSortResult = await db.prepare(
      'SELECT MAX(sort) as max_sort FROM bookmarks WHERE user_id = ? AND cate_id = ?'
    ).bind(userId, body.cate_id).all();
    
    const sort = (maxSortResult.results[0]?.max_sort || 0) + 1;
    
    const result = await db.prepare(
      'INSERT INTO bookmarks (cate_id, user_id, title, url, icon, description, tags, sort, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
    ).bind(
      body.cate_id, 
      userId, 
      body.title, 
      body.url, 
      body.icon || '', 
      body.description || '', 
      body.tags || '', 
      sort
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
  // 更新收藏
  const { request, env } = context;
  const userId = request.headers.get('CF-Access-Identity');
  
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
      'UPDATE bookmarks SET title = ?, url = ?, icon = ?, description = ?, tags = ?, sort = ?, update_time = CURRENT_TIMESTAMP WHERE bookmark_id = ? AND user_id = ?'
    ).bind(
      body.title, 
      body.url, 
      body.icon || '', 
      body.description || '', 
      body.tags || '', 
      body.sort, 
      body.bookmark_id, 
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
  // 删除收藏
  const { request, env } = context;
  const userId = request.headers.get('CF-Access-Identity');
  
  if (!userId) {
    return new Response(JSON.stringify({ error: '未登录' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const url = new URL(request.url);
    const bookmarkId = url.searchParams.get('id');
    const db = env.DB;
    
    await db.prepare(
      'DELETE FROM bookmarks WHERE bookmark_id = ? AND user_id = ?'
    ).bind(bookmarkId, userId).run();
    
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
