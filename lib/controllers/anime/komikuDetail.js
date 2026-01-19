/**
 * @title Komiku Detail
 * @summary Detail Komik.
 * @description Mendapatkan informasi detail komik termasuk daftar chapter.
 * @method GET
 * @path /api/anime/komiku/detail
 * @response json
 * @param {string} query.url - URL lengkap atau path dari komik (contoh: /manga/solo-leveling/).
 * @example
 * async function getDetail() {
 *   const res = await fetch('/api/anime/komiku/detail?url=/manga/solo-leveling/');
 *   const data = await res.json();
 *   console.log(data);
 * }
 */
const { getComicDetail } = require('../../komiku');

const komikuDetailController = async (req) => {
    const { url } = req.query;
    if (!url) throw new Error("Parameter 'url' wajib diisi.");

    const result = await getComicDetail(url);
    return { success: true, author: 'PuruBoy', result };
};

module.exports = komikuDetailController;