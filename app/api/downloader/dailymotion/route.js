import { NextResponse } from 'next/server';
import { getVideoInfo } from '../../../../lib/dailymotion';
import { encrypt } from '../../../../lib/crypto';
import tempService from '../../../../lib/tempService';

export const runtime = 'nodejs';
export const maxDuration = 60; 

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

        // Enkripsi URL target dan header yang dibutuhkan (Cookie & UA)
        const encrypted = encrypt(JSON.stringify({
            url: info.streamUrl,
            headers: {
                'Cookie': info.cookies.join('; '),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.dailymotion.com/'
            }
        }));
        
        const resultUrl = `${origin}/api/media/${encrypted}`;

        const finalData = {
            title: info.title,
            thumbnail: info.thumbnail?.url,
            channel: info.channel?.displayName,
            duration: info.duration,
            views: info.viewCount,
            url: resultUrl
        };

        // Simpan hasil ke temp store agar bisa di-retrieve via /api/temp/[id]
        const tempId = await tempService.save(finalData, 30);

        return NextResponse.json({
            success: true,
            author: "PuruBoy",
            tempId: tempId,
            result: finalData
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false,
            error: error.message 
        }, { status: 500 });
    }
}