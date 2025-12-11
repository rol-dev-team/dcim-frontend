# Vite Migration Guide

## What Changed

Your project has been successfully converted from Create React App to **Vite**. Vite is significantly faster for both development and builds.

### Key Changes Made:

1. **Configuration Files**
   - Added `vite.config.js` - Vite configuration with React plugin
   - Updated `vitest.config.js` - Testing configuration for Vitest
   - Moved `index.html` to project root (Vite entry point)

2. **package.json Updates**
   - Removed `react-scripts` dependency
   - Added Vite and React plugin dependencies
   - Updated npm scripts:
     - `npm run dev` - Start development server (was `npm start`)
     - `npm run build` - Production build (same command, faster)
     - `npm run preview` - Preview production build locally
     - `npm run test` - Run tests with Vitest (was `react-scripts test`)

3. **Environment Variables**
   - Changed prefix from `REACT_APP_` to `VITE_`
   - Updated `.env.development` and `.env.production`
   - Updated `src/api/api-config/config.js` to use `import.meta.env.VITE_API_URL`

4. **File Extensions**
   - Renamed JSX files to use `.jsx` extension:
     - `src/App.js` → `src/App.jsx`
     - `src/index.js` → `src/index.jsx`
     - `src/static-data/data.js` → `src/static-data/data.jsx`
     - `src/App.test.js` → `src/App.test.jsx`
   - Vite requires explicit `.jsx` extension for JSX files

5. **Fixed Import Issues**
   - Fixed named/default export mismatch in `src/pages/Dashboard.jsx`

## Getting Started

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
```

## Performance Improvements

Vite offers significant speed improvements:
- **Dev Server**: ~10x faster startup and HMR (Hot Module Replacement)
- **Build Time**: ~3-5x faster production builds
- **Better caching**: Vite uses native ES modules in development

## What's Next

1. All your existing code and dependencies continue to work
2. Run `npm run dev` to start the development server on `http://localhost:3000`
3. Your API endpoints are configured in `.env.development` and `.env.production`

## Troubleshooting

- If you encounter module not found errors, ensure all JSX files have `.jsx` extension
- For environment variables, use `import.meta.env.VITE_*` instead of `process.env.REACT_APP_*`
- Clear `node_modules` and reinstall if you encounter dependency issues: `rm -rf node_modules && npm install`

## More Information

- [Vite Documentation](https://vitejs.dev/)
- [Vite Guide for React](https://vitejs.dev/guide/)
- [Vitest Documentation](https://vitest.dev/)
