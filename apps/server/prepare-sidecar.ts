// scripts/prepare-sidecar.ts
import { $ } from "bun";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const TARGET_DIR = "../tauri/src-tauri/binaries";
const SERVER_ENTRY = "./src/index.js"; // or your main file
const TARGET_TRIPLE = "x86_64-unknown-linux-gnu"; // adjust for your target
const OUTPUT_NAME = `server-${TARGET_TRIPLE}`;
const OUTPUT_PATH = path.join(TARGET_DIR, OUTPUT_NAME);
const SERVER_DIR = "./src"; // Current directory since script is in server folder
const DB_SOURCE = "./local.db";
const ROOT_DIR = "../..";
if (!existsSync(TARGET_DIR)) {
  mkdirSync(TARGET_DIR, { recursive: true });
}

async function buildServer() {
  try {
    // Use yao-pkg/pkg to build a nat ive binary
    // console.log("Transpiling TypeScript to CommonJS...");
    // await $`npx esbuild src/index.ts --bundle --platform=node --target=node18 --outfile=dist/bundle.js --format=cjs`;

    console.log("Building server binary with pkg...");
    await $`npx @yao-pkg/pkg src/index.js --targets node18-linux-x64 --output ${OUTPUT_PATH}`;
    await $`chmod +x ${OUTPUT_PATH}`;
    console.log(`✅ Server binary built: ${OUTPUT_PATH}`);
  } catch (error) {
    console.error("❌ Failed to build server binary:", error);
    process.exit(1);
  }
}

async function copyDatabase() {
  console.log("Copying database...");

  try {
    if (existsSync(DB_SOURCE)) {
      const dbDest = path.join(TARGET_DIR, "local.db");
      copyFileSync(DB_SOURCE, dbDest);
      console.log("✅ Database copied to binaries directory");
    } else {
      console.log("⚠️  Database file not found, skipping...");
    }
  } catch (error) {
    console.error("❌ Failed to copy database:", error);
  }
}
async function copyAssets() {
  console.log("Copying public assets...");

  const publicSrc = "./public";
  const publicDest = path.join(TARGET_DIR, "public");

  try {
    if (existsSync(publicSrc)) {
      await $`cp -r ${publicSrc} ${publicDest}`;
      console.log("✅ Public assets copied");
    } else {
      console.log("⚠️  Public assets not found, skipping...");
    }
  } catch (error) {
    console.error("❌ Failed to copy assets:", error);
  }
}

async function main() {
  await buildServer();
  await copyDatabase();
  await copyAssets();
  console.log("🚀 Sidecar preparation complete!");
}

main().catch(console.error);
