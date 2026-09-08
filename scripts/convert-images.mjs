import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.resolve(__dirname, "..", "..", "images");
const outputDir = path.resolve(__dirname, "public", "images");

// Mapping: source filename → output name
const imageMapping = {
  "01_LOGO_LA_CACHETTE.jpg": "logo-full.webp",
  "02_INSPIRATION_ENTREE.jpg": "entree.webp",
  "03_INSPIRATION_TERRASSE.jpg": "terrasse.webp",
  "04_INSPIRATION_BAR.jpg": "bar.webp",
  "05_INSPIRATION_VIP.jpg": "vip.webp",
  "06_INSPIRATION_CUISINE.jpg": "cuisine.webp",
  "07_INSPIRATION_SANITAIRES.jpg": "sanitaires.webp",
  "08_TERRAIN_EKIE.jpg": "terrain-ekie.webp",
  "Logo.png": "logo.webp",
  "La CACHETTE (2).png": "cachette-brand.webp",
  "La Cachette (5).webp": "cachette-hero-alt.webp",
  "La Cachette Car Restau Chreol Empire.webp": "cachette-carte.webp",
  "Gemini_Generated_Image_61om0661om0661om.png": "generated-1.webp",
  "Gemini_Generated_Image_gvli0mgvli0mgvli.png": "generated-2.webp",
  "Gemini_Generated_Image_h9klhih9klhih9kl.png": "generated-3.webp",
  "Gemini_Generated_Image_t3kkddt3kkddt3kk.png": "generated-4.webp",
  "Gemini_Generated_Image_vk7eu8vk7eu8vk7e.png": "generated-5.webp",
};

async function convertImages() {
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir);
  console.log(`Found ${files.length} images in ${inputDir}`);

  for (const file of files) {
    const outputName = imageMapping[file];
    if (!outputName) {
      console.log(`  ⏭  Skipping unmapped file: ${file}`);
      continue;
    }

    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, outputName);

    try {
      await sharp(inputPath)
        .resize(1920, null, { withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outputPath);

      const inputStat = fs.statSync(inputPath);
      const outputStat = fs.statSync(outputPath);
      const reduction = ((1 - outputStat.size / inputStat.size) * 100).toFixed(1);

      console.log(
        `  ✅  ${file} → ${outputName}  (${(inputStat.size / 1024).toFixed(0)}KB → ${(outputStat.size / 1024).toFixed(0)}KB, -${reduction}%)`
      );
    } catch (err) {
      console.error(`  ❌  Error converting ${file}:`, err.message);
    }
  }

  // Also convert logo to a small version for navbar
  try {
    const logoInput = path.join(inputDir, "Logo.png");
    if (fs.existsSync(logoInput)) {
      await sharp(logoInput)
        .resize(200, null, { withoutEnlargement: true })
        .webp({ quality: 90 })
        .toFile(path.join(outputDir, "logo-small.webp"));
      console.log("  ✅  Logo small (200px) created");
    }
  } catch (err) {
    console.error("  ❌  Error creating small logo:", err.message);
  }

  console.log("\n🎉 Conversion terminée !");
}

convertImages();
