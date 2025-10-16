#!/bin/bash
echo "📦 Installing Denish Downloader CLI..."

# Install dependencies
pkg install nodejs git -y

# Clone the repo
git clone https://github.com/Ryukazi/All-dl-by-denish.git
cd All-dl-by-denish

# Install dependencies globally
npm install fs-extra axios -g

# Link the CLI globally
npm install -g

echo "✅ Installed successfully!"
echo "Use it by typing: denish-dl <video_url>"
