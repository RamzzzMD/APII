const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://komiku.org';
const API_URL = 'https://api.komiku.org';

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Referer': BASE_URL,
    'Origin': BASE_URL,
    'X-Requested-With': 'XMLHttpRequest'
};

async function getLatestUpdates(tipe = 'manga', page = 1) {
    try {
        const url = page === 1 
            ? `${API_URL}/manga/?tipe=${tipe}`
            : `${API_URL}/manga/page/${page}/?tipe=${tipe}`;

        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);
        
        const results = [];

        $('.bge').each((i, el) => {
            const element = $(el);
            results.push({
                title: element.find('.kan h3').text().trim(),
                link: element.find('.kan a').attr('href') ? BASE_URL + element.find('.kan a').attr('href') : null,
                image: element.find('img').attr('src')?.split('?')[0],
                type: element.find('.tpe1_inf b').text().trim(),
                genre: element.find('.tpe1_inf').text().replace(element.find('.tpe1_inf b').text(), '').trim(),
                up_status: element.find('.up').text().trim(),
                description: element.find('p').text().trim(),
                latest_chapter: {
                    title: element.find('.new1').last().find('span').last().text().trim(),
                    link: BASE_URL + element.find('.new1').last().find('a').attr('href')
                }
            });
        });

        return results;
    } catch (error) {
        throw new Error(`getLatestUpdates Error: ${error.message}`);
    }
}

async function getComicDetail(endpoint) {
    try {
        const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
        
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);

        const info = {};
        $('.inftable tbody tr').each((i, el) => {
            const key = $(el).find('td').eq(0).text().trim().replace(/ /g, '_').toLowerCase();
            const val = $(el).find('td').eq(1).text().trim();
            info[key] = val;
        });

        const chapters = [];
        $('#Daftar_Chapter tbody tr').each((i, el) => {
            const row = $(el);
            const linkTag = row.find('.judulseries a');
            if (linkTag.length > 0) {
                chapters.push({
                    chapter: linkTag.find('span').text().trim(),
                    url: BASE_URL + linkTag.attr('href'),
                    views: row.find('.pembaca i').text().trim(),
                    date: row.find('.tanggalseries').text().trim()
                });
            }
        });

        return {
            title: $('#Judul h1').text().trim(),
            description: $('.desc').text().trim(),
            cover: $('.ims img').attr('src')?.split('?')[0],
            metadata: info,
            genres: $('.genre li a').map((i, el) => $(el).text().trim()).get(),
            chapters: chapters
        };

    } catch (error) {
        throw new Error(`getComicDetail Error: ${error.message}`);
    }
}

async function getChapterImages(endpoint) {
    try {
        const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);

        const images = [];
        $('#Baca_Komik img').each((i, el) => {
            let src = $(el).attr('src');
            if (!src || src.includes('pixel')) {
                src = $(el).attr('data-src');
            }
            if (src) {
                images.push(src);
            }
        });

        const title = $('#Judul h1').text().trim();
        const nextChapter = $('.nxpr .rl').attr('href') ? BASE_URL + $('.nxpr .rl').attr('href') : null;
        const prevChapter = $('.nxpr .ll').attr('href') ? BASE_URL + $('.nxpr .ll').attr('href') : null;

        return {
            title,
            images,
            navigation: {
                prev: prevChapter,
                next: nextChapter
            }
        };

    } catch (error) {
        throw new Error(`getChapterImages Error: ${error.message}`);
    }
}

async function searchComics(query) {
    try {
        const url = `${BASE_URL}/?post_type=manga&s=${encodeURIComponent(query)}`;

        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);
        
        const results = [];
        $('.bge').each((i, el) => {
            const element = $(el);
            results.push({
                title: element.find('.kan h3').text().trim(),
                link: BASE_URL + element.find('.kan a').attr('href'),
                image: element.find('img').attr('src')?.split('?')[0],
                type: element.find('.tpe1_inf b').text().trim(),
                latest_chapter: element.find('.new1').last().text().replace('Terbaru:', '').trim()
            });
        });

        return results;

    } catch (error) {
        throw new Error(`searchComics Error: ${error.message}`);
    }
}

module.exports = { getLatestUpdates, getComicDetail, getChapterImages, searchComics };