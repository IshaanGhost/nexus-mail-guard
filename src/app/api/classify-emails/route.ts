import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchGmailEmails } from '@/lib/gmail-api';
import { classifyEmails } from '@/lib/email-classifier';

/**
 * POST handler for email classification
 * 
 * This endpoint:
 * 1. Authenticates the user and retrieves Google Access Token
 * 2. Fetches the last 15 emails from Gmail API
 * 3. Classifies each email using OpenAI GPT-4o
 * 4. Returns the classified emails as JSON
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authentication: Get user session and Google Access Token
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the Google access token from the session
    const accessToken = session.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Google access token not found' },
        { status: 401 }
      );
    }

    // 2. Set OpenAI Key from environment
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // 3. Fetch Email IDs and Full Emails
    console.log('Fetching emails from Gmail...');
    const emails = await fetchGmailEmails(accessToken);
    
    if (emails.length === 0) {
      return NextResponse.json([]);
    }

    console.log(`Found ${emails.length} emails, starting classification...`);

    // 4. Classification Pipeline
    const classifiedEmails = await classifyEmails(emails);
    
    console.log(`Successfully classified ${classifiedEmails.length} emails`);

    // 5. Return classified emails
    return NextResponse.json(classifiedEmails);
    
  } catch (error) {
    console.error('Error in classify-emails API:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

/**
 * Alternative implementation using auth() if using App Router with newer Next.js
 * Uncomment this if you're using the newer auth() function instead of getServerSession
 */
/*
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication: Get user session and Google Access Token
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the Google access token from the session
    const accessToken = session.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Google access token not found' },
        { status: 401 }
      );
    }

    // 2. Set OpenAI Key from environment
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // 3. Fetch Email IDs and Full Emails
    console.log('Fetching emails from Gmail...');
    const emails = await fetchGmailEmails(accessToken);
    
    if (emails.length === 0) {
      return NextResponse.json([]);
    }

    console.log(`Found ${emails.length} emails, starting classification...`);

    // 4. Classification Pipeline
    const classifiedEmails = await classifyEmails(emails);
    
    console.log(`Successfully classified ${classifiedEmails.length} emails`);

    // 5. Return classified emails
    return NextResponse.json(classifiedEmails);
    
  } catch (error) {
    console.error('Error in classify-emails API:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
*/
