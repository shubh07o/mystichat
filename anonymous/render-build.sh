#!/usr/bin/env bash
# exit on error
set -o errexit

# Create the directory structure if it doesn't exist
mkdir -p /opt/render/project/src

# Copy all files to the expected directory
cp -r ./* /opt/render/project/src/

# Navigate to the directory
cd /opt/render/project/src

# Install dependencies
npm install

# Build the project (if you have a build step)
# npm run build  # Uncomment if you need a build step 