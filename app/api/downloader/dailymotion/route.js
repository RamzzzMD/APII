import { NextResponse } from 'next/server';
import { getVideoInfo } from '../../../../lib/dailymotion';
import { encrypt } from '../../../../lib/crypto';

export const runtime = 'nodejs';
export const maxDuration = 300; 

export async function POST(req) {
    try {
        const body = await req.json();
        const { url } = body;
        
        if (!url) {
            return NextResponse.json({ error: "Parameter 'url' wajib diisi." }, { status: 400 });
        }

        const origin = new URL(req.url).origin;
        const info = await getVideoInfo(url);
        
        if (!info.streamUrl) {
            throw new Error("Gagal mendapatkan URL stream video.");
        }

        // Dailymotion 'auto' quality is usually an m3u8 playlist.
        // If we want a direct MP4, we should check if there are direct qualities.
        // For now, providing the stream URL directly via proxy.
        
        const encrypted = encrypt(info.streamUrl);
        const resultUrl = `${origin}/api/media/${encrypted}`;

        const finalData = {
            title: info.title,
            thumbnail: info.thumbnail?.url,
            channel: info.channel?.displayName,
            url: resultUrl
        };

        // Save to temp store for fastupdate/UI if needed
        try {
            await fetch(`${origin}/api/temp/save`, {
               method: 'POST',
               body: JSON.stringify(finalData)
            });
        } catch (e) {
            console.error("Temp save failed:", e.message);
        }

        return NextResponse.json({
            success: true,
            author: "PuruBoy",
            result: finalData
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}