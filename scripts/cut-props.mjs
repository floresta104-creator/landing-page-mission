import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const assets = path.resolve(
  'C:/Users/Administrator/.cursor/projects/c-Users-Administrator-Desktop-orbiroomrand/assets',
);
const outDir = path.resolve('C:/Users/Administrator/Desktop/orbiroomrand/public/images/room');
fs.mkdirSync(outDir, { recursive: true });

function magentaScore(r, g, b) {
  const dist = Math.hypot(r - 255, g, b - 255);
  const rb = (r + b) / 2;
  const bias = rb - g;
  // strong magenta / hot pink / violet-magenta fringe
  if (dist < 110) return 1;
  if (r > 190 && b > 170 && g < 160 && bias > 70) return 1;
  if (r > 210 && b > 140 && g < 130 && r - g > 80) return 0.95;
  if (r > 160 && b > 160 && g < 145 && bias > 55 && dist < 160) return 0.85;
  if (r > 140 && b > 180 && g < 120) return 0.8; // blue-magenta
  return 0;
}

async function cut(srcName, destName) {
  const input = path.join(assets, srcName);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const px = data;
  const N = w * h;
  const kill = new Float32Array(N);

  for (let i = 0, p = 0; i < N; i++, p += 4) {
    kill[i] = magentaScore(px[p], px[p + 1], px[p + 2]);
  }

  // Flood from borders: expand kill into near-magenta neighbors
  const queue = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x;
    if (kill[i] >= 0.55) queue.push(i);
  };
  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }

  const seen = new Uint8Array(N);
  while (queue.length) {
    const i = queue.pop();
    if (seen[i]) continue;
    seen[i] = 1;
    if (kill[i] < 0.45) continue;
    kill[i] = 1;
    const x = i % w;
    const y = (i / w) | 0;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const ni = ny * w + nx;
      if (!seen[ni] && kill[ni] >= 0.35) queue.push(ni);
    }
  }

  for (let i = 0, p = 0; i < N; i++, p += 4) {
    const k = kill[i];
    if (k >= 0.75) {
      px[p + 3] = 0;
    } else if (k >= 0.4) {
      px[p + 3] = Math.round(px[p + 3] * (1 - k));
      // despill
      const g = px[p + 1];
      px[p] = Math.min(px[p], g + 20);
      px[p + 2] = Math.min(px[p + 2], g + 20);
    }
  }

  await sharp(px, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .trim({ threshold: 12 })
    .toFile(path.join(outDir, destName));

  const m = await sharp(path.join(outDir, destName)).metadata();
  console.log(destName, `${m.width}x${m.height}`);
}

await sharp(path.join(assets, 'plate-room.png'))
  .resize({ width: 1920, withoutEnlargement: true })
  .jpeg({ quality: 90 })
  .toFile(path.join(outDir, 'plate.jpg'));

const map = [
  ['raw-desk.png', 'desk.png'],
  ['raw-bookshelf.png', 'bookshelf.png'],
  ['raw-laptop.png', 'laptop.png'],
  ['raw-lamp.png', 'lamp.png'],
  ['raw-mirror.png', 'mirror.png'],
  ['raw-printer.png', 'printer.png'],
  ['raw-letter.png', 'letter.png'],
  ['raw-door.png', 'door.png'],
];

for (const [a, b] of map) await cut(a, b);
console.log('ok');
