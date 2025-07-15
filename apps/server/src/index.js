// apps/server/index.ts
import "dotenv/config";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import path from "path";
import fs from "fs";

function getDataDir() {
  const platform = process.platform;
  let dataDir;

  if (platform === "win32") {
    dataDir = path.join(process.env.APPDATA || "", "ishami");
  } else if (platform === "darwin") {
    dataDir = path.join(
      process.env.HOME || "",
      "Library",
      "Application Support",
      "ishami"
    );
  } else {
    dataDir = path.join(process.env.HOME || "", ".local", "share", "ishami");
  }

  // Create directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  return dataDir;
}

// Set database path in environment if not already set
if (!process.env.DATABASE_PATH) {
  process.env.DATABASE_PATH = path.join(getDataDir(), "local.db");
}

function getPublicDir() {
  // In production (bundled), assets are relative to the executable
  // In development, they're in the usual location
  const isDev = process.env.NODE_ENV === "development";
  console.log(isDev);

  if (isDev) {
    return "./public";
  }

  // In production, look for assets relative to the executable
  return path.join(process.cwd(), "public");
}

// Initialize Hono app
const app = new Hono();
app.use(logger());
app.use(
  "/*",
  cors({
    origin: [
      process.env.CORS_ORIGIN || "http://localhost:1420",
      "tauri://localhost",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  })
);

const publicDir = getPublicDir();

app.use(
  "/*",
  serveStatic({
    root: publicDir,
  })
);

app.get("*", serveStatic({ path: path.join(publicDir, "index.html") }));

serve(
  {
    fetch: app.fetch,
    port: 1420,
  },
  (info) => {
    console.log(`Server running on http://localhost:${info.port}`);
    console.log(`Database path: ${process.env.DATABASE_PATH}`);
    console.log(`Public directory: ${publicDir}`);
  }
);
