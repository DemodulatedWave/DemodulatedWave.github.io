# Electronics Lab Blog

A personal blog for sharing electronics projects, tutorials, and experiments.

## Features

✨ **Markdown Support** - Write articles in clean, simple markdown

🧮 **LaTeX Math** - Full MathJax support for equations and formulas

🖼️ **Images** - Easy image embedding and responsive display

📱 **Responsive Design** - Works great on desktop, tablet, and mobile

🎨 **Clean Styling** - Professional look with no complexity

## How to Add Articles

### 1. Create a new folder

```bash
mkdir articles/your-article-id
```

### 2. Create the markdown file

Create `articles/your-article-id/article.md` with this format:

```markdown
---
title: Your Article Title
date: 2026-07-27
author: Your Name
---

# Article Title

Your content here...
```

### 3. Add metadata to index

Edit `articles/index.json` and add:

```json
{
  "id": "your-article-id",
  "title": "Your Article Title",
  "date": "2026-07-27",
  "excerpt": "Brief description of your article"
}
```

### 4. Add images (optional)

Place images in your article folder:

```bash
articles/your-article-id/
├── article.md
├── diagram.png
└── circuit.jpg
```

Reference in markdown:

```markdown
![Alt text](diagram.png)
```

## Markdown Features

### Code Blocks

````markdown
```python
print("Hello, Electronics!")
```
````

### LaTeX Equations

```markdown
Inline: $E = mc^2$

Display:
$$V = I \times R$$
```

### Tables

```markdown
| Component | Value | Notes |
|-----------|-------|-------|
| Resistor  | 10kΩ  | 1/4W  |
| Capacitor | 100µF | 16V   |
```

## Customization

### Edit the header

Modify `index.html` and `article.html` to change the site name, links, etc.

### Change colors

Edit the CSS variables in `style.css`:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
}
```

## Deployment

This site is hosted on GitHub Pages automatically. Just push to the `main` branch!

1. Navigate to your repository settings
2. Go to "Pages"
3. Set source to "Deploy from a branch" → "main"
4. Your site will be live at `https://yourusername.github.io`

## Tips & Best Practices

- Keep article IDs simple and URL-friendly (lowercase, hyphens)
- Use descriptive excerpts (1-2 sentences)
- Include relevant images to break up text
- Organize related articles with consistent naming
- Test math rendering locally by opening `article.html` in a browser

## License

Your content, your rules! Add a LICENSE file if needed.
