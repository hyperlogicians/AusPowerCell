// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add source extensions for compatibility
config.resolver.sourceExts.push('cjs');

// Ensure proper web platform resolution
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Use Expo's default web shims; no manual aliasing needed

module.exports = config;
