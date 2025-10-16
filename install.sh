#!/bin/bash
echo "📦 Installing DL CLI..."
pkg install nodejs git -y

rm -rf ~/All-dl-by-denish
git clone https://github.com/Ryukazi/All-dl-by-denish.git ~/All-dl-by-denish
cd ~/All-dl-by-denish

npm install
chmod +x index.js

mkdir -p ~/bin
ln -sf ~/All-dl-by-denish/index.js ~/bin/dl

grep -qxF 'export PATH=$HOME/bin:$PATH' ~/.bashrc || echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc
export PATH=$HOME/bin:$PATH

echo "✅ Installed! Use by running: dl <video_url>"
