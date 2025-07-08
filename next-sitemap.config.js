/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://bethelia.com",
  generateRobotsTxt: false,
  cleanup: true,
  changefreq: "daily",
  priority: 0.7,

  exclude: [
    "/404",
    "/cart",
    "/checkout",
    "/checkout/*",
    "/payment-details",
    "/payment-failed",
    "/orders",
    "/orders/*",
    "/buyer-messages",
    "/buyer-dashboard",
    "/buyer-dashboard/*",
    "/admin-login",
    "/admin-dashboard",
    "/admin-dashboard/*",
    "/supplier-dashboard",
    "/supplier-dashboard/*",
    "/user-*",
    "/api/**",
    "/sentry-example-page",
    "/sentry-example-page/*",
  ],

  additionalPaths: async (config) => [
    {
      loc: "https://bethelia.com",
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 1.0,
    },
  ],
};
