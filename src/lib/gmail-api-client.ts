export interface GmailMessage {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
}

export interface ClassifiedEmail extends GmailMessage {
  category: 'Important' | 'Promotional' | 'Social' | 'Marketing' | 'Spam' | 'General';
  reason: string;
}

/**
 * Fetches the last 15 message IDs from Gmail using direct API calls
 */
export async function fetchGmailMessageIds(accessToken: string): Promise<string[]> {
  try {
    console.log('🔍 Fetching Gmail message IDs with token:', accessToken?.substring(0, 20) + '...');
    
    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('📡 Gmail API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gmail API error response:', errorText);
      throw new Error(`Gmail API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📧 Gmail API response data:', data);
    const messageIds = data.messages?.map((msg: any) => msg.id) || [];
    console.log('📧 Found message IDs:', messageIds.length);
    return messageIds;
  } catch (error) {
    console.error('❌ Error fetching Gmail message IDs:', error);
    throw new Error('Failed to fetch Gmail message IDs');
  }
}

/**
 * Fetches full message content for a given message ID using direct API calls
 */
export async function fetchGmailMessage(accessToken: string, messageId: string): Promise<GmailMessage> {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Gmail API error: ${response.status} ${response.statusText}`);
    }

    const message = await response.json();
    const headers = message.payload?.headers || [];
    
    // Extract headers
    const from = headers.find((h: any) => h.name === 'From')?.value || 'Unknown';
    const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
    const date = headers.find((h: any) => h.name === 'Date')?.value || new Date().toISOString();
    
    // Extract body text
    let body = '';
    if (message.payload?.body?.data) {
      body = atob(message.payload.body.data);
    } else if (message.payload?.parts) {
      // Handle multipart messages
      body = extractTextFromParts(message.payload.parts);
    }
    
    return {
      id: messageId,
      from,
      subject,
      snippet: message.snippet || '',
      body,
      date,
    };
  } catch (error) {
    console.error('Error fetching Gmail message:', error);
    throw new Error(`Failed to fetch Gmail message ${messageId}`);
  }
}

/**
 * Recursively extracts text content from multipart message parts
 */
function extractTextFromParts(parts: any[]): string {
  let text = '';
  
  for (const part of parts) {
    if (part.mimeType === 'text/plain' && part.body?.data) {
      text += atob(part.body.data);
    } else if (part.mimeType === 'text/html' && part.body?.data) {
      // For HTML content, we'll extract text (basic implementation)
      const html = atob(part.body.data);
      text += html.replace(/<[^>]*>/g, ''); // Remove HTML tags
    } else if (part.parts) {
      text += extractTextFromParts(part.parts);
    }
  }
  
  return text;
}

/**
 * Fetches and processes the last 15 emails from Gmail
 */
export async function fetchGmailEmails(accessToken: string): Promise<GmailMessage[]> {
  try {
    const messageIds = await fetchGmailMessageIds(accessToken);
    const emails: GmailMessage[] = [];
    
    // Fetch each message (limit to 15 as requested)
    for (const messageId of messageIds.slice(0, 15)) {
      try {
        const email = await fetchGmailMessage(accessToken, messageId);
        emails.push(email);
      } catch (error) {
        console.error(`Failed to fetch message ${messageId}:`, error);
        // Continue with other messages even if one fails
      }
    }
    
    return emails;
  } catch (error) {
    console.error('Error fetching Gmail emails:', error);
    throw new Error('Failed to fetch Gmail emails');
  }
}
