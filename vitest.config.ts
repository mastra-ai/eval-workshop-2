import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

function loadDotEnv(): Record<string, string> {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env"), "utf-8");
    const env: Record<string, string> = {};
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      env[key] = val;
    }
    return env;
  } catch {
    return {};
  }
}

export default defineConfig({
  test: {
    env: loadDotEnv(),
  },
});
