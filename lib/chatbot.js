const axios = require('axios');

/**
 * Fungsi untuk mengambil respons dari Chatbot AI eksternal
 * @param {string} userId - ID Pengguna
 * @param {string} prompt - Pesan pengguna
 * @param {string} system - Instruksi sistem
 */
async function askChatbot(userId, prompt, system) {
    try {
        const response = await axios.get('https://ricky01anjay-learning.hf.space/chat', {
            params: {
                userid: userId,
                prompt: prompt,
                system: system
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
}

module.exports = { askChatbot };