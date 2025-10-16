#!/bin/bash
echo "📦 Installing Denish Downloader CLI..."
pkg install nodejs git -y
git clone https://github.com/Ryukazi/All-dl-by-denish.git
cd All-dl-by-denish
npm install -g
echo "✅ Installed successfully!"
echo "Use it by typing: denish-dl <video_url>"
