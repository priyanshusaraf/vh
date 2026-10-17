// Records the displayed width and height of every photo in public/ in
// data/image-sizes.json, so the gallery and product pages can show each photo
// at its own proportions instead of cropping it. Re-run after adding photos:
//   node scripts/image-sizes.mjs
// Photos missing from the file still work; they are shown in a square box.
import sharp from "sharp";
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");

async function* photos(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* photos(full);
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) yield full;
  }
}

const sizes = {};
for await (const file of photos(pub)) {
  const { width, height, orientation } = await sharp(file).metadata();
  // EXIF orientations 5-8 are rotated a quarter turn when displayed.
  const turned = orientation >= 5;
  sizes["/" + path.relative(pub, file).split(path.sep).join("/")] = turned
    ? [height, width]
    : [width, height];
}
const sorted = Object.fromEntries(
  Object.entries(sizes).sort(([a], [b]) => a.localeCompare(b)),
);
// One photo per line keeps diffs readable.
const lines = Object.entries(sorted).map(
  ([file, [w, h]]) => `  ${JSON.stringify(file)}: [${w}, ${h}]`,
);
await writeFile(
  path.join(root, "data", "image-sizes.json"),
  `{\n${lines.join(",\n")}\n}\n`,
);
console.log(`Wrote sizes for ${Object.keys(sorted).length} photos`);
