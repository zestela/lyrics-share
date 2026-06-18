const searchApi = "https://lrclib.net/api/search?q=";
const lrcApi = "https://lrclib.net/api/get/";
const coverApi = "https://api.zestela.co/cover.php?title=";

export async function converter(id) {
    let response = await fetch(lrcApi + id);
    return String(JSON.parse(await response.text()).plainLyrics).replace(/\[(.*?)\]/g, "").replace(/^\s*\n/g, "")
}

export async function cover(name,singer) {
    let response = await fetch(coverApi + name + "&artist=" + singer);
    const url = window.URL.createObjectURL(await response.blob());
    return url;
}

export async function search(name) {
    let response = await fetch(searchApi + name);
    return JSON.parse(await response.text());
}