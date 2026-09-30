import dotenv from "dotenv";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createApiApp } from "./src/server/app";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const PORT = Number(process.env.PORT ?? 3000);

async function startServer() {
  const app = express();

  app.use(createApiApp());

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Yaqadha platform is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
