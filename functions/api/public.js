export async function onRequestGet(context) {
  // 获取公开分类和收藏
  const { request, env } = context;
  const url = new URL(request.url);
  const userId = url.searchParams.get('user_id');
  
  if (!userId) {
    return new Response(JSON.stringify({ error: '缺少用户ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const db = env.DB;
    
    // 获取公开分类
    const categoriesResult = await db.prepare(
      'SELECT * FROM categories WHERE user_id = ? AND is_public = 1 ORDER BY sort ASC'
    ).bind(userId).all();
    
    const categories = categoriesResult.results;
    const categoryIds = categories.map(cat => cat.cate_id);
    
    let bookmarks = [];
    if (categoryIds.length > 0) {
      // 获取公开分类下的收藏
      const placeholders = categoryIds.map(() => '?').join(',');
      const bookmarksResult = await db.prepare(
        `SELECT * FROM bookmarks WHERE user_id = ? AND cate_id IN (${placeholders}) ORDER BY sort ASC`
      ).bind(userId, ...categoryIds).all();
      
      bookmarks = bookmarksResult.results;
    }
    
    return new Response(JSON.stringify({ categories, bookmarks }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
