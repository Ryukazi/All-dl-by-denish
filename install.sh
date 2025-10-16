#!/bin/bash
echo "📦 Installing DL CLI..."

# Install required packages
pkg update -y
pkg upgrade -y
pkg install nodejs git -y

# Clone your repo
rm -rf ~/All-dl-by-denish
git clone https://github.com/Ryukazi/All-dl-by-denish.git ~/All-dl-by-denish

# Install dependencies
cd ~/All-dl-by-denish
npm install

# Make script executable
chmod +x index.js

# Create ~/bin if not exists and symlink
mkdir -p ~/bin
ln -sf ~/All-dl-by-denish/index.js ~/bin/dl

# Add ~/bin to PATH if not already
grep -qxF 'export PATH=$HOME/bin:$PATH' ~/.bashrc || echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc
export PATH=$HOME/bin:$PATH

echo "✅ Installed successfully!"
echo "Use it by typing: dl <video_url>"
echo "Make sure Termux has storage access: termux-setup-storage"
