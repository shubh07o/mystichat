#!/usr/bin/env bash
# exit on error
set -o errexit

# Ensure we're in the correct directory
cd /opt/render/project/src

# Install dependencies
npm install

# Build the project (if you have a build step)
# npm run build  # Uncomment if you need a build step 