let allNews = []; // 存储所有新闻数据
let categories = []; // 存储所有分类数据

document.addEventListener('DOMContentLoaded', function() {
    // 首先获取广告数据
    fetch('http://ads.wztj.net:8000/Servletclass-1.0-SNAPSHOT/randomAd')
        .then(response => response.json())
        .then(adData => {
            console.log('广告数据:', adData); // 调试用
            if (adData) {
                renderAd(adData);
            }
        })
        .catch(error => console.error('Error loading ad:', error));

    // 获取分类数据
    fetch('http://localhost:9090/selectAllType')
        .then(response => response.json())
        .then(data => {
            if (data.code === "200") {
                categories = data.data;
                renderCategories(categories);
            }
        })
        .catch(error => console.error('Error:', error));

    // 获取新闻数据
    fetch('http://localhost:9090/selectAll')
        .then(response => response.json())
        .then(data => {
            if (data.code === "200") {
                allNews = data.data;
                renderNews(allNews); // 默认显示所有新闻
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
});

function renderCategories(categories) {
    const nav = document.getElementById('categoryNav');
    const ul = document.createElement('ul');
    ul.className = 'nav-list';
    
    // 添加"全部新闻"分类，使用特殊的 data-category="all"
    ul.innerHTML = `
        <li>
            <a href="#" data-category="all" class="active">全部新闻</a>
        </li>
    `;
    
    // 添加数据库中的分类
    categories.forEach(category => {
        ul.innerHTML += `
            <li>
                <a href="#" data-category="${category.id}">${category.name}</a>
            </li>
        `;
    });
    
    nav.appendChild(ul);

    // 添加分类点击事件
    ul.addEventListener('click', function(e) {
        e.preventDefault();
        if (e.target.tagName === 'A') {
            const categoryId = e.target.getAttribute('data-category');
            // 移除所有active类
            ul.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            // 添加active类到被点击的元素
            e.target.classList.add('active');
            filterNewsByCategory(categoryId);
        }
    });
}

function filterNewsByCategory(categoryId) {
    const filteredNews = categoryId === 'all' 
        ? allNews 
        : allNews.filter(news => news.typeId === parseInt(categoryId));
    
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
    // 确保使用正确的类型ID查找分类名称
    const category = categories.find(cat => cat.id === news.typeId);
    const categoryName = category ? category.name : '未分类';
    
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

// 添加广告渲染函数Y
function renderAd(adData) {
    console.log('正在渲染广告:', adData); // 调试用
    
    // 确保图片URL是完整的
    const imageUrl = adData.imageUrl.startsWith('http') 
        ? adData.imageUrl 
        : `http://ads.wztj.net:8000${adData.imageUrl}`;

    const adHTML = `
        <div class="ad-container">
            <div class="ad-content">
                <img src="${imageUrl}" alt="${adData.title}" class="ad-image" onerror="this.onerror=null; this.src='placeholder.jpg';">
                <div class="ad-info">
                    <h3>${adData.title || '广告标题'}</h3>
                    <p>${adData.detailPage || '广告详情'}</p>
                </div>
            </div>
        </div>
    `;

    // 确保主内容区域存在
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        // 插入到现有内容之前
        mainContent.insertAdjacentHTML('afterbegin', adHTML);
    } else {
        console.error('未找到主内容区域');
    }
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