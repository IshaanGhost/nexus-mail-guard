import OpenAI from 'openai';
import { GmailMessage, ClassifiedEmail } from './gmail-api';

// OpenAI client will be initialized with API key passed to functions

export type EmailCategory = 'Important' | 'Promotional' | 'Social' | 'Marketing' | 'Spam' | 'General';

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
    // Return a default classification if OpenAI fails
    return {
      category: 'General',
      reason: 'Unable to classify due to processing error'
    };
  }
}

/**
 * Classifies multiple emails
 */
export async function classifyEmails(emails: GmailMessage[], openaiApiKey: string): Promise<ClassifiedEmail[]> {
  const classifiedEmails: ClassifiedEmail[] = [];
  
  // Process emails in parallel (with a reasonable concurrency limit)
  const batchSize = 5;
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (email) => {
      const classification = await classifyEmail(email, openaiApiKey);
      return {
        ...email,
        category: classification.category,
        reason: classification.reason,
      } as ClassifiedEmail;
    });
    
    const batchResults = await Promise.all(batchPromises);
    classifiedEmails.push(...batchResults);
  }
  
  return classifiedEmails;
}
