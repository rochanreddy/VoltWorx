// sitemap-generator.js
const fs = require("fs");
const baseUrl = "https://www.volt-worx.com";

const staticRoutes = [
  "",
  "/register",
  "/login",
  "/community",
  "/contact-us",
  "/terms-and-conditions",
  "/privacy-policy",
  "/refund-policy",
  "/disclaimer",
  "/faq",
];

const generateSitemap = () => {
  const urls = staticRoutes
    .map((route) => {
      return `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  fs.writeFileSync("public/sitemap.xml", sitemap, "utf8");
  console.log("✅ sitemap.xml generated!");
};

generateSitemap();
