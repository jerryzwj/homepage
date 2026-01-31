export async function onRequestPost(context) {
  const { request } = context;
  
  try {
    const body = await request.json();
    const url = body.url;
    
    if (!url) {
      return new Response(JSON.stringify({ error: '缺少URL参数' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 调用fetchUrlInfo函数抓取URL信息
    const urlInfo = await fetchUrlInfo(url);
    
    return new Response(JSON.stringify(urlInfo), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function fetchUrlInfo(url) {
  try {
    // 第一步：尝试直接抓取网页内容
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // 提取标题
    let title = extractTitle(html);
    
    // 提取描述
    let description = extractDescription(html);
    
    // 提取图标
    let icon = extractFavicon(html, url);
    
    // 第二步：如果没有提取到信息，使用备用方案
    if (!title) {
      title = new URL(url).hostname;
    }
    
    if (!description) {
      description = `来自 ${new URL(url).hostname} 的链接`;
    }
    
    if (!icon) {
      icon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`;
    }
    
    return {
      title,
      description,
      icon
    };
  } catch (error) {
    // 第三步：如果抓取失败，使用默认值
    console.error('抓取URL信息失败:', error);
    const hostname = new URL(url).hostname;
    return {
      title: hostname,
      description: `来自 ${hostname} 的链接`,
      icon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
    };
  }
}

function extractTitle(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  return null;
}

function extractDescription(html) {
  const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i);
  if (metaMatch) {
    return metaMatch[1].trim();
  }
  return null;
}

function extractFavicon(html, baseUrl) {
  // 尝试从link标签提取favicon
  const linkMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([\s\S]*?)["'][^>]*>/i);
  if (linkMatch) {
    let faviconUrl = linkMatch[1];
    // 如果是相对路径，转换为绝对路径
    if (!faviconUrl.startsWith('http')) {
      const base = new URL(baseUrl);
      faviconUrl = new URL(faviconUrl, base).href;
    }
    return faviconUrl;
  }
  // 尝试从meta标签提取apple-touch-icon
  const appleMatch = html.match(/<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([\s\S]*?)["'][^>]*>/i);
  if (appleMatch) {
    let faviconUrl = appleMatch[1];
    if (!faviconUrl.startsWith('http')) {
      const base = new URL(baseUrl);
      faviconUrl = new URL(faviconUrl, base).href;
    }
    return faviconUrl;
  }
  return null;
}