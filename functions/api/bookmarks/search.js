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
  // 搜索收藏
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
    const query = url.searchParams.get('q');
    const db = env.DB;
    
    if (!query) {
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 构建搜索查询，支持按标题、描述、标签、网址搜索
    const searchQuery = `SELECT * FROM bookmarks WHERE user_id = ? AND (title LIKE ? OR description LIKE ? OR tags LIKE ? OR url LIKE ?) ORDER BY sort ASC`;
    const searchParams = [userId, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];
    
    const result = await db.prepare(searchQuery).bind(...searchParams).all();
    
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
