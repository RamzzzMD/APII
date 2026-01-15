import { NextResponse } from 'next/server';
import { decrypt } from '../../../../lib/crypto';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
    const { data } = params;
    
    if (!data) {
        return new NextResponse('Missing data parameter', { status: 400 });
    }

    try {
        const decrypted = decrypt(data);
        if (!decrypted) {
            return new NextResponse('Invalid or Corrupted Token', { status: 400 });
        }

        let targetUrl = '';
        let requestHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        };

        try {
            // Coba parse jika formatnya JSON (berisi URL + Custom Headers)
            const parsed = JSON.parse(decrypted);
            targetUrl = parsed.url;
            if (parsed.headers) {
                requestHeaders = { ...requestHeaders, ...parsed.headers };
            }
        } catch (e) {
            // Jika bukan JSON, anggap sebagai raw URL string
            targetUrl = decrypted;
        }
        
        if (!targetUrl || !targetUrl.startsWith('http')) {
             return new NextResponse('Invalid Target URL', { status: 400 });
        }

        // Gunakan axios stream untuk mem-proxy konten
        const response = await axios.get(targetUrl, {
            responseType: 'stream',
            timeout: 60000, // Tingkatkan timeout untuk stream video
            headers: requestHeaders,
            validateStatus: () => true // Izinkan semua status code agar bisa diteruskan
        });

        const headers = new Headers();
        
        // Teruskan header penting dari sumber asli
        const importantHeaders = ['content-type', 'content-length', 'accept-ranges', 'content-range'];
        importantHeaders.forEach(h => {
            if (response.headers[h]) {
                headers.set(h, response.headers[h]);
            }
        });

        // Pengaturan Cache & Identitas Proxy
        headers.set('Cache-Control', 'public, max-age=3600');
        headers.set('X-Proxy-By', 'PuruBoy-Secure-Media');

        // Jika request dari browser meminta range (untuk pemutaran video)
        const range = req.headers.get('range');
        if (range) {
            // Catatan: Forwarding range request secara manual membutuhkan logika tambahan.
            // Untuk saat ini, kita mengembalikan seluruh stream.
        }

        return new NextResponse(response.data, { 
            status: response.status,
            headers 
        });

    } catch (error) {
        console.error("Proxy Media Error:", error.message);
        return new NextResponse(`Media Error: ${error.message}`, { status: 500 });
    }
}