/**
 * @title Komiku Chapter
 * @summary Baca Chapter.
 * @description Mendapatkan daftar gambar dari chapter tertentu untuk dibaca.
 * @method GET
 * @path /api/anime/komiku/chapter
 * @response json
 * @param {string} query.url - URL lengkap atau path chapter (contoh: /solo-leveling-chapter-01/).
 * @example
 * async function getChapter() {
 *   const res = await fetch('/api/anime/komiku/chapter?url=/solo-leveling-chapter-01/');
 *   const data = await res.json();
 *   console.log(data);
 * }
 */
const { getChapterImages } = require('../../komiku');

const komikuChapterController = async (req) => {
    const { url } = req.query;
    if (!url) throw new Error("Parameter 'url' wajib diisi.");

    const result = await getChapterImages(url);
    return { success: true, author: 'PuruBoy', result };
};

module.exports = komikuChapterController;