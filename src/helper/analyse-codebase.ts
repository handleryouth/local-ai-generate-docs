import { getTsDependencies } from "./dependencies-analyzer.ts";
import { glob } from "node:fs/promises";
import path from "node:path";

export async function analyseCodebase(filePath: string) {
  const fileGenerator = glob(`${filePath}/**/*.{ts,tsx}`, {
    exclude: (p) =>
      p.includes("node_modules") ||
      p.includes(".test.") ||
      p.includes("dist") ||
      p.includes(".next"),
  });

  const projectFiles: string[] = [];
  for await (const file of fileGenerator) {
    projectFiles.push(path.resolve(file));
  }

  const codebaseRelationships: Record<string, string[]> = {};
  for (const file of projectFiles) {
    try {
      codebaseRelationships[file] = getTsDependencies(file);
    } catch (e) {
      continue;
    }
  }

  return codebaseRelationships;
}
