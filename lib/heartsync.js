const { uploadToTmp } = require('./uploader');

/**
 * Menghasilkan gambar menggunakan HeartSync (Gradio Client)
 * @param {string} prompt
 * @param {string} negativePrompt
 * @returns {Promise<string>} URL gambar proxy
 */
async function generateHeartSync(prompt, negativePrompt) {
    try {
        // Menggunakan dynamic import untuk modul ESM
        const { Client } = await import("@gradio/client");

        const APP_URL = "https://heartsync-nsfw-image.hf.space";
        const client = await Client.connect(APP_URL);

        const PROMPT = prompt;
        const NEGATIVE_PROMPT = negativePrompt || "low quality, bad anatomy, worst quality, watermark, text";

        // Parameter sesuai snippet: prompt, neg, steps, cfg, w, h, batch
        const result = await client.predict("/generate", [
            PROMPT,             
            NEGATIVE_PROMPT,    
            40,                 // Inference Steps
            7.5,                // Guidance Scale
            1024,               // Width
            1024,               // Height
            1                   // Number of Images
        ]);

        if (result.data && Array.isArray(result.data) && result.data[0]) {
            const gallery = result.data[0];
            
            if (Array.isArray(gallery) && gallery.length > 0) {
                const item = gallery[0];
                const imageUrl = item.image?.url || item.url || item;

                if (imageUrl) {
                    // Download gambar dari URL result (biasanya blob/temporary)
                    const imgRes = await fetch(imageUrl);
                    const arrayBuffer = await imgRes.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    // Upload ke penyimpanan sementara
                    const proxyUrl = await uploadToTmp(buffer, `heartsync-${Date.now()}.png`);
                    return proxyUrl;
                }
            }
        }
        
        throw new Error("Tidak ada data gambar yang dikembalikan oleh model.");

    } catch (error) {
        throw new Error(`HeartSync Error: ${error.message}`);
    }
}

module.exports = { generateHeartSync };