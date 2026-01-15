import { NextResponse } from 'next/server';
import { generateHeartSync } from '../../../../lib/heartsync';
import tempService from '../../../../lib/tempService';

export const runtime = 'nodejs';
export const maxDuration = 60; // Proses gradio bisa lama

const FACTS = [
    "HeartSync menggunakan teknologi Stable Diffusion.",
    "Proses 'Inference' adalah saat model menghasilkan gambar dari noise.",
    "Resolusi 1024x1024 membutuhkan VRAM yang cukup besar.",
    "AI tidak benar-benar 'melihat', ia mengenali pola statistik.",
    "Guidance Scale menentukan seberapa patuh AI terhadap prompt.",
    "Negative Prompt membantu menghilangkan elemen yang tidak diinginkan."
];

export async function POST(req) {
    try {
        const body = await req.json();
        const { prompt, negative_prompt } = body;
        
        if (!prompt) {
            return NextResponse.json({ error: "Parameter 'prompt' wajib diisi." }, { status: 400 });
        }

        const origin = new URL(req.url).origin;
        const encoder = new TextEncoder();
        
        const customStream = new TransformStream();
        const writer = customStream.writable.getWriter();

        const send = (text) => {
            return writer.write(encoder.encode(text)).catch(() => {});
        };

        (async () => {
            let keepAliveInterval;
            try {
                await send(`Menghubungkan ke HeartSync Space...\n`);
                await send(`Memproses prompt: "${prompt}"...\n`);

                keepAliveInterval = setInterval(() => {
                    const fact = FACTS[Math.floor(Math.random() * FACTS.length)];
                    send(`Info: ${fact}\n`);
                }, 2500);

                const proxyImageUrl = await generateHeartSync(prompt, negative_prompt);
                
                clearInterval(keepAliveInterval);

                if (proxyImageUrl) {
                    // Simpan metadata ke tempService
                    const dbId = await tempService.save({
                        url: origin + proxyImageUrl,
                        prompt: prompt,
                        source: 'heartsync-gradio'
                    }, 30);
                    
                    // Format SSE: [true] link_proxy
                    await send(`[true] ${origin}/api/temp/${dbId}`);
                } else {
                    await send(`[false] Gagal menghasilkan gambar.`);
                }
            } catch (err) {
                if (keepAliveInterval) clearInterval(keepAliveInterval);
                await send(`[false] ${err.message}`);
            } finally {
                try {
                    await writer.close();
                } catch (e) {}
            }
        })();

        return new Response(customStream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}