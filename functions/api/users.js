// 简单的密码哈希函数（实际生产环境应使用更安全的哈希算法）
function hashPassword(password) {
  return btoa(password + 'salt');
}

// 验证密码
function verifyPassword(password, hashedPassword) {
  return hashPassword(password) === hashedPassword;
}

// 生成简单的JWT token（实际生产环境应使用更安全的JWT库）
function generateToken(userId) {
  const payload = {
    user_id: userId,
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7天过期
  };
  return btoa(JSON.stringify(payload));
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

export async function onRequestGet(context) {
  // 获取用户信息
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
      'SELECT user_id, username, avatar, dark_mode, create_time, update_time FROM users WHERE user_id = ?'
    ).bind(userId).all();
    
    if (result.results.length === 0) {
      return new Response(JSON.stringify({ error: '用户不存在' }), {
        status: 404,
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

export async function onRequestPost(context) {
  // 处理注册和登录
  const { request, env } = context;
  
  try {
    const body = await request.json();
    const db = env.DB;
    
    if (body.action === 'register') {
      // 注册
      const { username, password } = body;
      
      if (!username || !password) {
        return new Response(JSON.stringify({ error: '用户名和密码不能为空' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 检查用户名是否已存在
      const existingUser = await db.prepare(
        'SELECT * FROM users WHERE username = ?'
      ).bind(username).all();
      
      if (existingUser.results.length > 0) {
        return new Response(JSON.stringify({ error: '用户名已存在' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 创建新用户
      const userId = crypto.randomUUID();
      const hashedPassword = hashPassword(password);
      
      await db.prepare(
        'INSERT INTO users (user_id, username, password, dark_mode, create_time, update_time) VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
      ).bind(userId, username, hashedPassword).run();
      
      // 为新用户创建默认分类
      await db.prepare(
        'INSERT INTO categories (user_id, cate_name, cate_desc, cate_cover, sort, create_time, update_time) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
      ).bind(userId, '未分类', '默认分类', '', 1).run();
      
      // 生成token
      const token = generateToken(userId);
      
      return new Response(JSON.stringify({ 
        success: true, 
        token,
        user: {
          user_id: userId,
          username
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (body.action === 'login') {
      // 登录
      const { username, password } = body;
      
      if (!username || !password) {
        return new Response(JSON.stringify({ error: '用户名和密码不能为空' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 查找用户
      const userResult = await db.prepare(
        'SELECT * FROM users WHERE username = ?'
      ).bind(username).all();
      
      if (userResult.results.length === 0) {
        return new Response(JSON.stringify({ error: '用户名或密码错误' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const user = userResult.results[0];
      
      // 验证密码
      if (!verifyPassword(password, user.password)) {
        return new Response(JSON.stringify({ error: '用户名或密码错误' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 生成token
      const token = generateToken(user.user_id);
      
      return new Response(JSON.stringify({ 
        success: true, 
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          avatar: user.avatar,
          dark_mode: user.dark_mode
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: '无效的操作' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
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
    
    // 更新黑暗模式设置
    if (body.dark_mode !== undefined) {
      await db.prepare(
        'UPDATE users SET dark_mode = ?, update_time = CURRENT_TIMESTAMP WHERE user_id = ?'
      ).bind(body.dark_mode, userId).run();
    }
    
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
