// Generates public/og-image.jpg (1200x630) for social sharing.
// Reads an existing product photo; writes a NEW file. Does not modify sources.
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'public', 'FEEL FRESH LARGE 1500ml.jpeg');
const out = path.join(root, 'public', 'og-image.jpg');

const WIDTH = 1200;
const HEIGHT = 630;

await sharp(source)
  .resize({
    width: WIDTH,
    height: HEIGHT,
    fit: 'contain',
    background: { r: 255, g: 255, b: 255 }, // clean white; product photos sit on white
  })
  .jpeg({ quality: 82 })
  .toFile(out);

console.log('Wrote', out);
