import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    // এনভায়রনমেন্ট ভেরিয়েবল থেকে কী-টি নেওয়া হচ্ছে
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key missing in environment' }, { status: 500 });
    }

    // OpenRouter-এর অফিশিয়াল এন্ডপয়েন্টে রিকোয়েস্ট পাঠানো
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // OpenRouter-এর নিয়মানুযায়ী এই হেডারগুলো দেওয়া ভালো
        "HTTP-Referer": "http://localhost:3000", 
        "X-Title": "Jeet AI Chatbox"
      },
      body: JSON.stringify({
        // তুমি যদি 'chatgpt-v5' সিলেক্ট করো, তবে ওপেন রাউটারে ওটার সমতুল্য gpt-4o বা o3-mini মডেল কল হবে
        model: model === 'image-model-2' ? 'openai/gpt-4o-mini' : 'openai/gpt-4o', 
        messages: messages.map((m: any) => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter Error Details:', data);
      return NextResponse.json({ error: data.error?.message || 'Failed to fetch from OpenRouter' }, { status: response.status });
    }

    // ফ্রন্টএন্ড যেভাবে রেসপন্স আশা করে সেই স্ট্রাকচারে রিটার্ন করা
    const aiMessage = data.choices[0].message;

    return NextResponse.json({ 
      id: crypto.randomUUID(),
      role: 'assistant',
      content: aiMessage.content 
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
