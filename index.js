#!/usr/bin/env node

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Mapping platform to API endpoints
const PLATFORM_API_MAP = {
  instagram: "https://universaldownloaderapi.vercel.app/api/meta/download?url=",
  facebook: "https://universaldownloaderapi.vercel.app/api/meta/download?url=",
  youtube: "https://yt-dl-mp4.vercel.app/api/ytmp4?url=",
  tiktok: "https://tiktok-dl-kappa-jade.vercel.app/api/tiktok?url=",
  reddit: "https://universaldownloaderapi.vercel.app/api/reddit/download?url=",
  pinterest: "https://universaldownloaderapi.vercel.app/api/pinterest/download?url=",
  threads: "https://universaldownloaderapi.vercel.app/api/threads/download?url=",
  linkedin: "https://universaldownloaderapi.vercel.app/api/linkedin/download?url=",
  twitter: "https://universaldownloaderapi.vercel.app/api/twitter/download?url=",
  "x.com": "https://universaldownloaderapi.vercel.app/api/twitter/download?url="
};

// Get URL from command line
const url = process.argv[2];
if (!url) {
  console.log("⚠️  Usage: dl <video_url>");
  process.exit(1);
}

// Detect platform
const hostname = new URL(url).hostname.toLowerCase();

let platform = null;
// Fix for YouTube URLs
if (hostname.includes("youtube") || hostname.includes("youtu.be")) {
  platform = "youtube";
} else {
  platform = Object.keys(PLATFORM_API_MAP).find(p => hostname.includes(p));
}

if (!platform) {
  console.log("❌ Unsupported platform!");
  process.exit(1);
}

// Build API URL
const apiUrl = PLATFORM_API_MAP[platform] + encodeURIComponent(url);
console.log(`🚀 Fetching from ${platform}...`);

// Download folder on phone
const downloadDir = "/sdcard/Download";
fs.ensureDirSync(downloadDir);

(async () => {
  try {
    const res = await axios.get(apiUrl, { timeout: 30000 });
    const data = res.data;

    // Extract video URL from API response (supports all platforms)
    let videoUrl = null;

    // TikTok / Instagram / Pinterest / Threads / Twitter / X / LinkedIn
    if (data?.data?.[0]?.url) videoUrl = data.data[0].url;
    // Some nested APIs
    else if (data?.data?.data?.[0]?.url) videoUrl = data.data.data[0].url;
    // YouTube
    else if (data?.result?.mp4) videoUrl = data.result.mp4;
    // Facebook (meta API)
    else if (data?.data?.data?.[0]?.url) videoUrl = data.data.data[0].url;
    // Other fallback (HD / original media)
    else if (data?.data?.meta?.media?.[0]?.hd) videoUrl = data.data.meta.media[0].hd;
    else if (data?.data?.meta?.media?.[0]?.org) videoUrl = data.data.meta.media[0].org;

    if (!videoUrl) throw new Error("Video URL not found");

    // Create output file path
    const timestamp = Date.now();
    const output = path.join(downloadDir, `${platform}_${timestamp}.mp4`);
    console.log("⏳ Downloading...");

    // Download video
    const videoRes = await axios({
      url: videoUrl,
      method: "GET",
      responseType: "stream"
    });

    const writer = fs.createWriteStream(output);
    videoRes.data.pipe(writer);

    writer.on("finish", () => console.log(`✅ Saved as ${output}`));
    writer.on("error", err => console.error("❌ Error saving video:", err));

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();
