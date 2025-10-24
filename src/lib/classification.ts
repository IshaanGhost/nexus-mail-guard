import { z } from 'zod';
import { ChatOpenAI } from '@langchain/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from 'langchain/prompts';

// Define the output schema using Zod
const EmailClassificationSchema = z.object({
  category: z.enum(['Important', 'Promotional', 'Social', 'Marketing', 'Spam', 'General']),
  reason: z.string(),
});

// Create the structured output parser
const parser = StructuredOutputParser.fromZodSchema(EmailClassificationSchema);

// Create the prompt template with system instructions
const promptTemplate = PromptTemplate.fromTemplate(`
You are an expert email classification assistant. Your task is to analyze the provided email text and classify it into one of the following categories:

- Important: Work-related, urgent, or personally significant emails
- Promotional: Sales, discounts, offers, or promotional content
- Social: Social media notifications, friend/family communications, social updates
- Marketing: Marketing campaigns, newsletters, business communications
- Spam: Unwanted, suspicious, or potentially harmful emails
- General: Other emails that don't fit the above categories

Email Text:
{emailText}

{format_instructions}

Please analyze the email content carefully and provide a classification with a clear, concise reason for your decision.
`);

// Initialize the ChatOpenAI model
const model = new ChatOpenAI({
  modelName: 'gpt-4o',
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

/**
 * Classifies an email using Langchain.js with structured output parsing
 * @param emailText - The email text to classify
 * @returns Promise<{category: string, reason: string}>
 */
export async function classifyEmail(emailText: string): Promise<{category: string, reason: string}> {
  try {
    // Create the chain with the prompt template, model, and parser
    const chain = promptTemplate.pipe(model).pipe(parser);

    // Execute the chain with the email text
    const result = await chain.invoke({
      emailText: emailText,
      format_instructions: parser.getFormatInstructions(),
    });

    return result;
  } catch (error) {
    console.error('Error classifying email with Langchain:', error);
    
    // Return a default classification if the chain fails
    return {
      category: 'General',
      reason: 'Unable to classify due to processing error'
    };
  }
}

/**
 * Classifies multiple emails in parallel
 * @param emailTexts - Array of email texts to classify
 * @returns Promise<Array<{category: string, reason: string}>>
 */
export async function classifyEmails(emailTexts: string[]): Promise<Array<{category: string, reason: string}>> {
  try {
    // Process emails in parallel with a reasonable concurrency limit
    const batchSize = 5;
    const results: Array<{category: string, reason: string}> = [];
    
    for (let i = 0; i < emailTexts.length; i += batchSize) {
      const batch = emailTexts.slice(i, i + batchSize);
      
      const batchPromises = batch.map(emailText => classifyEmail(emailText));
      const batchResults = await Promise.all(batchPromises);
      
      results.push(...batchResults);
    }
    
    return results;
  } catch (error) {
    console.error('Error classifying emails with Langchain:', error);
    throw error;
  }
}

/**
 * Alternative implementation using RunnableSequence for more control
 */
export async function classifyEmailWithSequence(emailText: string): Promise<{category: string, reason: string}> {
  try {
    const { RunnableSequence } = await import('langchain/runnables');
    
    const chain = RunnableSequence.from([
      promptTemplate,
      model,
      parser,
    ]);

    const result = await chain.invoke({
      emailText: emailText,
      format_instructions: parser.getFormatInstructions(),
    });

    return result;
  } catch (error) {
    console.error('Error classifying email with RunnableSequence:', error);
    
    return {
      category: 'General',
      reason: 'Unable to classify due to processing error'
    };
  }
}
