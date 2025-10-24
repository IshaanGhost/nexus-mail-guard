# 📧 Nexus Mail Guard

An AI-powered email classification system that automatically categorizes your Gmail emails using OpenAI's GPT-4o. Organize your inbox with intelligent categorization into Important, Promotional, Social, Marketing, Spam, and General categories.

## ✨ Features

- **🔐 Secure Google OAuth Integration** - Sign in with your Google account
- **🤖 AI-Powered Classification** - Uses OpenAI GPT-4o for intelligent email categorization
- **📊 Real-time Email Analysis** - Classify your last 15 emails instantly
- **🎯 Smart Categories** - Important, Promotional, Social, Marketing, Spam, General
- **💡 Demo Mode** - Try 3 free classifications without an API key
- **📱 Responsive Design** - Beautiful UI built with shadcn/ui and Tailwind CSS
- **🔒 Privacy-Focused** - Your emails are processed securely and not stored
- **⚡ Client-Side Processing** - Fast, secure email classification in your browser
- **🛡️ Error Handling** - Robust error handling with helpful user feedback
- **🎨 Custom Branding** - Professional favicon and clean UI design
- **🚀 Production Ready** - Fully deployed on Vercel with no external dependencies

## 🚀 Live Demo

**[Try Nexus Mail Guard →](https://nexus-mail-guard.vercel.app)**

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Authentication**: Supabase Auth + Google OAuth
- **AI**: OpenAI GPT-4o API
- **Email API**: Gmail API
- **Deployment**: Vercel
- **State Management**: React Hooks + Local Storage
- **Build Tool**: Vite (fast development and production builds)
- **Styling**: Tailwind CSS + CSS Variables

## 🎯 How It Works

1. **Sign In** with your Google account (grants Gmail read-only access)
2. **Add OpenAI API Key** or try the demo mode
3. **Fetch Emails** - Retrieves your last 15 Gmail messages
4. **AI Classification** - GPT-4o analyzes and categorizes each email
5. **View Results** - See categorized emails with reasoning

## 🆕 Recent Updates

### Version 2.3 (Latest)
- ✅ **Fixed favicon loading** - Custom purple mail icon with cache-busting
- ✅ **Removed all Lovable dependencies** - Clean, independent codebase
- ✅ **Enhanced error handling** - Better user feedback for API issues
- ✅ **Improved rate limiting** - Prevents OpenAI quota exceeded errors
- ✅ **Updated branding** - Professional UI with custom favicon
- ✅ **Production optimizations** - Faster loading and better performance

### Previous Versions
- **v2.2**: Fixed Gmail API base64 decoding issues
- **v2.1**: Added demo mode and usage tracking
- **v2.0**: Complete rewrite with client-side processing

## 🚀 Quick Start

### Option 1: Use the Live Demo
1. Visit [nexus-mail-guard.vercel.app](https://nexus-mail-guard.vercel.app)
2. Sign in with Google
3. Try demo mode or add your OpenAI API key
4. Start classifying emails!

### Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/IshaanGhost/nexus-mail-guard.git
cd nexus-mail-guard

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔑 API Keys Setup

### OpenAI API Key (Required for full functionality)
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Create an account and add a payment method
3. Go to API Keys section
4. Create a new secret key
5. Copy the key (starts with `sk-`)
6. Paste it in the app

**Cost**: ~$0.01-0.02 per email classification (very affordable!)

### Demo Mode
- Try 3 free classifications without an API key
- Uses sample emails to demonstrate the classification system
- Perfect for testing before getting your API key

## 📧 Email Categories

| Category | Description | Example |
|----------|-------------|---------|
| **Important** | Work emails, urgent communications | Meeting invites, project updates |
| **Promotional** | Sales, discounts, offers | Store promotions, deals |
| **Social** | Social media notifications | LinkedIn, Facebook updates |
| **Marketing** | Newsletters, marketing content | Company newsletters, updates |
| **Spam** | Suspicious or unwanted emails | Scams, phishing attempts |
| **General** | Other miscellaneous emails | Receipts, confirmations |

## 🔒 Privacy & Security

- **Read-Only Access**: Only requests Gmail read-only permissions
- **No Data Storage**: Emails are processed in real-time, not stored
- **Secure Authentication**: Uses Google OAuth 2.0
- **API Key Security**: Your OpenAI key is stored locally in your browser
- **Client-Side Processing**: All email analysis happens in your browser
- **Rate Limiting**: Built-in delays to prevent API quota issues

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud Console project
- Supabase account

### Environment Variables
The app is configured to work out of the box with the live demo. For local development, you can create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Note**: The live demo already has all necessary configurations set up!

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── lib/                # Utility functions and API clients
├── integrations/       # External service integrations
└── hooks/              # Custom React hooks
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for the GPT-4o API
- [Supabase](https://supabase.com) for authentication
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Vercel](https://vercel.com) for reliable deployment platform
- [React](https://react.dev) and [Vite](https://vitejs.dev) for the development framework

## 🔧 Troubleshooting

### Common Issues

**"OpenAI quota exceeded" error:**
- Check your OpenAI billing at [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
- Add a payment method if you've used your free credits
- Try demo mode while setting up billing
- The app includes rate limiting to prevent quota issues

**"Redirect URI mismatch" error:**
- This is usually resolved automatically
- Try clearing your browser cache and signing in again
- The app is configured with proper redirect URIs for Vercel

**Emails not loading:**
- Ensure you're signed in with Google
- Check that Gmail API is enabled in your Google account
- Try refreshing the page
- Check browser console for any error messages

**Classification not working:**
- Make sure you've added a valid OpenAI API key
- Check that your API key has sufficient credits
- Try demo mode to test the interface
- The app includes detailed error logging in the console

**Favicon not updating:**
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache
- Try opening in incognito/private mode
- The app includes cache-busting for favicon updates

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/IshaanGhost/nexus-mail-guard/issues) page
2. Create a new issue with detailed information
3. Try the troubleshooting steps above first

---

**Made with ❤️ by Ishaan**

[![Deploy with Vercel](https://img.shields.io/badge/Deploy%20with-Vercel-black)](https://vercel.com)
[![GitHub stars](https://img.shields.io/github/stars/IshaanGhost/nexus-mail-guard?style=social)](https://github.com/IshaanGhost/nexus-mail-guard)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-nexus--mail--guard.vercel.app-green)](https://nexus-mail-guard.vercel.app)