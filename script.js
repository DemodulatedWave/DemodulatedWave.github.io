// Article data structure
const articles = [];

// Load articles list on homepage
async function loadArticles() {
    try {
        const response = await fetch('articles/index.json');
        if (!response.ok) throw new Error('Could not load articles');
        
        const data = await response.json();
        const articlesList = document.getElementById('articles-list');
        
        if (!articlesList) return;
        
        // Sort by date (newest first)
        data.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (data.articles.length === 0) {
            articlesList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No articles yet. Check back soon!</p>';
            return;
        }
        
        articlesList.innerHTML = data.articles.map(article => `
            <article class="article-card" onclick="window.location='article.html?id=${article.id}'">
                <div class="article-card-header">
                    <h3>${article.title}</h3>
                    <p class="article-date">${formatDate(article.date)}</p>
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
        
        if (contentDiv) {
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
            
            // Convert markdown to HTML
            const htmlContent = marked.parse(content);
            contentDiv.innerHTML = htmlContent;
            
            // Trigger MathJax to render LaTeX
            if (window.MathJax) {
                MathJax.contentDocument(contentDiv);
                MathJax.typesetPromise([contentDiv]).catch(err => console.log(err));
            }
        }
    } catch (error) {
        console.error('Error loading article:', error);
        document.getElementById('article-content').innerHTML = '<p>Error loading article. <a href="index.html">Return to home</a></p>';
    }
}

// Format date nicely
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize
if (window.location.pathname.includes('article.html')) {
    loadArticle();
} else {
    loadArticles();
}