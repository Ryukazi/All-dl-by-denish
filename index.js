#!/usr/bin/env node

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Supported platforms with API endpoints
const PLATFORM_API_MAP = {
  "instagram": "https://universaldownloaderapi.vercel.app/api/meta/download?url=",
  "facebook": "https://universaldownloaderapi.vercel.app/api/meta/download?url=",
  "youtube": "https://yt-dl-mp4.vercel.app/api/ytmp4?url=",
  "youtu.be": "https://yt-dl-mp4.vercel.app/api/ytmp4?url=",
  "tiktok": "https://tiktok-dl-kappa-jade.vercel.app/api/tiktok?url=",
  "reddit": "https://universaldownloaderapi.vercel.app/api/reddit/download?url=",
  "pinterest": "https://universaldownloaderapi.vercel.app/api/pinterest/download?url=",
  "threads": "https://universaldownloaderapi.vercel.app/api/threads/download?url=",
  "linkedin": "https://universaldownloaderapi.vercel.app/api/linkedin/download?url=",
  "twitter": "https://universaldownloaderapi.vercel.app/api/twitter/download?url=",
  "x.com": "https://universaldownloaderapi.vercel.app/api/twitter/download?url="
};

// Expand TikTok short URLs
async function expandTikTokUrl(shortUrl) {
  try {
    const res = await axios.get(shortUrl, {
      maxRedirects: 0,
      validateStatus: s => s >= 200 && s < 400
    });
    if (res.status === 301 || res.status === 302) return res.headers.location;
    return shortUrl;
  } catch (err) {
    if (err.response && (err.response.status === 301 || err.response.status === 302)) {
      return err.response.headers.location;
    }
    return shortUrl;
  }
}

const inputUrl = process.argv[2];
if (!inputUrl) {
  console.log("⚠️ Usage: dl <video_url>");
  process.exit(1);
}

(async () => {
  try {
    let url = inputUrl.trim();
    const hostname = new URL(url).hostname.toLowerCase();

    // Expand TikTok short links
    if (hostname.includes("tiktok") && url.includes("vt.tiktok.com")) {
      url = await expandTikTokUrl(url);
    }

    const host = Object.keys(PLATFORM_API_MAP).find(p => url.toLowerCase().includes(p));
    if (!host) {
      console.log("❌ Unsupported platform!");
      process.exit(1);
    }

    const apiUrl = PLATFORM_API_MAP[host] + encodeURIComponent(url);
    console.log(`🚀 Fetching from ${host}...`);

    const res = await axios.get(apiUrl, { timeout: 30000 });
    const data = res.data;

    // Extract video URL from response
    let videoUrl = null;

    if (host.includes("instagram") || host.includes("facebook")) {
      if (data?.data?.data?.length > 0) videoUrl = data.data.data[0].url;
    } else if (host.includes("tiktok")) {
      if (data?.data?.meta?.media?.length > 0) {
        const media = data.data.meta.media[0];
        videoUrl = media.hd || media.org || null;
      }
    } else if (host.includes("youtube") || host.includes("youtu.be")) {
      if (data?.result?.mp4) videoUrl = data.result.mp4;
    } else if (host.includes("reddit") || host.includes("twitter") || host.includes("x.com")) {
      if (data?.data?.[0]?.video_url) videoUrl = data.data[0].video_url;
    }

    if (!videoUrl) throw new Error("Video URL not found");

    const output = path.join(process.cwd(), `video_${Date.now()}.mp4`);
    console.log("⏳ Downloading...");

    const videoRes = await axios({ url: videoUrl, method: "GET", responseType: "stream" });
    const writer = fs.createWriteStream(output);
    videoRes.data.pipe(writer);

    writer.on("finish", () => console.log(`✅ Saved as ${output}`));
    writer.on("error", err => console.error("❌ Download failed:", err.message));

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();
