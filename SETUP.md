# Email Classification API Setup

This project includes a complete email classification system that fetches emails from Gmail and classifies them using OpenAI GPT-4o.

## Features

- **Gmail Integration**: Fetches the last 15 emails from Gmail API
- **AI Classification**: Uses OpenAI GPT-4o to classify emails into 6 categories:
  - Important
  - Promotional
  - Social
  - Marketing
  - Spam
  - General
- **Structured Output**: Returns JSON with category and reasoning
- **Authentication**: Secure Google OAuth integration with Supabase

## API Structure

### Files Created

1. **`src/lib/gmail-api.ts`** - Gmail API integration utilities
2. **`src/lib/email-classifier.ts`** - OpenAI GPT-4o classification logic
3. **`src/lib/classify-emails-api.ts`** - Main API handler functions
4. **`src/app/api/classify-emails/route.ts`** - Next.js API route (if using Next.js)
5. **`src/lib/auth.ts`** - Authentication configuration

### API Endpoint

**POST** `/api/classify-emails`

#### Authentication
- Uses `getServerSession()` or `auth()` to retrieve user session
- Requires Google Access Token from OAuth flow
- Returns 401 if no valid session/token found

#### Request Body
```json
{
  "openaiApiKey": "sk-..."
}
```

#### Response
```json
[
  {
    "id": "message_id",
    "from": "sender@example.com",
    "subject": "Email Subject",
    "snippet": "Email preview...",
    "body": "Full email content...",
    "date": "2024-01-01T00:00:00.000Z",
    "category": "Important",
    "reason": "Work-related email with urgent content"
  }
]
```

## Environment Variables

Create a `.env.local` file with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Google OAuth (for Next.js API routes)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Usage

### Client-Side (Current Implementation)
```typescript
import { classifyEmailsClient } from '@/lib/classify-emails-api';

const classifiedEmails = await classifyEmailsClient(openaiApiKey);
```

### Server-Side (Next.js API Route)
```typescript
// POST /api/classify-emails
const response = await fetch('/api/classify-emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({ openaiApiKey })
});
```

## Gmail API Setup

1. Enable Gmail API in Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add `https://www.googleapis.com/auth/gmail.readonly` scope
4. Configure redirect URIs for your domain

## Classification Categories

- **Important**: Work-related, urgent, or personally significant emails
- **Promotional**: Sales, discounts, offers, or promotional content
- **Social**: Social media notifications, friend/family communications
- **Marketing**: Marketing campaigns, newsletters, business communications
- **Spam**: Unwanted, suspicious, or potentially harmful emails
- **General**: Other emails that don't fit the above categories

## Error Handling

The API includes comprehensive error handling for:
- Authentication failures
- Gmail API errors
- OpenAI API errors
- Network timeouts
- Invalid responses

## Security Notes

- Google Access Tokens are retrieved securely from authenticated sessions
- OpenAI API keys should be stored securely on the server side
- Client-side implementation includes warnings about API key exposure
- All API calls include proper error handling and validation
