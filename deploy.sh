#!/bin/bash

echo "Build site"
npm install
npm run build
rm -rf node_modules

echo "Removing any pre-existing static file"
cd site
rm -rf *
cd ..

echo "Passing all the new static files from dist to site"
cp dist/* site -rf
