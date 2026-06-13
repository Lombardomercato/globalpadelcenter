import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const loadSharp = () => {
  try {
    return require("sharp");
  } catch (error) {
    if (!process.env.SHARP_MODULE_PATH) throw error;
    return require(process.env.SHARP_MODULE_PATH);
  }
};

const sharp = loadSharp();

const root = process.cwd();
const sourceDir = path.join(root, "assets");
const outputDir = path.join(sourceDir, "optimized");

const mainImages = [
  "hero-global-hero",
  "story-competi",
  "story-entrena",
  "story-conecta",
  "story-quedate",
  "torneo",
];

const galleryImages = [
  "gallery/gallery-coffee",
  "gallery/gallery-community",
  "gallery/gallery-handshake",
  "gallery/gallery-match",
  "gallery/gallery-trophy",
  "gallery/gallery-court",
  "gallery/gallery-architecture",
  "gallery/gallery-lounge",
];

const supportingImages = ["bar-gastronomia", "bar"];

const logos = [
  {
    source: "global-padel-logo-header.png",
    output: "global-padel-logo-header.png",
    width: 720,
  },
  {
    source: "global-padel-isologo.png",
    output: "global-padel-isologo.png",
    width: 512,
  },
  {
    source: "global-padel-logo.png",
    output: "global-padel-logo.png",
    width: 720,
  },
];

const formats = [
  {
    ext: "avif",
    options: { quality: 48, effort: 6 },
  },
  {
    ext: "webp",
    options: { quality: 76, effort: 6 },
  },
  {
    ext: "jpg",
    options: { quality: 78, mozjpeg: true, progressive: true },
  },
];

const ensureDir = async (filePath) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
};

const sizeOf = async (filePath) => (await fs.stat(filePath)).size;

const formatBytes = (bytes) => {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
};

const outputName = (baseName, variant, ext) => `${baseName.replace(/\//g, "-")}-${variant}.${ext}`;

const resizeAndWrite = async ({ source, baseName, variant, width, ext, options }) => {
  const outPath = path.join(outputDir, outputName(baseName, variant, ext));
  await ensureDir(outPath);

  let pipeline = sharp(source)
    .rotate()
    .resize({
      width,
      withoutEnlargement: true,
    });

  if (ext === "avif") pipeline = pipeline.avif(options);
  if (ext === "webp") pipeline = pipeline.webp(options);
  if (ext === "jpg") pipeline = pipeline.jpeg(options);

  await pipeline.toFile(outPath);
  return outPath;
};

const optimizeRasterSet = async ({ baseName, sourceFile, variants }) => {
  const source = path.join(sourceDir, sourceFile);
  const originalSize = await sizeOf(source);
  const generated = [];

  for (const [variant, width] of Object.entries(variants)) {
    for (const format of formats) {
      const outPath = await resizeAndWrite({
        source,
        baseName,
        variant,
        width,
        ext: format.ext,
        options: format.options,
      });
      generated.push({
        file: path.relative(root, outPath),
        size: await sizeOf(outPath),
      });
    }
  }

  return {
    source: path.relative(root, source),
    originalSize,
    generated,
  };
};

const optimizeLogo = async ({ source, output, width }) => {
  const input = path.join(sourceDir, source);
  const outPath = path.join(outputDir, output);
  await ensureDir(outPath);
  await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(outPath);

  return {
    source: path.relative(root, input),
    originalSize: await sizeOf(input),
    generated: [
      {
        file: path.relative(root, outPath),
        size: await sizeOf(outPath),
      },
    ],
  };
};

const results = [];

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

for (const name of mainImages) {
  results.push(
    await optimizeRasterSet({
      baseName: name,
      sourceFile: `${name}.jpg`,
      variants: {
        desktop: 1920,
        mobile: 1080,
      },
    })
  );
}

for (const name of galleryImages) {
  results.push(
    await optimizeRasterSet({
      baseName: name,
      sourceFile: `${name}.jpg`,
      variants: {
        desktop: 1200,
        mobile: 900,
      },
    })
  );
}

for (const name of supportingImages) {
  results.push(
    await optimizeRasterSet({
      baseName: name,
      sourceFile: `${name}.jpg`,
      variants: {
        desktop: 1920,
        mobile: 1080,
      },
    })
  );
}

for (const logo of logos) {
  results.push(await optimizeLogo(logo));
}

const summary = results.map((item) => ({
  source: item.source,
  before: formatBytes(item.originalSize),
  generated: item.generated.map((file) => ({
    file: file.file,
    size: formatBytes(file.size),
  })),
}));

await fs.writeFile(
  path.join(outputDir, "manifest.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8"
);

console.table(
  results.flatMap((item) =>
    item.generated.map((file) => ({
      source: item.source,
      before: formatBytes(item.originalSize),
      output: file.file,
      after: formatBytes(file.size),
    }))
  )
);
