import { fetchGmailEmails } from './gmail-api-client';
import { classifyEmails, ClassifiedEmail } from './email-classifier';

/**
 * Main API handler for email classification
 * This function handles the complete pipeline from authentication to classification
 */
export async function classifyEmailsHandler(openaiApiKey: string, accessToken: string): Promise<ClassifiedEmail[]> {
  try {
    // 1. Authentication: Validate access token
    if (!accessToken) {
      throw new Error('Authentication failed: No Google access token provided');
    }

    // 2. Set OpenAI Key (passed as parameter)
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is required');
    }

    // OpenAI API key is passed directly to classification functions

    // 3. Fetch Email IDs and Full Emails
    console.log('Fetching emails from Gmail...');
    const emails = await fetchGmailEmails(accessToken);
    
    if (emails.length === 0) {
      console.log('No emails found');
      return [];
    }

    console.log(`Found ${emails.length} emails, starting classification...`);

    // 4. Classification Pipeline
    const classifiedEmails = await classifyEmails(emails, openaiApiKey);
    
    console.log(`Successfully classified ${classifiedEmails.length} emails`);
    
    return classifiedEmails;
  } catch (error) {
    console.error('Error in classifyEmailsHandler:', error);
    throw error;
  }
}

/**
 * Client-side function to call the classification API
 * This would typically be called from a React component
 */
export async function classifyEmailsClient(openaiApiKey: string): Promise<ClassifiedEmail[]> {
  try {
    // In a real implementation, this would make an HTTP request to your backend API
    // For now, we'll call the handler directly since we're in a client-side environment
    // Note: This is not ideal for production as it exposes the OpenAI key on the client side
    
    console.warn('Warning: This is a client-side implementation. In production, move this to a secure backend API.');
    
    // Get access token from auth context
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token found. Please sign in again.');
    }
    
    return await classifyEmailsHandler(openaiApiKey, accessToken);
  } catch (error) {
    console.error('Error in classifyEmailsClient:', error);
    throw error;
  }
}

/**
 * Server-side API handler (for Next.js API routes or similar)
 * This is the proper implementation for a server-side API
 */
export async function classifyEmailsServerHandler(request: Request): Promise<Response> {
  try {
    // Parse request body
    const body = await request.json();
    const { openaiApiKey } = body;

    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get user session from request headers or cookies
    // This would need to be implemented based on your authentication setup
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Extract access token from Authorization header
    const accessToken = authHeader.replace('Bearer ', '');

    // OpenAI key is passed directly to classification functions

    // Fetch and classify emails
    const emails = await fetchGmailEmails(accessToken);
    const classifiedEmails = await classifyEmails(emails, openaiApiKey);

    return new Response(
      JSON.stringify(classifiedEmails),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in classifyEmailsServerHandler:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
