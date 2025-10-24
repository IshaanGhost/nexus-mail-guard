import OpenAI from 'openai';
import { GmailMessage } from './gmail-api';

export type EmailCategory = 'Important' | 'Promotional' | 'Social' | 'Marketing' | 'Spam' | 'General';

export interface ClassifiedEmail extends GmailMessage {
  category: EmailCategory;
  reason: string;
}

// OpenAI client will be initialized with API key passed to functions

export interface ClassificationResult {
  category: EmailCategory;
  reason: string;
}

/**
 * Classifies a single email using OpenAI GPT-4o
 */
export async function classifyEmail(email: GmailMessage, openaiApiKey: string): Promise<ClassificationResult> {
  try {
    const openai = new OpenAI({
      apiKey: openaiApiKey,
      dangerouslyAllowBrowser: true, // Required for client-side usage
    });
    const prompt = `
You are an email classification assistant. Analyze the following email and classify it into one of these categories:

- Important: Work-related, urgent, or personally significant emails
- Promotional: Sales, discounts, offers, or promotional content
- Social: Social media notifications, friend/family communications, social updates
- Marketing: Marketing campaigns, newsletters, business communications
- Spam: Unwanted, suspicious, or potentially harmful emails
- General: Other emails that don't fit the above categories

Email Details:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body.substring(0, 2000)}${email.body.length > 2000 ? '...' : ''}

Please respond with a JSON object containing:
{
  "category": "one of the six categories above",
  "reason": "brief explanation of why you classified it this way"
}

Be concise but clear in your reasoning. Focus on the content and context of the email.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert email classifier. Always respond with valid JSON in the exact format requested.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const classification = JSON.parse(content) as ClassificationResult;
    
    // Validate the category
    const validCategories: EmailCategory[] = ['Important', 'Promotional', 'Social', 'Marketing', 'Spam', 'General'];
    if (!validCategories.includes(classification.category)) {
      classification.category = 'General';
    }

    return classification;
  } catch (error) {
    console.error('Error classifying email:', error);
    console.error('Email details:', {
      from: email.from,
      subject: email.subject,
      bodyLength: email.body.length
    });
    
    // Return a default classification if OpenAI fails
    return {
      category: 'General',
      reason: `Unable to classify due to processing error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Classifies multiple emails
 */
export async function classifyEmails(emails: GmailMessage[], openaiApiKey: string): Promise<ClassifiedEmail[]> {
  const classifiedEmails: ClassifiedEmail[] = [];
  
  // Process emails in parallel (with a smaller batch size to avoid rate limits)
  const batchSize = 2;
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (email, index) => {
      try {
        console.log(`🤖 Classifying email ${i + index + 1}: ${email.subject}`);
        const classification = await classifyEmail(email, openaiApiKey);
        console.log(`✅ Classified as ${classification.category}: ${email.subject}`);
        return {
          ...email,
          category: classification.category,
          reason: classification.reason,
        } as ClassifiedEmail;
      } catch (error) {
        console.error(`❌ Failed to classify email ${i + index + 1}:`, error);
        
        // Handle specific OpenAI errors
        let errorMessage = 'Classification failed';
        if (error instanceof Error) {
          if (error.message.includes('429') || error.message.includes('quota')) {
            errorMessage = 'OpenAI quota exceeded - please check your billing';
          } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
            errorMessage = 'Invalid OpenAI API key';
          } else {
            errorMessage = error.message;
          }
        }
        
        return {
          ...email,
          category: 'General' as EmailCategory,
          reason: errorMessage,
        } as ClassifiedEmail;
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    classifiedEmails.push(...batchResults);
    
    // Add longer delay between batches to avoid rate limiting
    if (i + batchSize < emails.length) {
      console.log('⏳ Waiting 3 seconds before next batch to avoid rate limits...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  return classifiedEmails;
}
