
# AceIt - AI Mock Interview Preparator 🚀

AceIt is a high-performance mock interview simulator designed to help candidates master their interview skills using Google's Gemini AI.

## 🔗 Repository Information
- **URL**: [https://github.com/PeetlaMahesh123/AI-Mock-Interview-Application](https://github.com/PeetlaMahesh123/AI-Mock-Interview-Application)

## 🚀 Deployment to GitHub Pages
To host this app on GitHub, follow these exact steps:
If you haven't pushed your code yet:
```bash
# git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git add .
git commit -m "feat: initial project structure"
git branch -M main
git push -u origin main
```


### 2. Configure the Gemini API Key
- Navigate to your GitHub Repository **Settings**.
- Go to **Secrets and variables** > **Actions**.
- Click **New repository secret**.
- **Name**: `GEMINI_API_KEY`
- **Value**: *Paste your Google Gemini API Key here*

### 3. Verify GitHub Actions
- Go to the **Actions** tab in your repository.
- You will see a workflow named "Deploy to GitHub Pages" running.
- Once it finishes successfully, it will create/update a `gh-pages` branch.

### 4. Set the Pages Source
- Go to **Settings** > **Pages**.
- Under **Build and deployment** > **Branch**, select `gh-pages` and `/ (root)`.
- Click **Save**. Your site will be live at the URL above within minutes.

## 🛠️ Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run locally**:
   ```bash
   # On Windows (PowerShell)
   $env:API_KEY="your_key"; npm run dev
   
   # On Mac/Linux
   export API_KEY=your_key && npm run dev
   ```

---
Built with ❤️ using Gemini AI.
