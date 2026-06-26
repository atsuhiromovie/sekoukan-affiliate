import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svg = readFileSync(join(__dirname, 'favicon-source.svg'));

// app/icon.png — 512x512（Next.jsが自動でファビコン/リンクとして配信）
await sharp(svg).resize(512, 512).png().toFile(join(root, 'app', 'icon.png'));

// app/favicon.ico — 16/32/48をパックしたマルチサイズICO
const sizes = [16, 32, 48];
const buffers = await Promise.all(
  sizes.map((s) => sharp(svg).resize(s, s).png().toBuffer())
);
const ico = await pngToIco(buffers);
writeFileSync(join(root, 'app', 'favicon.ico'), ico);

console.log('generated: app/icon.png (512), app/favicon.ico (16/32/48)');
