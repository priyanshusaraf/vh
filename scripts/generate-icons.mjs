// Generates the favicon and app icons from public/vh-logo.png.
// Crops the round VH mark (dropping the TM and the wordmark), places it on a
// white disc so it stays visible on dark browser tabs, and writes:
//   public/favicon.ico (16, 32, 48), public/apple-touch-icon.png (180),
//   public/icon-192.png, public/icon-512.png
// Run with: node scripts/generate-icons.mjs
// Then bump ICON_VERSION in pages/_document.js and the ?v= in
// public/site.webmanifest, or browsers keep showing the old icons.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = (f) => path.join(root, "public", f);

// The mark is a 65x64 circle at the top-left of the 73x74 logo; the TM sits
// in its top-right corner, so erase that corner before cropping.
const mark = await sharp(pub("vh-logo.png"))
  .ensureAlpha()
  .composite([
    {
      input: Buffer.from(
        '<svg width="15" height="11"><rect width="15" height="11" fill="#000"/></svg>',
      ),
      left: 58,
      top: 0,
      blend: "dest-out",
    },
  ])
  .extract({ left: 0, top: 0, width: 65, height: 64 })
  .resize(64, 64)
  .png()
  .toBuffer();

async function icon(size, { padding = 0.08, round = true } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const disc = Buffer.from(
    `<svg width="${size}" height="${size}">${
      round
        ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>`
        : `<rect width="${size}" height="${size}" fill="#fff"/>`
    }</svg>`,
  );
  return sharp(disc)
    .composite([
      {
        input: await sharp(mark)
          .resize(inner, inner, { kernel: "lanczos3" })
          .toBuffer(),
        gravity: "center",
      },
    ])
    .png()
    .toBuffer();
}

// ICO files may embed PNG images directly.
function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const entry = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, entry);
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.data)]);
}

const sizes = [16, 32, 48];
await writeFile(
  pub("favicon.ico"),
  ico(
    await Promise.all(
      sizes.map(async (size) => ({
        size,
        data: await icon(size, { padding: 0.02 }),
      })),
    ),
  ),
);
// iOS rounds the corners itself, so the touch icon is a full white square.
await writeFile(
  pub("apple-touch-icon.png"),
  await icon(180, { padding: 0.12, round: false }),
);
await writeFile(pub("icon-192.png"), await icon(192, { padding: 0.1 }));
await writeFile(pub("icon-512.png"), await icon(512, { padding: 0.1 }));
console.log("Wrote favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png");
