const fetchUrlInfo = async (url) => {
  try {
    const response = await fetch('/api/fetch-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });
    
    if (response.ok) {
      const urlInfo = await response.json();
      console.log('成功抓取URL信息:', urlInfo);
      return urlInfo;
    } else {
      console.error('抓取失败:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('抓取错误:', error);
    return null;
  }
};

// 测试几个不同的URL
const testUrls = [
  'https://www.google.com',
  'https://www.github.com',
  'https://www.baidu.com'
];

async function runTests() {
  console.log('开始测试自动URL信息抓取功能...');
  
  for (const url of testUrls) {
    console.log(`\n测试URL: ${url}`);
    await fetchUrlInfo(url);
  }
  
  console.log('\n测试完成!');
}

runTests();