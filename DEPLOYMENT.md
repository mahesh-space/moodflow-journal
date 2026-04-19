# Deployment Guide for MoodFlow Journal

This guide covers deploying MoodFlow Journal to various hosting platforms.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/apikey)
3. **Git** (for version control)

## Quick Start

### 1. Build the Project Locally

```bash
# Install dependencies
npm install

# Create environment file
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Build for production
npm run build
```

The built files will be in the `dist/` directory.

### 2. Test Build Locally

```bash
npm run preview
```

Visit `http://localhost:4173` to verify the build works.

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Steps:**

1. **Install Vercel CLI** (optional, can use web interface):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI:**
   ```bash
   vercel
   ```
   Follow the prompts. When asked for environment variables, add:
   - `GEMINI_API_KEY` = your API key

3. **Or deploy via GitHub:**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Add environment variable: `GEMINI_API_KEY`
   - Deploy

**Configuration:**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**Environment Variables:**
- `GEMINI_API_KEY` - Your Gemini API key

---

### Option 2: Netlify

**Steps:**

1. **Install Netlify CLI** (optional):
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy via CLI:**
   ```bash
   netlify deploy --prod
   ```
   Or use the drag-and-drop interface at [app.netlify.com](https://app.netlify.com)

3. **Or deploy via GitHub:**
   - Push code to GitHub
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository
   - Configure:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
   - Add environment variable: `GEMINI_API_KEY`
   - Deploy

**Create `netlify.toml` (optional):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: GitHub Pages

**Steps:**

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update `package.json` scripts:**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Update `vite.config.ts`** to add base path:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/', // Replace with your GitHub repo name
     // ... rest of config
   });
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: `gh-pages` branch
   - Save

**Note:** GitHub Pages doesn't support environment variables directly. You'll need to use a different approach for the API key (see Security Considerations below).

---

### Option 4: Cloudflare Pages

**Steps:**

1. Push code to GitHub/GitLab
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
3. Click "Create a project"
4. Connect repository
5. Configure:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Add environment variable: `GEMINI_API_KEY`
7. Deploy

---

### Option 5: Traditional Hosting (cPanel, FTP, etc.)

**Steps:**

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the entire `dist/` folder contents to your web server's public directory (usually `public_html/` or `www/`)

3. Configure environment variables:
   - For static hosting, you'll need to set the API key at build time
   - Create `.env.local` before building
   - Or modify `vite.config.ts` to read from a config file

4. Ensure your server supports:
   - SPA routing (all routes redirect to `index.html`)
   - HTTPS (required for localStorage and modern APIs)

**Apache `.htaccess` example:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx example:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## Environment Variables

### Required Variables

- **`GEMINI_API_KEY`**: Your Google Gemini API key

### Setting Environment Variables

**Local Development:**
Create `.env.local` file:
```
GEMINI_API_KEY=your_api_key_here
```

**Production:**
Set via your hosting platform's environment variable settings.

---

## Security Considerations

⚠️ **Important:** Currently, the API key is embedded in the client-side bundle. This means anyone can view and potentially misuse your API key.

### Recommended Solutions:

1. **Use a Backend Proxy** (Best Practice):
   - Create a simple backend API (Node.js, Python, etc.)
   - Store API key on the server
   - Frontend calls your backend, backend calls Gemini
   - Example structure:
     ```
     Frontend → Your Backend API → Gemini API
     ```

2. **Use API Key Restrictions**:
   - In Google Cloud Console, restrict your API key to:
     - Specific domains (your deployed domain)
     - Specific APIs (Generative Language API only)
   - Set usage quotas to prevent abuse

3. **Use Vercel/Netlify Serverless Functions**:
   - Create API routes that proxy requests to Gemini
   - Keep API key server-side only

---

## Troubleshooting

### Build Fails

- **Error: Missing API Key**
  - Ensure `.env.local` exists with `GEMINI_API_KEY`
  - Verify the key is correct

- **Error: Module not found**
  - Run `npm install` again
  - Delete `node_modules` and `package-lock.json`, then reinstall

### App Doesn't Load After Deployment

- **404 on routes**: Ensure SPA routing is configured (redirect all routes to `index.html`)
- **Blank page**: Check browser console for errors
- **API errors**: Verify `GEMINI_API_KEY` is set in production environment

### localStorage Issues

- Ensure you're using HTTPS (required for secure contexts)
- Check browser console for storage errors

---

## Post-Deployment Checklist

- [ ] App loads correctly
- [ ] Navigation works (no 404s)
- [ ] Journal entries can be created
- [ ] Emotion analysis works
- [ ] Entries persist (localStorage)
- [ ] Dashboard displays correctly
- [ ] Mobile responsive design works
- [ ] HTTPS is enabled
- [ ] API key restrictions configured (if applicable)

---

## Continuous Deployment

Most platforms support automatic deployments:

- **Vercel/Netlify**: Auto-deploy on git push to main branch
- **GitHub Pages**: Auto-deploy on push to `gh-pages` branch
- **Cloudflare Pages**: Auto-deploy on git push

Enable this in your platform's project settings.

---

## Need Help?

- Check the [README.md](./README.md) for local setup
- Review platform-specific documentation
- Check browser console for errors
- Verify environment variables are set correctly
