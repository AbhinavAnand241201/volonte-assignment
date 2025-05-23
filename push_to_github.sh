#!/bin/bash

# Script to push the Task Board application to GitHub
echo "Preparing to push Task Board application to GitHub..."

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
fi

# Add all files to git
echo "Adding files to git..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Task Board Application - Initial Commit"

# Add remote repository if not already added
if ! git remote | grep -q "origin"; then
  echo "Adding remote repository..."
  git remote add origin https://github.com/AbhinavAnand241201/volonte-assignment.git
fi

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main || git push -u origin master

echo "Done! Check your GitHub repository at https://github.com/AbhinavAnand241201/volonte-assignment"
