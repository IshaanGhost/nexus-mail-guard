import { google } from 'googleapis';

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
 * Fetches the last 15 message IDs from Gmail
 */
export async function fetchGmailMessageIds(accessToken: string): Promise<string[]> {
  const gmail = google.gmail({ version: 'v1', auth: accessToken });
  
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 15,
    });
    
    return response.data.messages?.map(msg => msg.id!) || [];
  } catch (error) {
    console.error('Error fetching Gmail message IDs:', error);
    throw new Error('Failed to fetch Gmail message IDs');
  }
}

/**
 * Fetches full message content for a given message ID
 */
export async function fetchGmailMessage(accessToken: string, messageId: string): Promise<GmailMessage> {
  const gmail = google.gmail({ version: 'v1', auth: accessToken });
  
  try {
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });
    
    const message = response.data;
    const headers = message.payload?.headers || [];
    
    // Extract headers
    const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
    const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
    const date = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();
    
    // Extract body text
    let body = '';
    if (message.payload?.body?.data) {
      body = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
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
      text += Buffer.from(part.body.data, 'base64').toString('utf-8');
    } else if (part.mimeType === 'text/html' && part.body?.data) {
      // For HTML content, we'll extract text (basic implementation)
      const html = Buffer.from(part.body.data, 'base64').toString('utf-8');
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
