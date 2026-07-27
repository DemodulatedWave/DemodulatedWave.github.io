// Global articles data
let allArticles = [];
let currentFilter = null;

// Load articles list on homepage
async function loadArticles() {
    try {
        const response = await fetch('articles/index.json');
        if (!response.ok) throw new Error('Could not load articles');
        
        const data = await response.json();
        allArticles = data.articles;
        
        const articlesList = document.getElementById('articles-list');
        if (!articlesList) return;
        
        // Sort by date (newest first)
        const sorted = [...allArticles].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (sorted.length === 0) {
            articlesList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No articles yet. Check back soon!</p>';
            return;
        }
        
        articlesList.innerHTML = sorted.map(article => `
            <article class="article-card" onclick="if(event.target.classList.contains('tag')) return; window.location='article.html?id=${article.id}'">
                <div class="article-card-header">
                    <h3>${article.title}</h3>
                    <p class="article-date">${formatDate(article.date)}</p>
                    <div class="article-card-tags">
                        ${(article.tags || []).map(tag => `<span class="tag" onclick="filterByTag('${tag}', event)">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="article-card-body">
                    <p>${article.excerpt}</p>
                    <a href="article.html?id=${article.id}" class="read-more">Read More →</a>
                </div>
            </article>
        `).join('');
    } catch (error) {
        console.error('Error loading articles:', error);
    }
}

// Format date nicely
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Get all unique tags from articles
function getAllTags() {
    const tags = new Set();
    allArticles.forEach(article => {
        (article.tags || []).forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
}

// Filter by tag
function filterByTag(tag, event) {
    event.stopPropagation();
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = tag;
        performSearch(tag);
    }
}

// Perform search
function performSearch(query) {
    if (!query.trim()) {
        loadArticles();
        document.getElementById('search-results-dropdown').classList.remove('active');
        return;
    }

    const dropdown = document.getElementById('search-results-dropdown');
    const allTags = getAllTags();
    const lowerQuery = query.toLowerCase();
    
    let results = [];
    
    // Find matching tags
    const matchingTags = allTags.filter(tag => tag.toLowerCase().includes(lowerQuery));
    
    // Find articles with matching tags (prioritized)
    const tagMatchArticles = allArticles.filter(article => 
        (article.tags || []).some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    
    // Find articles with matching content
    const contentMatchArticles = allArticles.filter(article => 
        !tagMatchArticles.includes(article) && (
            article.title.toLowerCase().includes(lowerQuery) ||
            article.excerpt.toLowerCase().includes(lowerQuery)
        )
    );
    
    // Build dropdown results
    let dropdownHTML = '';
    
    // Show available tags
    if (matchingTags.length > 0) {
        dropdownHTML += '<div class="search-result-item tag"><strong>Available Tags:</strong><br>';
        dropdownHTML += matchingTags.map(tag => 
            `<span class="search-result-item tag-badge" onclick="filterByTag('${tag}', event)">${tag}</span>`
        ).join('');
        dropdownHTML += '</div>';
    }
    
    // Show tag-matched articles
    if (tagMatchArticles.length > 0) {
        dropdownHTML += '<div style="padding: 0.5rem 1rem; color: #7f8c8d; font-size: 0.85rem; font-weight: bold;">Articles with matching tags:</div>';
        tagMatchArticles.forEach(article => {
            dropdownHTML += `<div class="search-result-item" onclick="window.location='article.html?id=${article.id}'">
                <div class="search-result-title">${article.title}</div>
                <div class="search-result-subtitle">${formatDate(article.date)}</div>
            </div>`;
        });
    }
    
    // Show content-matched articles
    if (contentMatchArticles.length > 0) {
        dropdownHTML += '<div style="padding: 0.5rem 1rem; color: #7f8c8d; font-size: 0.85rem; font-weight: bold;">Articles with matching content:</div>';
        contentMatchArticles.forEach(article => {
            dropdownHTML += `<div class="search-result-item" onclick="window.location='article.html?id=${article.id}'">
                <div class="search-result-title">${article.title}</div>
                <div class="search-result-subtitle">${article.excerpt.substring(0, 80)}...</div>
            </div>`;
        });
    }
    
    if (dropdownHTML === '') {
        dropdownHTML = '<div class="search-result-item">No results found</div>';
    }
    
    dropdown.innerHTML = dropdownHTML;
    dropdown.classList.add('active');
}

// Load individual article
async function loadArticle() {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');
    
    if (!articleId) {
        window.location = 'index.html';
        return;
    }
    
    try {
        // Use GitHub raw content URL for markdown files
        const rawUrl = `https://raw.githubusercontent.com/DemodulatedWave/DemodulatedWave.github.io/main/articles/${articleId}/article.md`;
        const response = await fetch(rawUrl);
        if (!response.ok) throw new Error('Article not found');
        
        const markdown = await response.text();
        const contentDiv = document.getElementById('article-content');
        
        if (!contentDiv) {
            console.error('Content div not found');
            return;
        }
        
        // Parse frontmatter
        const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        let content = markdown;
        let metadata = {};
        
        if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            content = frontmatterMatch[2];
            
            // Simple YAML parsing
            frontmatter.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length > 0) {
                    metadata[key.trim()] = valueParts.join(':').trim().replace(/^['"]|['"]$/g, '');
                }
            });
        }
        
        // Set page title and header
        if (metadata.title) {
            document.title = metadata.title + ' - Electronics Lab';
            const titleEl = document.getElementById('article-title');
            if (titleEl) titleEl.textContent = metadata.title;
        }
        
        if (metadata.date) {
            const dateEl = document.getElementById('article-date');
            if (dateEl) dateEl.textContent = formatDate(metadata.date);
        }
        
        // Parse and display tags
        if (metadata.tags) {
            const tags = metadata.tags.split(',').map(t => t.trim()).filter(t => t);
            const tagsEl = document.getElementById('article-tags');
            if (tagsEl && tags.length > 0) {
                tagsEl.innerHTML = tags.map(tag => 
                    `<span class="tag" onclick="filterByTag('${tag}', event)">${tag}</span>`
                ).join('');
            }
        }
        
        // Convert markdown to HTML
        const htmlContent = marked.parse(content);
        contentDiv.innerHTML = htmlContent;
        
        // Render LaTeX with MathJax
        setTimeout(() => {
            if (window.MathJax && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise([contentDiv]).catch(err => console.log('MathJax render error:', err));
            }
        }, 100);
        
    } catch (error) {
        console.error('Error loading article:', error);
        const contentDiv = document.getElementById('article-content');
        if (contentDiv) {
            contentDiv.innerHTML = '<p>Error loading article. <a href="index.html">Return to home</a></p>';
        }
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchDropdown = document.getElementById('search-results-dropdown');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchDropdown.classList.remove('active');
        }
    });
    
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim()) {
            searchDropdown.classList.add('active');
        } else {
            searchDropdown.classList.remove('active');
        }
    });
}

// Initialize based on page
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    
    if (window.location.pathname.includes('article.html')) {
        loadArticle();
    } else {
        loadArticles();
    }
});