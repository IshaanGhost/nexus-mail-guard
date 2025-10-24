# Google OAuth Setup for Lovable Cloud

## **Environment Variables**

Add these to your Lovable project environment variables:

```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## **Google Cloud Console Setup**

### **1. Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Gmail API**

### **2. Configure OAuth Consent Screen**
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill out required fields:
   - App name: "Nexus Mail Guard"
   - User support email: your email
   - Developer contact: your email
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `../auth/gmail.readonly`

### **3. Create OAuth 2.0 Credentials**
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Application type: **Web application**
4. **Authorized redirect URIs**:
   ```
   https://your-project-name.lovable.app/auth/callback
   http://localhost:8080/auth/callback
   http://localhost:5173/auth/callback
   ```
5. Copy the **Client ID** and **Client Secret**

### **4. Add Credentials to Lovable**
1. In your Lovable project settings
2. Add environment variables:
   - `VITE_GOOGLE_CLIENT_ID`: Your Google Client ID
   - `VITE_GOOGLE_CLIENT_SECRET`: Your Google Client Secret

## **How It Works**

1. **User clicks "Continue with Google"**
2. **Redirects to Google OAuth** with proper scopes
3. **User authorizes** the application
4. **Google redirects back** to `/auth/callback`
5. **App exchanges code** for access token
6. **User is logged in** and redirected to dashboard

## **Features**

- ✅ **Direct Google OAuth** (no Supabase needed)
- ✅ **Gmail API access** with proper scopes
- ✅ **Automatic token refresh**
- ✅ **Secure session management**
- ✅ **Works on Lovable Cloud**

## **Testing**

1. Deploy to Lovable Cloud
2. Visit your app URL
3. Click "Continue with Google"
4. Authorize the app
5. You should be redirected to the dashboard

## **Troubleshooting**

- **Redirect URI mismatch**: Make sure the redirect URI in Google Cloud Console matches your Lovable app URL
- **Invalid client**: Check that your Client ID and Secret are correct
- **Scope issues**: Ensure Gmail API is enabled and scopes are configured
