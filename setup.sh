echo "Installing NFW ......"
echo "What folder name should we set ?"
read foldername
git clone https://github.com/TRIPTYK/nfw.git $foldername
cd nfw
rm -rf .git
yarn install
