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
