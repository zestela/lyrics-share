const lrcApi = "https://api.lrc.cx/lyrics";
const coverApi = "https://api.lrc.cx/cover";

export async function converter(name) {
    let response = await fetch(lrcApi + "?title=" + name);
    return {
        lrc: String(await response.text()).replace(/\[(.*?)\]/g, "").replace(/^\s*\n/g,""),
        cover: coverApi + "?title=" + name
    }
}