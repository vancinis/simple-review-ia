#!/bin/bash

# Setup script for simple-review-ia package

echo "🚀 Setting up simple-review-ia package..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the package
echo "🔨 Building package..."
npm run build

echo "✅ Setup complete! The package is ready to use."
echo ""
echo "📝 To test the package:"
echo "   node example.js"
echo ""
echo "📦 To publish to npm:"
echo "   npm publish"