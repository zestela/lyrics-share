const searchApi = "https://lrclib.net/api/search?q=";
const lrcApi = "https://lrclib.net/api/get/";
const coverApi = "http://38.246.252.232:28883/cover?title=";

export async function converter(id) {
    let response = await fetch(lrcApi + id);
    return String(JSON.parse(await response.text()).syncedLyrics).replace(/\[(.*?)\]/g, "").replace(/^\s*\n/g, "")
}

export async function cover(name) {
    let response = await fetch(coverApi + name, {
        method: 'GET',
        headers: {
            "Authorization": "user",
        },
    });
    const url = window.URL.createObjectURL(await response.blob());
    return url;
}

export async function search(name) {
    let response = await fetch(searchApi + name);
    return JSON.parse(await response.text());
}