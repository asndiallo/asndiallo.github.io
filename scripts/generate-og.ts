/**
 * Renders public/og-default.png (1200×630) from an SVG template.
 * Run with `pnpm og` after changing the copy below; the PNG is committed.
 */
import sharp from "sharp";

const headline = ["Get found on Google.", "Get more calls and bookings."];
const subline = "Local SEO for African-owned businesses in the US";
const footer = "Assane Diallo  ·  English &amp; French  ·  asndiallo.github.io";

const serif = "Iowan Old Style, Palatino, Georgia, serif";
const sans = "Helvetica Neue, Arial, sans-serif";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect x="900" y="0" width="300" height="630" fill="#edf4f1"/>
  <g stroke="#ffffff" stroke-width="22">
    <path d="M985 0v630M1125 0v630M900 170h300M900 400h300"/>
  </g>
  <g transform="translate(945 180) scale(4.4)">
    <path d="M24 3c-8.3 0-15 6.5-15 14.6C9 29 24 45 24 45s15-16 15-27.4C39 9.5 32.3 3 24 3z" fill="#e8a33d" stroke="#16213a" stroke-width="2"/>
    <circle cx="24" cy="18" r="5.5" fill="#ffffff" stroke="#16213a" stroke-width="2"/>
  </g>
  <rect x="80" y="96" width="72" height="10" rx="5" fill="#0b6b4c"/>
  <text font-family="${serif}" font-weight="700" font-size="58" fill="#16213a">
    ${headline.map((line, i) => `<tspan x="80" y="${215 + i * 74}">${line}</tspan>`).join("")}
  </text>
  <text x="80" y="410" font-family="${sans}" font-size="32" fill="#4b5568">${subline}</text>
  <text x="80" y="540" font-family="${sans}" font-weight="700" font-size="28" fill="#0b6b4c">${footer}</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile("public/og-default.png");
console.log("Wrote public/og-default.png");
