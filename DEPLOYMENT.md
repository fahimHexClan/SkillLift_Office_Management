# 🚀 Free Hosting Guide

## Option 1: Vercel (Recommended) ⭐

### Steps:
1. Push your code to GitHub
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. Go to https://vercel.com
3. Sign up with GitHub
4. Click "New Project"
5. Import your repository
6. Add Environment Variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (will be auto-generated)
   - `NEXT_PUBLIC_API_BASE`
   - `NEXT_PUBLIC_API_BASE_WWW`
   - `NEXT_PUBLIC_API_BASE_ADMIN`
   - `NEXT_PUBLIC_ACCESS_TOKEN`

7. Click "Deploy"

### Update Google OAuth:
- Go to Google Cloud Console
- Add your Vercel URL to Authorized redirect URIs:
  - `https://your-app.vercel.app/api/auth/callback/google`

---

## Option 2: Netlify

1. Push to GitHub
2. Go to https://netlify.com
3. Import repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Add environment variables

---

## Option 3: Railway

1. Go to https://railway.app
2. Connect GitHub
3. Deploy from repo
4. Add environment variables

---

## Option 4: Render

1. Go to https://render.com
2. New Web Service
3. Connect GitHub
4. Build: `npm install && npm run build`
5. Start: `npm start`

---

## Quick Deploy Commands:

### Install Vercel CLI:
```bash
npm i -g vercel
```

### Deploy:
```bash
vercel
```

### Production Deploy:
```bash
vercel --prod
```
