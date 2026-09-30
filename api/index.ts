import { createApiApp } from "../src/server/app";
import type { Express } from "express";
import type { IncomingMessage, ServerResponse } from "http";

let app: Express | undefined;

export default function handler(req: IncomingMessage, res: ServerResponse) {
  app ??= createApiApp();
  return app(req, res);
}
