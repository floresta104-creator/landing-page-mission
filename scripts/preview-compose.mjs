import sharp from 'sharp';
const dir = 'public/images/room';
const W = 1600;
const H = 900;

let buf = await sharp(`${dir}/plate.jpg`).resize(W, H, { fit: 'cover' }).png().toBuffer();

async function put(file, leftPct, bottomPct, widthPct) {
  const width = Math.round(W * widthPct);
  const prop = await sharp(`${dir}/${file}`).resize({ width }).png().toBuffer();
  const meta = await sharp(prop).metadata();
  const left = Math.round(W * leftPct);
  const top = Math.round(H - H * bottomPct - meta.height);
  buf = await sharp(buf)
    .composite([{ input: prop, left: Math.max(0, left), top: Math.max(0, top) }])
    .png()
    .toBuffer();
}

await put('bookshelf.png', 0.67, 0, 0.33);
await put('desk.png', 0.1, 0.03, 0.5);
await put('printer.png', 0.14, 0.31, 0.1);
await put('mirror.png', 0.24, 0.33, 0.075);
await put('laptop.png', 0.32, 0.28, 0.18);
await put('lamp.png', 0.48, 0.34, 0.095);
await put('letter.png', 0.52, 0.27, 0.095);

await sharp(buf).jpeg({ quality: 90 }).toFile(`${dir}/_preview.jpg`);
console.log('preview ok');
