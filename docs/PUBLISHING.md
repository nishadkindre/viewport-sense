# Publishing Guide

Simple guide to publish viewport-sense to npm.

## Prerequisites

- npm account (create at [npmjs.com](https://npmjs.com))
- Login to npm: `npm login`

## Pre-publish Checklist

### 1. Update version
```bash
# Choose one:
npm version patch    # 1.0.0 → 1.0.1
npm version minor    # 1.0.0 → 1.1.0  
npm version major    # 1.0.0 → 2.0.0
```

### 2. Run tests and build
```bash
npm test
npm run build
npm run lint
```

### 3. Check package contents
```bash
npm pack --dry-run
```

## Publishing

### First time publish
```bash
npm publish
```

### Update existing package
```bash
npm publish
```

### Publish beta version
```bash
npm publish --tag beta
```

## Post-publish

### 1. Verify on npm
- Visit: `https://www.npmjs.com/package/viewport-sense`
- Check version and files

### 2. Test installation
```bash
# In a test directory
npm install viewport-sense
```

### 3. Create Git tag
```bash
git push origin main
git push --tags
```

## Troubleshooting

- **Permission denied**: Run `npm login` first
- **Version exists**: Update version with `npm version patch`
- **Package name taken**: Change name in `package.json`
- **Files missing**: Check `files` array in `package.json`

## Package Info

- **Name**: `viewport-sense`
- **Registry**: npm public registry
- **Formats**: ESM, CommonJS, UMD
- **TypeScript**: Full type definitions included