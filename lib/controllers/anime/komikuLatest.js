/**
 * @title Komiku Latest
 * @summary Update Manga Terbaru.
 * @description Mendapatkan daftar komik yang baru saja diupdate di Komiku.org.
 * @method GET
 * @path /api/anime/komiku/latest
 * @response json
 * @param {string} [query.type] - Tipe komik: 'manga', 'manhwa', 'manhua' (Default: manga).
 * @param {number} [query.page] - Halaman ke-berapa (Default: 1).
 * @example
 * async function getLatest() {
 *   const res = await fetch('/api/anime/komiku/latest?type=manhwa&page=1');
 *   const data = await res.json();
 *   console.log(data);
 * }
 */
const { getLatestUpdates } = require('../../komiku');

const komikuLatestController = async (req) => {
    const { type, page } = req.query;
    const pageNum = page ? parseInt(page) : 1;
    const comicType = type || 'manga';

    const result = await getLatestUpdates(comicType, pageNum);
    return { success: true, author: 'PuruBoy', result };
};

module.exports = komikuLatestController;