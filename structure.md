# Project Structure

bethelia
├── .next
│   ├── cache
│   │   ├── swc
│   │   │   └── plugins
│   │   │       └── v7_windows_x86_64_9.0.0
│   │   ├── webpack
│   │   │   ├── client-development
│   │   │   │   ├── 0.pack.gz
│   │   │   │   ├── 1.pack.gz
│   │   │   │   ├── 10.pack.gz
│   │   │   │   ├── 11.pack.gz
│   │   │   │   ├── 12.pack.gz
│   │   │   │   ├── 13.pack.gz
│   │   │   │   ├── 14.pack.gz
│   │   │   │   ├── 15.pack.gz
│   │   │   │   ├── 16.pack.gz
│   │   │   │   ├── 17.pack.gz
│   │   │   │   ├── 18.pack.gz
│   │   │   │   ├── 19.pack.gz
│   │   │   │   ├── 2.pack.gz
│   │   │   │   ├── 20.pack.gz
│   │   │   │   ├── 21.pack.gz
│   │   │   │   ├── 22.pack.gz
│   │   │   │   ├── 3.pack.gz
│   │   │   │   ├── 4.pack.gz
│   │   │   │   ├── 5.pack.gz
│   │   │   │   ├── 6.pack.gz
│   │   │   │   ├── 7.pack.gz
│   │   │   │   ├── 8.pack.gz
│   │   │   │   ├── 9.pack.gz
│   │   │   │   ├── index.pack.gz
│   │   │   │   └── index.pack.gz.old
│   │   │   ├── client-development-fallback
│   │   │   │   ├── 0.pack.gz
│   │   │   │   └── index.pack.gz
│   │   │   └── server-development
│   │   │       ├── 0.pack.gz
│   │   │       ├── 1.pack.gz
│   │   │       ├── 10.pack.gz
│   │   │       ├── 11.pack.gz
│   │   │       ├── 12.pack.gz
│   │   │       ├── 13.pack.gz
│   │   │       ├── 14.pack.gz
│   │   │       ├── 15.pack.gz
│   │   │       ├── 2.pack.gz
│   │   │       ├── 3.pack.gz
│   │   │       ├── 4.pack.gz
│   │   │       ├── 5.pack.gz
│   │   │       ├── 6.pack.gz
│   │   │       ├── 7.pack.gz
│   │   │       ├── 8.pack.gz
│   │   │       ├── 9.pack.gz
│   │   │       ├── index.pack.gz
│   │   │       └── index.pack.gz.old
│   │   └── .rscinfo
│   ├── server
│   │   ├── app
│   │   │   ├── _not-found
│   │   │   │   ├── page_client-reference-manifest.js
│   │   │   │   └── page.js
│   │   │   ├── add-category
│   │   │   │   ├── page_client-reference-manifest.js
│   │   │   │   └── page.js
│   │   │   └── favicon.ico
│   │   │       └── route.js
│   │   ├── pages
│   │   │   ├── _app.js
│   │   │   ├── _document.js
│   │   │   └── _error.js
│   │   ├── vendor-chunks
│   │   │   ├── @reduxjs.js
│   │   │   ├── @swc.js
│   │   │   ├── immer.js
│   │   │   ├── lucide-react.js
│   │   │   ├── next.js
│   │   │   ├── react-redux.js
│   │   │   ├── redux-persist.js
│   │   │   ├── redux-thunk.js
│   │   │   ├── redux.js
│   │   │   ├── reselect.js
│   │   │   ├── sonner.js
│   │   │   └── use-sync-external-store.js
│   │   ├── _error.js
│   │   ├── app-paths-manifest.json
│   │   ├── interception-route-rewrite-manifest.js
│   │   ├── middleware-build-manifest.js
│   │   ├── middleware-manifest.json
│   │   ├── middleware-react-loadable-manifest.js
│   │   ├── next-font-manifest.js
│   │   ├── next-font-manifest.json
│   │   ├── pages-manifest.json
│   │   ├── server-reference-manifest.js
│   │   ├── server-reference-manifest.json
│   │   └── webpack-runtime.js
│   ├── static
│   │   ├── chunks
│   │   │   ├── app
│   │   │   │   ├── _not-found
│   │   │   │   │   └── page.js
│   │   │   │   ├── add-category
│   │   │   │   │   └── page.js
│   │   │   │   └── layout.js
│   │   │   ├── pages
│   │   │   │   ├── _app.js
│   │   │   │   └── _error.js
│   │   │   ├── _app-pages-browser_node_modules_next_dist_client_dev_noop-turbopack-hmr_js.js
│   │   │   ├── _error.js
│   │   │   ├── _pages-dir-browser_node_modules_next_dist_pages__app_js.js
│   │   │   ├── _pages-dir-browser_node_modules_next_dist_pages__error_js.js
│   │   │   ├── app-pages-internals.js
│   │   │   ├── main-app.js
│   │   │   ├── main.js
│   │   │   ├── polyfills.js
│   │   │   ├── react-refresh.js
│   │   │   └── webpack.js
│   │   ├── css
│   │   │   └── app
│   │   │       └── layout.css
│   │   ├── development
│   │   │   ├── _buildManifest.js
│   │   │   └── _ssgManifest.js
│   │   ├── media
│   │   │   ├── 569ce4b8f30dc480-s.p.woff2
│   │   │   ├── 747892c23ea88013-s.woff2
│   │   │   ├── 8d697b304b401681-s.woff2
│   │   │   ├── 93f479601ee12b01-s.p.woff2
│   │   │   ├── 9610d9e46709d722-s.woff2
│   │   │   └── ba015fad6dcf6784-s.woff2
│   │   └── webpack
│   │       ├── app
│   │       │   ├── layout.61bab645834c6ca2.hot-update.js
│   │       │   ├── layout.8b44b6f86131e2f6.hot-update.js
│   │       │   └── layout.bbd378385c5c898d.hot-update.js
│   │       ├── 61bab645834c6ca2.webpack.hot-update.json
│   │       ├── 633457081244afec._.hot-update.json
│   │       ├── 8b44b6f86131e2f6.webpack.hot-update.json
│   │       ├── 8e0131c5c163c042.webpack.hot-update.json
│   │       ├── a28bdb81edf40eb8.webpack.hot-update.json
│   │       ├── bbd378385c5c898d.webpack.hot-update.json
│   │       ├── fde76078e3f914be.webpack.hot-update.json
│   │       ├── webpack.61bab645834c6ca2.hot-update.js
│   │       ├── webpack.8b44b6f86131e2f6.hot-update.js
│   │       ├── webpack.8e0131c5c163c042.hot-update.js
│   │       ├── webpack.a28bdb81edf40eb8.hot-update.js
│   │       ├── webpack.bbd378385c5c898d.hot-update.js
│   │       └── webpack.fde76078e3f914be.hot-update.js
│   ├── types
│   │   ├── app
│   │   │   ├── add-category
│   │   │   │   └── page.ts
│   │   │   └── layout.ts
│   │   ├── cache-life.d.ts
│   │   └── package.json
│   ├── app-build-manifest.json
│   ├── build-manifest.json
│   ├── package.json
│   ├── react-loadable-manifest.json
│   └── trace
├── app
│   ├── add-category
│   │   └── page.jsx
│   ├── api
│   │   └── add-category
│   │       └── route.js
│   ├── buyer
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── buyer-login
│   │   └── page.jsx
│   ├── seller
│   │   ├── documents
│   │   │   └── page.jsx
│   │   ├── products
│   │   │   ├── add
│   │   │   │   └── page.jsx
│   │   │   └── page.jsx
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── seller-login
│   │   └── page.jsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   └── Providers.jsx
├── components
│   ├── ui
│   │   ├── accordion.jsx
│   │   ├── alert-dialog.jsx
│   │   ├── alert.jsx
│   │   ├── aspect-ratio.jsx
│   │   ├── avatar.jsx
│   │   ├── badge.jsx
│   │   ├── breadcrumb.jsx
│   │   ├── button.jsx
│   │   ├── calendar.jsx
│   │   ├── card.jsx
│   │   ├── carousel.jsx
│   │   ├── chart.jsx
│   │   ├── checkbox.jsx
│   │   ├── collapsible.jsx
│   │   ├── command.jsx
│   │   ├── context-menu.jsx
│   │   ├── dialog.jsx
│   │   ├── drawer.jsx
│   │   ├── dropdown-menu.jsx
│   │   ├── form.jsx
│   │   ├── hover-card.jsx
│   │   ├── input-otp.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   ├── menubar.jsx
│   │   ├── navigation-menu.jsx
│   │   ├── pagination.jsx
│   │   ├── popover.jsx
│   │   ├── progress.jsx
│   │   ├── radio-group.jsx
│   │   ├── resizable.jsx
│   │   ├── scroll-area.jsx
│   │   ├── select.jsx
│   │   ├── separator.jsx
│   │   ├── sheet.jsx
│   │   ├── sidebar.jsx
│   │   ├── skeleton.jsx
│   │   ├── slider.jsx
│   │   ├── sonner.jsx
│   │   ├── switch.jsx
│   │   ├── table.jsx
│   │   ├── tabs.jsx
│   │   ├── textarea.jsx
│   │   ├── toggle-group.jsx
│   │   ├── toggle.jsx
│   │   └── tooltip.jsx
│   ├── LayoutShell.js
│   └── NavbarMobile.jsx
├── hooks
│   └── use-mobile.js
├── lib
│   ├── firebase.js
│   ├── firebaseAdmin.js
│   └── utils.js
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── google6c3cfe3090b8e3e3.html
│   ├── next.svg
│   ├── no-image.jpg
│   ├── robots.txt
│   ├── sitemap-0.xml
│   ├── sitemap.xml
│   ├── vercel.svg
│   └── window.svg
├── store
│   ├── authSlice.js
│   └── store.js
├── .gitignore
├── components.json
├── eslint.config.mjs
├── google6c3cfe3090b8e3e3.html
├── jsconfig.json
├── next-sitemap.config.js
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── serviceAccountKey.json
