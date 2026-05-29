import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const appDir = path.join(process.cwd(), "app");
const iconPath = path.join(appDir, "icon.png");
const appleIconPath = path.join(appDir, "apple-icon.png");
const faviconPath = path.join(appDir, "favicon.ico");
const socialImages = [
  {
    png: path.join(appDir, "opengraph-image.png"),
    jpg: path.join(appDir, "opengraph-image.jpg"),
  },
  {
    png: path.join(appDir, "twitter-image.png"),
    jpg: path.join(appDir, "twitter-image.jpg"),
  },
];

const size = (bytes) => `${Math.round(bytes / 1024)}KB`;

async function statSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

async function writeOptimizedPng(sourceBuffer, outPath, width) {
  const before = await statSize(outPath);
  const output = await sharp(sourceBuffer)
    .resize(width, width, { fit: "cover", position: "center" })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer();

  await fs.writeFile(outPath, output);
  console.log(`${path.relative(process.cwd(), outPath)} ${size(before)} -> ${size(output.length)}`);
}

async function writeFavicon(sourceBuffer) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "philodocs-favicon-"));
  const before = await statSize(faviconPath);

  try {
    const iconSizes = [16, 32, 48];
    const tempPngs = await Promise.all(
      iconSizes.map(async (width) => {
        const outPath = path.join(tempDir, `icon-${width}.png`);
        await sharp(sourceBuffer)
          .resize(width, width, { fit: "cover", position: "center" })
          .ensureAlpha(1)
          .png({ compressionLevel: 9, palette: false })
          .toFile(outPath);
        return outPath;
      }),
    );

    const ico = await pngToIco(tempPngs);
    await fs.writeFile(faviconPath, ico);
    console.log(`${path.relative(process.cwd(), faviconPath)} ${size(before)} -> ${size(ico.length)}`);
  } finally {
    await fs.rm(tempDir, { force: true, recursive: true });
  }
}

async function writeSocialJpeg({ png, jpg }) {
  const before = await statSize(png);

  if (!before) {
    console.log(`${path.relative(process.cwd(), jpg)} already optimized`);
    return;
  }

  const output = await sharp(png)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  await fs.writeFile(jpg, output);
  await fs.rm(png);
  console.log(`${path.relative(process.cwd(), png)} -> ${path.relative(process.cwd(), jpg)} ${size(before)} -> ${size(output.length)}`);
}

const iconSource = await fs.readFile(iconPath);

await writeOptimizedPng(iconSource, iconPath, 512);
await writeOptimizedPng(iconSource, appleIconPath, 180);
await writeFavicon(iconSource);

for (const socialImage of socialImages) {
  await writeSocialJpeg(socialImage);
}
