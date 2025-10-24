# Google OAuth Setup Instructions

## Step 1: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Gmail API**:
   - Go to **APIs & Services** → **Library**
   - Search for "Gmail API"
   - Click **Enable**

## Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill out required fields:
   - **App name**: Your app name
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click **Save and Continue**
5. Add scopes:
   - Click **Add or Remove Scopes**
   - Add these scopes:
     - `https://www.googleapis.com/auth/userinfo.email`
     - `https://www.googleapis.com/auth/userinfo.profile`
     - `https://www.googleapis.com/auth/gmail.readonly`
   - Click **Update** then **Save and Continue**

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Application type: **Web application**
4. **Authorized redirect URIs** - Add this URL:
   ```
   https://zstxmjpmkhtcqmbladva.supabase.co/auth/v1/callback
   ```
   
   For local development, also add:
   ```
   http://localhost:5173/dashboard
   http://localhost:8080/dashboard
   ```

5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

## Step 4: Configure in Vercel

1. Open your Vercel dashboard
2. Go to **Auth Settings** → **Google**
3. Enable Google provider
4. Paste your **Client ID** and **Client Secret**
5. Save the configuration

## Testing

1. Click "Continue with Google" on the login page
2. Authorize the app
3. You should be redirected to the dashboard

## Important Notes

- The redirect URI **must exactly match** what's configured in Google Cloud Console
- Make sure Gmail API is enabled
- The app requests `gmail.readonly` scope for reading emails
