rm -rf build
mkdir build

npx babel ./ -d build/ --only "application/*,lib/*,models/*,routes/*,views/*,app.js"
npx babel bin/ -d build/bin/ --copy-files
npx babel src/ -d build/src/ --copy-files
cp ./README.md build/ 
cp ./package.json build/ 