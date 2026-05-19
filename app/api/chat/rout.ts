import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, modelId } = await req.json();

    // ১. ইমেজ জেনারেশন মডেল (Hugging Face - Flux)
    if (modelId === 'image-model-2.0' || modelId === 'image') {
      const hfToken = process.env.NEXT_PUBLIC_HF_TOKEN || "hf_xxxx"; // তোমার HuggingFace Token এখানে বসাবে
      
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          headers: { Authorization: `Bearer ${hfToken}` },
          method: "POST",
          body: JSON.stringify({ inputs: message }),
        }
      );

      if (!response.ok) throw new Error("HuggingFace image failed");
      
      const blob = await response.blob();
      const buffer = Buffer.from(await blob.arrayBuffer());
      const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      
      return NextResponse.json({ 
        role: 'assistant', 
        content: `Here is your generated image for: "${message}"\n\n![Generated Image](${base64Image})` 
      });
    }

    // ২. টেক্সট ও থিংকিং মডেল (OpenRouter - DeepSeek R1 Free)
    const openRouterKey = process.env.NEXT_PUBLIC_OPENROUTER_KEY || "sk-or-v1-xxxx"; // তোমার OpenRouter Key এখানে বসাবে

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1:free",
        "messages": [{ "role": "user", "content": message }]
      })
    });

    if (!response.ok) throw new Error("OpenRouter text failed");

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "Sorry, I couldn't process that.";

    return NextResponse.json({ role: 'assistant', content: reply });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

