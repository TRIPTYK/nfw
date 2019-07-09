echo "Installing NFW ......"
echo "What folder name should we set ?"
read foldername
git clone https://github.com/TRIPTYK/nfw.git $foldername
echo "setup folder"
cd $foldername
rm -rf .git
yarn install
