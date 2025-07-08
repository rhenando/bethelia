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
│   │   │   │   ├── 2.pack.gz
│   │   │   │   ├── 3.pack.gz
│   │   │   │   ├── index.pack.gz
│   │   │   │   └── index.pack.gz.old
│   │   │   └── server-development
│   │   │       ├── 0.pack.gz
│   │   │       ├── 1.pack.gz
│   │   │       ├── 2.pack.gz
│   │   │       ├── 3.pack.gz
│   │   │       ├── index.pack.gz
│   │   │       └── index.pack.gz.old
│   │   └── .rscinfo
│   ├── server
│   │   ├── app
│   │   │   ├── _not-found
│   │   │   │   ├── page_client-reference-manifest.js
│   │   │   │   └── page.js
│   │   │   ├── favicon.ico
│   │   │   │   └── route.js
│   │   │   ├── page_client-reference-manifest.js
│   │   │   └── page.js
│   │   ├── vendor-chunks
│   │   │   ├── @reduxjs.js
│   │   │   ├── @swc.js
│   │   │   ├── immer.js
│   │   │   ├── keen-slider.js
│   │   │   ├── lucide-react.js
│   │   │   ├── next.js
│   │   │   ├── react-redux.js
│   │   │   ├── redux-persist.js
│   │   │   ├── redux-thunk.js
│   │   │   ├── redux.js
│   │   │   ├── reselect.js
│   │   │   ├── sonner.js
│   │   │   └── use-sync-external-store.js
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
│   │   │   │   ├── layout.js
│   │   │   │   └── page.js
│   │   │   ├── _app-pages-browser_node_modules_next_dist_client_dev_noop-turbopack-hmr_js.js
│   │   │   ├── app-pages-internals.js
│   │   │   ├── main-app.js
│   │   │   ├── polyfills.js
│   │   │   └── webpack.js
│   │   ├── css
│   │   │   └── app
│   │   │       ├── layout.css
│   │   │       └── page.css
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
│   │       │   ├── layout.25834d6ca2c93309.hot-update.js
│   │       │   └── layout.d4ecd79b5e5a0218.hot-update.js
│   │       ├── 25834d6ca2c93309.webpack.hot-update.json
│   │       ├── 633457081244afec._.hot-update.json
│   │       ├── d4ecd79b5e5a0218.webpack.hot-update.json
│   │       ├── webpack.25834d6ca2c93309.hot-update.js
│   │       └── webpack.d4ecd79b5e5a0218.hot-update.js
│   ├── types
│   │   ├── app
│   │   │   ├── layout.ts
│   │   │   └── page.ts
│   │   ├── cache-life.d.ts
│   │   └── package.json
│   ├── app-build-manifest.json
│   ├── build-manifest.json
│   ├── package.json
│   ├── react-loadable-manifest.json
│   └── trace
├── app
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
│   └── utils.js
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── no-image.jpg
│   ├── vercel.svg
│   └── window.svg
├── store
│   ├── authSlice.js
│   └── store.js
├── .gitignore
├── components.json
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
└── postcss.config.mjs
