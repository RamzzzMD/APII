/**
 * @title Create ChatBOT
 * @summary AI Chatbot with custom system instructions.
 * @description Berinteraksi dengan AI Chatbot yang mendukung instruksi sistem kustom dan identitas pengguna (userId) untuk manajemen sesi.
 * @method POST
 * @path /api/ai/chatbot
 * @response json
 * @param {string} body.userId - ID Unik pengguna (Contoh: "Puru").
 * @param {string} body.prompt - Pesan atau pertanyaan yang dikirimkan.
 * @param {string} [body.system] - Instruksi kepribadian atau batasan sistem AI.
 * @example
 * async function chat() {
 *   const res = await fetch('/api/ai/chatbot', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ 
 *       "userId": "Puru", 
 *       "prompt": "Halo, siapa namamu?",
 *       "system": "kamu adalah model buatan Puru Puru jawaban kamu harus ramah pake emoji dan panjang"
 *     })
 *   });
 *   const data = await res.json();
 *   console.log(data);
 * }
 */
const { askChatbot } = require('../../chatbot');

const chatbotController = async (req) => {
    const { userId, prompt, system } = req.body;

    if (!userId || !prompt) {
        throw new Error("Parameter 'userId' dan 'prompt' wajib diisi.");
    }

    const result = await askChatbot(userId, prompt, system || '');

    return {
        success: true,
        author: 'PuruBoy',
        result: result
    };
};

module.exports = chatbotController;