const axios = require('axios');

async function askGemini(text) {
    if (!text || typeof text !== 'string' || !text.trim()) {
        throw new Error('Parameter text harus berupa string dan tidak boleh kosong');
    }

    try {
        const cookieRes = await axios.post(
            "https://gemini.google.com/_/BardChatUi/data/batchexecute?rpcids=maGuAc&source-path=%2F&bl=boq_assistant-bard-web-server_20250814.06_p1&f.sid=-7816331052118000090&hl=en-US&_reqid=173780&rt=c",
            "f.req=%5B%5B%5B%22maGuAc%22%2C%22%5B0%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&",
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
                },
                timeout: 15000
            }
        );

        const setCookieHeader = cookieRes.headers['set-cookie'];
        if (!setCookieHeader || !Array.isArray(setCookieHeader)) {
            throw new Error('Gagal mendapatkan cookie dari Gemini');
        }

        const cookie = setCookieHeader[0].split('; ')[0];

        const payloadArray = [[text.trim()], ["en-US"], null];
        const innerPayload = [null, JSON.stringify(payloadArray)];
        const bodyData = { "f.req": JSON.stringify(innerPayload) };
        const body = new URLSearchParams(bodyData).toString();

        const response = await axios.post(
            "https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20250729.06_p0&f.sid=4206607810970164620&hl=en-US&_reqid=2813378&rt=c",
            body,
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                    "x-goog-ext-525001261-jspb": "[1,null,null,null,\"9ec249fc9ad08861\",null,null,null,[4]]",
                    "cookie": cookie
                },
                timeout: 30000
            }
        );

        if (response.status !== 200) {
            throw new Error(`Gemini error: ${response.status} ${response.statusText}`);
        }

        const data = response.data;
        const matches = [...data.matchAll(/^\d+\n(.+?)\n/gm)].reverse();

        if (matches.length < 4) {
            throw new Error('Respons Gemini tidak lengkap atau format berubah');
        }

        const selectedLine = matches[3][1];
        const realArray = JSON.parse(selectedLine);
        const parse1 = JSON.parse(realArray[0][2]);

        let textResponse = parse1[4][0][1][0] || '';
        textResponse = textResponse.replace(/\*\*(.+?)\*\*/g, '*$1*');

        return textResponse.trim();
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { askGemini };