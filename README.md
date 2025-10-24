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

## 🚀 Live Demo

**[Try Nexus Mail Guard →](https://nexus-mail-guard.lovable.app)**

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Authentication**: Supabase Auth + Google OAuth
- **AI**: OpenAI GPT-4o API
- **Email API**: Gmail API
- **Deployment**: Lovable Cloud

## 🎯 How It Works

1. **Sign In** with your Google account (grants Gmail read-only access)
2. **Add OpenAI API Key** or try the demo mode
3. **Fetch Emails** - Retrieves your last 15 Gmail messages
4. **AI Classification** - GPT-4o analyzes and categorizes each email
5. **View Results** - See categorized emails with reasoning

## 🚀 Quick Start

### Option 1: Use the Live Demo
1. Visit [nexus-mail-guard.lovable.app](https://nexus-mail-guard.lovable.app)
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

**Cost**: ~$0.01-0.05 per email classification

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

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud Console project
- Supabase account

### Environment Variables
Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for the GPT-4o API
- [Supabase](https://supabase.com) for authentication
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Lovable](https://lovable.dev) for deployment platform

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/IshaanGhost/nexus-mail-guard/issues) page
2. Create a new issue with detailed information
3. Contact: [Your Contact Information]

---

**Made with ❤️ by [Your Name]**

[![Deploy with Lovable](https://img.shields.io/badge/Deploy%20with-Lovable-blue)](https://lovable.dev)
[![GitHub stars](https://img.shields.io/github/stars/IshaanGhost/nexus-mail-guard?style=social)](https://github.com/IshaanGhost/nexus-mail-guard)