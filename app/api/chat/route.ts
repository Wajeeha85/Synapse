import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: Request) {
  try {
    // Check if API key exists
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing from environment variables');
      return NextResponse.json(
        { error: 'API key is not configured. Please check your .env.local file.' },
        { status: 500 }
      );
    }

    // Initialize Groq client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Parse request body
    const { messages, message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('Received message:', message);

    // Build conversation history
    const conversationHistory = messages || [];
    
    const enhancedMessages = [
      { role: 'system', content: 'You are NexusAI, a helpful assistant.' },
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    console.log('Sending to Groq...');

    // Make the API call (non-streaming for debugging)
    const completion = await groq.chat.completions.create({
      messages: enhancedMessages,
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || 'No response generated';
    
    console.log('Groq response received:', reply.substring(0, 100));

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Detailed Chat API error:', {
      message: error.message,
      status: error.status,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { 
        error: error.message,
        details: error.status ? `Status: ${error.status}` : 'Unknown error'
      },
      { status: error.status || 500 }
    );
  }
}