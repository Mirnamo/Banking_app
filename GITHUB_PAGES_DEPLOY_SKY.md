name: Deploy sky to GitHub Pages

on:
  push:
    branches:
      - main
      - develop
    paths:
      - 'sky/**'
      - 'GITHUB_PAGES_DEPLOY.md'
  pull_request:
    branches:
      - main
      - develop
    paths:
      - 'sky/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages-sky"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'sky/package-lock.json'

      - name: Install dependencies
        working-directory: sky
        run: npm ci

      - name: Build
        working-directory: sky
        run: npm run build

      - name: Upload artifact
        if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop')
        uses: actions/upload-pages-artifact@v2
        with:
          path: 'sky/out'

  deploy:
    if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop')
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
