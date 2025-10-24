# 🚀 Deployment Guide - Nexus Mail Guard

## Quick Deploy Options

### Option 1: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import repository: `https://github.com/IshaanGhost/nexus-mail-guard`
5. Click "Deploy"

### Option 2: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Choose your repository
5. Click "Deploy site"

### Option 3: GitHub Pages
1. Go to repository Settings
2. Scroll to "Pages" section
3. Source: "Deploy from a branch"
4. Branch: "main"
5. Folder: "/ (root)"
6. Click "Save"

## Environment Variables to Set

### In Vercel/Netlify Dashboard:
```
VITE_SUPABASE_URL=https://zstxmjpmkhtcqmbladva.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdHhtanBta2h0Y3FtYmxhZHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMjc1MjEsImV4cCI6MjA3NjkwMzUyMX0.JFvYBj05Yr08tDU_przHMi2fL_M40gBy514SMaFOneg
VITE_GOOGLE_CLIENT_ID=684659445939-sbahccfitbrqbrocv8vrsg2f0g6oa9cb.apps.googleusercontent.com
```

## Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Add your new domain to authorized redirect URIs:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.netlify.app/auth/callback`
   - etc.

## Features Included
- ✅ Demo Mode (3 free classifications)
- ✅ Real Gmail Integration
- ✅ OpenAI Classification
- ✅ Modern UI with shadcn/ui
- ✅ Responsive Design
- ✅ Usage Tracking

## After Deployment
1. Test the demo mode
2. Add your OpenAI API key
3. Try fetching real emails
4. Share your app!

## Support
If you need help with deployment, check the console logs for any errors.
