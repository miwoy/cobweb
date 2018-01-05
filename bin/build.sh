rm -rf build
mkdir build
cp package.json build/package
cp -rf bin build/bin
cp -rf src build/src
cp -rf views build/views
babel app.js -o build/app.js
babel application -d build/application
babel lib -d build/lib
babel models -d build/models
babel routes -d build/routes