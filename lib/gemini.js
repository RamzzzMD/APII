// @path lib/gemini.js
// @type write

const axios = require('axios');
const cheerio = require('cheerio');

function parseGeminiResponse(html) {
    const $ = cheerio.load(html);
    const latestResponse = $('model-response').last();

    if (latestResponse.length === 0) return "Gagal menemukan respon terbaru.";

    let result = "";
    const markdownPanel = latestResponse.find('.markdown.markdown-main-panel');

    if (markdownPanel.length > 0) {
        markdownPanel.children().each((i, el) => {
            const tagName = el.tagName.toLowerCase();
            const text = $(el).text().trim();

            if (!text) return;

            if (tagName === 'p') {
                let pHtml = $(el).html()
                    .replace(/<strong>(.*?)<\/strong>/g, '*$1*')
                    .replace(/<b>(.*?)<\/b>/g, '*$1*')
                    .replace(/<code>(.*?)<\/code>/g, '_$1_');
                result += cheerio.load(pHtml).text() + "\n\n";
            } 
            else if (/^h[1-6]$/.test(tagName)) {
                result += `*${text.toUpperCase()}*\n`;
            } 
            else if (tagName === 'ul' || tagName === 'ol') {
                $(el).find('li').each((j, li) => {
                    result += "- " + $(li).text().trim() + "\n";
                });
                result += "\n";
            } 
            else if (tagName === 'pre') {
                result += "```\n" + $(el).text().trim() + "\n```\n\n";
            }
        });
    }

    const imageElements = latestResponse.find('.image-button img, .image-container img');
    if (imageElements.length > 0) {
        let imageLinks = "";
        imageElements.each((i, img) => {
            const src = $(img).attr('src');
            if (src && !src.includes('profile/picture')) {
                imageLinks += `\n*Link Gambar ${i + 1}:*\n${src}\n`;
            }
        });
        if (imageLinks) result += "\n_HASIL GENERATE GAMBAR:_" + imageLinks;
    }

    if (!result.trim()) {
        result = latestResponse.find('.model-response-text').last().text().trim();
    }

    return result.trim();
}

async function askGemini(prompt) {
    const API_URL = 'https://puruh2o-gabutcok.hf.space/execute';
    const SESSION_URL = "https://gemini.google.com/";
    const cleanPrompt = prompt.replace(/["\\]/g, '\\$&').replace(/\n/g, '\\n');

    const payload = {
        url: "https://example.com",
        viewport: "mobile",
        code: `
            const FIREBASE_URL = 'https://puru-tools-default-rtdb.firebaseio.com/cookies.json';
            const INPUT_SELECTOR = '.text-input-field_textarea';
            const SEND_BUTTON = '.send-button';
            const MIC_BUTTON = '.speech_dictation_mic_button';

            async function executeAction() {
                try {
                    const fbResponse = await fetch(FIREBASE_URL);
                    const currentCookies = await fbResponse.json();
                    if (currentCookies) await page.setCookie(...currentCookies);

                    await page.goto("${SESSION_URL}", { waitUntil: 'domcontentloaded' });

                    await page.waitForSelector(INPUT_SELECTOR, { visible: true });
                    await page.type(INPUT_SELECTOR, "${cleanPrompt}");
                    await page.click(SEND_BUTTON);

                    await page.waitForSelector(MIC_BUTTON, { visible: true, timeout: 90000 });
                    await new Promise(r => setTimeout(r, 2000));

                    const newCookies = await page.cookies();
                    await fetch(FIREBASE_URL, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newCookies)
                    });
                } catch (err) { console.error(err); }
            }
            await executeAction();
        `
    };

    try {
        const response = await axios.post(API_URL, payload, { timeout: 120000 });
        if (response.data.success && response.data.html) {
            return parseGeminiResponse(response.data.html);
        } else {
            throw new Error("Gagal mengambil data.");
        }
    } catch (error) {
        return `*Gemini Error:* _${error.message}_`;
    }
}

module.exports = { askGemini };