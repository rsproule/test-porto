#!/bin/bash

echo "🧹 Starting deep clean of Expo app..."

# Stop any running Metro bundler
echo "1️⃣ Killing Metro bundler processes..."
pkill -f "react-native" || true
pkill -f "expo start" || true

# Clear watchman
echo "2️⃣ Clearing watchman..."
watchman watch-del-all 2>/dev/null || echo "   Watchman not installed or no watches"

# Clear Metro bundler cache
echo "3️⃣ Clearing Metro bundler cache..."
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true

# Clear Expo cache
echo "4️⃣ Clearing Expo cache..."
rm -rf .expo
rm -rf .expo-shared

# Clear node_modules cache
echo "5️⃣ Clearing node_modules cache..."
rm -rf node_modules/.cache

# Clear iOS simulator (if running iOS)
echo "6️⃣ Resetting iOS Simulator..."
xcrun simctl shutdown all 2>/dev/null || true
xcrun simctl erase all 2>/dev/null || echo "   iOS Simulator not available or already clean"

# Clear temp directories
echo "7️⃣ Clearing temp directories..."
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-map-* 2>/dev/null || true

# Clear pnpm cache (optional but thorough)
echo "8️⃣ Clearing pnpm cache..."
pnpm store prune

echo ""
echo "✅ Deep clean complete!"
echo ""
echo "Next steps:"
echo "  1. Reinstall dependencies: pnpm install"
echo "  2. Start with clean cache: expo start -c"
echo ""

