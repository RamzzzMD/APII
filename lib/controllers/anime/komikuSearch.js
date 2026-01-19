/**
 * @title Komiku Search
 * @summary Cari Manga/Komik.
 * @description Mencari manga, manhwa, atau manhua di Komiku.org.
 * @method GET
 * @path /api/anime/komiku/search
 * @response json
 * @param {string} query.q - Kata kunci pencarian.
 * @example
 * async function search() {
 *   const res = await fetch('/api/anime/komiku/search?q=Solo Leveling');
 *   const data = await res.json();
 *   console.log(data);
 * }
 */
const { searchComics } = require('../../komiku');

const komikuSearchController = async (req) => {
    const { q } = req.query;
    if (!q) throw new Error("Parameter 'q' wajib diisi.");
    
    const result = await searchComics(q);
    return { success: true, author: 'PuruBoy', result };
};

module.exports = komikuSearchController;