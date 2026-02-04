// 简单的密码哈希函数（实际生产环境应使用更安全的哈希算法）
function hashPassword(password) {
  return btoa(password + 'salt');
}

// 验证密码
function verifyPassword(password, hashedPassword) {
  return hashPassword(password) === hashedPassword;
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

// 从请求头获取token
function getTokenFromRequest(request) {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export async function onRequestPost(context) {
  // 修改密码
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
    const { old_password, new_password } = body;
    const db = env.DB;
    
    if (!old_password || !new_password) {
      return new Response(JSON.stringify({ error: '旧密码和新密码不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 获取用户当前密码
    const userResult = await db.prepare(
      'SELECT password FROM users WHERE user_id = ?'
    ).bind(userId).all();
    
    if (userResult.results.length === 0) {
      return new Response(JSON.stringify({ error: '用户不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const currentPassword = userResult.results[0].password;
    
    // 验证旧密码
    if (!verifyPassword(old_password, currentPassword)) {
      return new Response(JSON.stringify({ error: '旧密码错误' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 更新密码
    const hashedNewPassword = hashPassword(new_password);
    await db.prepare(
      'UPDATE users SET password = ?, update_time = CURRENT_TIMESTAMP WHERE user_id = ?'
    ).bind(hashedNewPassword, userId).run();
    
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