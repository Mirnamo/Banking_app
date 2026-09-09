name: Deploy finflow to GitHub Pages

on:
  push:
    branches:
      - main
      - develop
    paths:
      - 'finflow/**'
      - 'GITHUB_PAGES_DEPLOY.md'
  pull_request:
    branches:
      - main
      - develop
    paths:
      - 'finflow/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages-finflow"
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
          cache-dependency-path: 'finflow/package-lock.json'

      - name: Install dependencies
        working-directory: finflow
        run: npm ci

      - name: Build
        working-directory: finflow
        run: npm run build

      - name: Upload artifact
        if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop')
        uses: actions/upload-pages-artifact@v2
        with:
          path: 'finflow/dist'

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
