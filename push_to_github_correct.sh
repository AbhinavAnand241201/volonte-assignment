#!/bin/bash

# Script to push the Task Board application to GitHub using the existing repository
echo "Pushing Task Board application to GitHub using existing repository..."

# Make sure we're in the task-board directory
cd "$(dirname "$0")"

# Check if remote already exists
if git remote | grep -q "origin"; then
  echo "Remote 'origin' already exists. Updating remote URL..."
  git remote set-url origin https://github.com/AbhinavAnand241201/volonte-assignment.git
else
  echo "Adding remote repository..."
  git remote add origin https://github.com/AbhinavAnand241201/volonte-assignment.git
fi

# Add all files to git
echo "Adding files to git..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Task Board Application - Enhanced Version"

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo "Done! Check your GitHub repository at https://github.com/AbhinavAnand241201/volonte-assignment"
