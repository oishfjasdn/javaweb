let allNews = []; // 存储所有新闻数据
let categories = []; // 存储所有分类数据

document.addEventListener('DOMContentLoaded', function() {
    // 获取分类数据
    fetch('http://localhost:9090/selectAllType')
        .then(response => response.json())
        .then(data => {
            if (data.code === "200") {
                categories = data.data;
                console.log('获取到的分类数据:', categories);
                renderCategories(categories);
                // 获取新闻数据
                return fetch('http://localhost:9090/selectAll');
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === "200") {
                allNews = data.data;
                console.log('获取到的新闻数据:', allNews);
                renderHomePage(); // 渲染首页
            }
        })
        .catch(error => console.error('Error:', error));

    // 修改搜索表单提交事件
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单默认提交
        
        const searchInput = this.querySelector('input[name="searchInput"]');
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm) {
            console.log('搜索词:', searchTerm); // 调试用
            searchNews(searchTerm);
        }
    });

    initializeAds();  // 保留新的广告初始化
});

function renderCategories(categories) {
    const nav = document.getElementById('categoryNav');
    const ul = document.createElement('ul');
    ul.className = 'nav-list';
    
    // 添加"首页"
    ul.innerHTML = `
        <li><a href="#" data-category="home" class="active">首页</a></li>
    `;
    
    // 添加其他分类
    categories.forEach(category => {
        ul.innerHTML += `
            <li><a href="#" data-category="${category.id}">${category.name}</a></li>
        `;
    });
    
    nav.appendChild(ul);

    // 分类点击事件
    ul.addEventListener('click', function(e) {
        e.preventDefault();
        if (e.target.tagName === 'A') {
            const categoryId = e.target.getAttribute('data-category');
            // 移除所有active类
            ul.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            // 添加active类到被点击的元素
            e.target.classList.add('active');
            
            if (categoryId === 'home') {
                renderHomePage();
            } else {
                filterNewsByCategory(categoryId);
            }
        }
    });
}

function filterNewsByCategory(categoryId) {
    console.log('当前选择的分类ID:', categoryId);
    console.log('所有新闻数据:', allNews);
    console.log('所有分类数据:', categories);

    const filteredNews = categoryId === 'all' 
        ? allNews 
        : allNews.filter(news => {
            console.log(`比较: 新闻typeId(${news.typeId}) vs 分类id(${categoryId})`);
            // 确保两个值都转换为数字进行比较
            const result = Number(news.typeId) === Number(categoryId);
            console.log('比较结果:', result);
            return result;
        });
    
    console.log('筛选后的新闻:', filteredNews);
    renderNews(filteredNews);
}

function renderNews(news) {
    const mainContent = document.querySelector('.main-content');
    
    if (news.length === 0) {
        mainContent.innerHTML = '<div class="no-news">该分类下暂无新闻</div>';
        return;
    }

    let newsHTML = `
        <div class="featured-news">
            <div class="main-news">
                ${news.length > 0 ? createNewsCard(news[0], true) : ''}
            </div>
            <div class="side-news">
                ${news.slice(1, 4).map(item => createNewsCard(item)).join('')}
            </div>
        </div>
        <div class="news-list">
            ${news.slice(4).map(item => createNewsCard(item)).join('')}
        </div>
    `;

    mainContent.innerHTML = newsHTML;

    // 为所有新闻卡片添加点击事件
    document.querySelectorAll('.news-item').forEach(item => {
        item.addEventListener('click', function() {
            const newsId = this.getAttribute('data-id');
            showNewsDetail(newsId);
        });
    });
}

function createNewsCard(news, isFeatured = false) {
    console.log(`创建新闻卡片: 新闻ID=${news.id}, typeId=${news.typeId}`);
    // 打印当前新闻的分类匹配情况
    const category = categories.find(cat => {
        console.log(`比较分类: 新闻typeId=${news.typeId} vs 分类id=${cat.id}`);
        return Number(cat.id) === Number(news.typeId);
    });
    
    const categoryName = category ? category.name : '未分类';
    console.log(`新闻${news.id}的分类名称:`, categoryName);

    return `
        <div class="news-item ${isFeatured ? 'featured' : ''}" data-id="${news.id}">
            ${news.image ? `<img src="${news.image}" alt="${news.title}">` : ''}
            <div class="category-tag">${categoryName}</div>
            <h3>${news.title}</h3>
        </div>
    `;
}

function showNewsDetail(newsId) {
    const news = allNews.find(n => n.id === parseInt(newsId));
    if (!news) return;

    const categoryName = categories.find(cat => cat.id === news.typeId)?.name || '未分类';
    
    const detailHTML = `
        <div class="news-detail">
            <button class="back-button" onclick="backToList()">返回列表</button>
            <div class="news-header">
                <h2>${news.title}</h2>
                <div class="news-meta">
                    <span class="category">${categoryName}</span>
                </div>
            </div>
            ${news.image ? `<img src="${news.image}" alt="${news.title}" class="detail-image">` : ''}
            <div class="news-content">
                <p>${news.content}</p>
            </div>
        </div>
    `;

    document.querySelector('.main-content').innerHTML = detailHTML;
}

function backToList() {
    // 返回新闻列表，显示当前分类的新闻
    const currentCategory = document.querySelector('.nav-list a.active');
    const categoryId = currentCategory 
        ? currentCategory.getAttribute('data-category') 
        : 'all';
    filterNewsByCategory(categoryId);
}

// 修改搜索函数
function searchNews(title) {
    // 使用 selectAll 接口获取所有新闻并进行搜索
    fetch('http://localhost:9090/selectAll')
        .then(response => response.json())
        .then(data => {
            if (data.code === "200") {
                // 在所有新闻中搜索匹配的标题
                const searchResults = data.data.filter(news => 
                    news.title.toLowerCase().includes(title.toLowerCase())
                );

                const mainContent = document.querySelector('.main-content');
                
                if (searchResults.length > 0) {
                    // 显示搜索结果
                    renderNews(searchResults);
                    
                    // 添加搜索结果提示
                    const searchInfo = document.createElement('div');
                    searchInfo.className = 'search-info';
                    searchInfo.innerHTML = `
                        <div class="search-result-header">
                            <span>搜索："${title}" (${searchResults.length}条结果)</span>
                            <button class="clear-search" onclick="clearSearch()">清除搜索</button>
                        </div>
                    `;
                    mainContent.insertBefore(searchInfo, mainContent.firstChild);
                } else {
                    // 没有搜索结果
                    mainContent.innerHTML = `
                        <div class="search-info">
                            <div class="search-result-header">
                                <span>搜索："${title}"</span>
                                <button class="clear-search" onclick="clearSearch()">清除搜索</button>
                            </div>
                        </div>
                        <div class="no-results">
                            <p>未找到相关新闻</p>
                        </div>
                    `;
                }
            }
        })
        .catch(error => {
            console.error('搜索出错:', error);
            const mainContent = document.querySelector('.main-content');
            mainContent.innerHTML = `
                <div class="error-message">
                    搜索失败，请稍后重试
                    <button class="clear-search" onclick="clearSearch()">返回</button>
                </div>
            `;
        });
}

// 修改首页渲染函数
function renderHomePage() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = ''; // 清空内容

    // 为每个分类创建一个新闻块
    categories.forEach(category => {
        // 筛选该分类下的新闻
        const categoryNews = allNews.filter(news => 
            Number(news.typeId) === Number(category.id)
        ).slice(0, 7); // 只取前7条

        if (categoryNews.length > 0) {
            // 创建分类新闻块
            const categoryBlock = document.createElement('div');
            categoryBlock.className = 'category-block';
            categoryBlock.innerHTML = `
                <div class="category-header">
                    <h2>${category.name}</h2>
                    <a href="#" class="more-link" data-category="${category.id}">更多 ></a>
                </div>
                <div class="news-list">
                    ${categoryNews.map(news => `
                        <div class="news-item-simple" data-id="${news.id}">
                            <h3>${news.title}</h3>
                        </div>
                    `).join('')}
                </div>
            `;
            mainContent.appendChild(categoryBlock);
        }
    });

    // 添加"更多"链接的点击事件
    document.querySelectorAll('.more-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const categoryId = e.target.getAttribute('data-category');
            // 触发分类导航的点击
            document.querySelector(`.nav-list a[data-category="${categoryId}"]`).click();
        });
    });

    // 添加新闻标题的点击事件
    document.querySelectorAll('.news-item-simple').forEach(item => {
        item.addEventListener('click', function() {
            const newsId = this.getAttribute('data-id');
            showNewsDetail(newsId);
        });
    });
}

// 修改广告初始化函数，为每个广告位置获取不同的广告
function initializeAds() {
    // 顶部横幅广告
    fetch('http://ads.wztj.net:8000/Servletclass-1.0-SNAPSHOT/randomAd')
        .then(response => response.json())
        .then(adData => {
            renderHeaderBanner(adData);
        })
        .catch(error => console.error('Error loading header banner ad:', error));

    // 浮动广告
    fetch('http://ads.wztj.net:8000/Servletclass-1.0-SNAPSHOT/randomAd')
        .then(response => response.json())
        .then(adData => {
            renderFloatingAd(adData);
        })
        .catch(error => console.error('Error loading floating ad:', error));

    // 滚动文字广告
    fetch('http://ads.wztj.net:8000/Servletclass-1.0-SNAPSHOT/randomAd')
        .then(response => response.json())
        .then(adData => {
            renderScrollingText(adData);
        })
        .catch(error => console.error('Error loading scrolling text ad:', error));

    // 侧边栏广告
    fetch('http://ads.wztj.net:8000/Servletclass-1.0-SNAPSHOT/randomAd')
        .then(response => response.json())
        .then(adData => {
            renderSidebarAd(adData);
        })
        .catch(error => console.error('Error loading sidebar ad:', error));
}

// 重新添加顶部横幅广告渲染函数
function renderHeaderBanner(adData) {
    const banner = document.createElement('div');
    banner.className = 'header-banner';
    banner.innerHTML = `
        <div class="banner-content ad-container">
            <span class="ad-label">广告</span>
            <button class="ad-close-btn">×</button>
            <img src="${adData.imageUrl}" alt="${adData.title}" class="banner-image">
            <div class="banner-text">
                <h3>${adData.title}</h3>
            </div>
        </div>
    `;
    
    const bannerContent = banner.querySelector('.banner-content');
    // 修改点击事件处理
    bannerContent.onclick = (e) => {
        if (!e.target.closest('.ad-close-btn')) {
            showAdDetails(adData.title, adData.imageUrl, adData.detailPage);
        }
    };
    
    banner.querySelector('.ad-close-btn').onclick = (e) => {
        e.stopPropagation();
        banner.remove();
    };
    
    const nav = document.getElementById('categoryNav');
    nav.parentNode.insertBefore(banner, nav.nextSibling);
}

// 浮动广告
function renderFloatingAd(adData) {
    const floatingAd = document.createElement('div');
    floatingAd.className = 'floating-ad';
    floatingAd.innerHTML = `
        <div class="floating-content ad-container">
            <span class="ad-label">广告</span>
            <button class="ad-close-btn">×</button>
            <img src="${adData.imageUrl}" alt="${adData.title}" class="floating-image">
            <div class="floating-text">
                <h4>${adData.title}</h4>
            </div>
        </div>
    `;
    
    const floatingContent = floatingAd.querySelector('.floating-content');
    // 修改点击事件处理
    floatingContent.onclick = (e) => {
        if (!e.target.closest('.ad-close-btn')) {
            showAdDetails(adData.title, adData.imageUrl, adData.detailPage);
        }
    };
    
    floatingAd.querySelector('.ad-close-btn').onclick = (e) => {
        e.stopPropagation();
        floatingAd.remove();
    };
    
    document.body.appendChild(floatingAd);
}

// 滚动文字广告
function renderScrollingText(adData) {
    const scrollText = document.createElement('div');
    scrollText.className = 'scrolling-text ad-container';
    scrollText.innerHTML = `
        <span class="ad-label">广告</span>
        <button class="ad-close-btn">×</button>
        <div class="scroll-content">
            <span>${adData.title}</span>
        </div>
    `;
    
    // 修改点击事件处理
    scrollText.onclick = (e) => {
        if (!e.target.closest('.ad-close-btn')) {
            showAdDetails(adData.title, adData.imageUrl, adData.detailPage);
        }
    };
    
    scrollText.querySelector('.ad-close-btn').onclick = (e) => {
        e.stopPropagation();
        scrollText.remove();
    };
    
    document.querySelector('.top-header').appendChild(scrollText);
}

// 侧边栏广告
function renderSidebarAd(adData) {
    const sidebarAd = document.createElement('div');
    sidebarAd.className = 'sidebar-ad';
    sidebarAd.innerHTML = `
        <div class="sidebar-content ad-container">
            <span class="ad-label">广告</span>
            <button class="ad-close-btn">×</button>
            <img src="${adData.imageUrl}" alt="${adData.title}" class="sidebar-image">
            <h4>${adData.title}</h4>
        </div>
    `;
    
    const sidebarContent = sidebarAd.querySelector('.sidebar-content');
    // 修改点击事件处理
    sidebarContent.onclick = (e) => {
        if (!e.target.closest('.ad-close-btn')) {
            showAdDetails(adData.title, adData.imageUrl, adData.detailPage);
        }
    };
    
    sidebarAd.querySelector('.ad-close-btn').onclick = (e) => {
        e.stopPropagation();
        sidebarAd.remove();
    };
    
    document.querySelector('.main-content').appendChild(sidebarAd);
}

function showAdDetails(title, imageUrl, detailPage) {
    console.log('Opening ad details:', { title, imageUrl, detailPage }); // 调试用

    // 创建新窗口并写入HTML内容
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title} - 广告详情</title>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: #f5f5f5;
                    }
                    .ad-detail-container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .ad-image {
                        width: 100%;
                        max-height: 400px;
                        object-fit: contain;
                        border-radius: 4px;
                        margin-bottom: 20px;
                    }
                    .ad-title {
                        color: #333;
                        margin-bottom: 10px;
                    }
                    .ad-detail {
                        color: #666;
                        line-height: 1.6;
                    }
                    .ad-label {
                        display: inline-block;
                        background: rgba(0,0,0,0.6);
                        color: white;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="ad-detail-container">
                    <span class="ad-label">广告</span>
                    <h1 class="ad-title">${title}</h1>
                    <img src="${imageUrl}" alt="${title}" class="ad-image">
                    <div class="ad-detail">
                        <p>${detailPage}</p>
                    </div>
                </div>
            </body>
            </html>
        `);
        newWindow.document.close();
    } else {
        console.error('Failed to open new window. Pop-up might be blocked.');
        // 如果弹窗被阻止，尝试在当前窗口打开
        window.location.href = detailPage;
    }
}