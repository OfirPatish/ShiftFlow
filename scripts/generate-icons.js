const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputSvg = path.join(__dirname, '../public/icon.svg');
const publicDir = path.join(__dirname, '../public');

async function generateIcons() {
  const svgBuffer = fs.readFileSync(inputSvg);

  // Generate favicon.ico (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .toFormat('png')
    .toBuffer()
    .then(buffer => sharp(buffer)
      .toFile(path.join(publicDir, 'favicon.ico'))
    );

  // Generate icon.png (192x192)
  await sharp(svgBuffer)
    .resize(192, 192)
    .toFormat('png')
    .toFile(path.join(publicDir, 'icon.png'));

  // Generate apple-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .toFormat('png')
    .toFile(path.join(publicDir, 'apple-icon.png'));

  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error); 