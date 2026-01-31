export async function onRequestGet(context) {
  // 获取用户信息
  const { request, env } = context;
  
  // 从请求头获取用户ID（Cloudflare Access）
  const userId = request.headers.get('CF-Access-Identity');
  
  if (!userId) {
    return new Response(JSON.stringify({ error: '未登录' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const db = env.DB;
    const result = await db.prepare(
      'SELECT * FROM users WHERE user_id = ?'
    ).bind(userId).all();
    
    if (result.results.length === 0) {
      // 如果用户不存在，创建新用户
      await db.prepare(
        'INSERT INTO users (user_id, dark_mode, create_time, update_time) VALUES (?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
      ).bind(userId).run();
      
      return new Response(JSON.stringify({ 
        user_id: userId, 
        dark_mode: 0,
        create_time: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(result.results[0]), {
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
  // 更新用户信息
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
      'UPDATE users SET dark_mode = ?, update_time = CURRENT_TIMESTAMP WHERE user_id = ?'
    ).bind(body.dark_mode, userId).run();
    
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
