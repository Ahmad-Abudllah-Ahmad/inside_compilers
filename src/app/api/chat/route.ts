import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request: NextRequest) {
    try {
        if (!GROQ_API_KEY) {
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { messages, systemPrompt } = body;

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json(
                { error: `Groq API error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json({
            content: data.choices[0]?.message?.content || 'No response generated'
        });

    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
