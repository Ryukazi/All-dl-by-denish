#!/bin/bash
echo "📦 Installing Denish Downloader CLI..."

# Install dependencies
pkg install nodejs git -y

# Clone the repo
git clone https://github.com/Ryukazi/All-dl-by-denish.git ~/All-dl-by-denish
cd ~/All-dl-by-denish

# Install Node dependencies locally
npm install

# Create a global symlink in Termux
mkdir -p ~/bin
ln -sf ~/All-dl-by-denish/index.js ~/bin/denish-dl

# Add execute permission
chmod +x ~/bin/denish-dl

# Make sure ~/bin is in PATH
if ! echo $PATH | grep -q "$HOME/bin"; then
    echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc
    export PATH=$HOME/bin:$PATH
fi

echo "✅ Installed successfully!"
echo "Use it by typing: denish-dl <video_url>"
