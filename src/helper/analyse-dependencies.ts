import { glob } from "node:fs/promises";
import ollama from "ollama";
import * as path from "path";
import { getTsDependencies } from "./dependencies-analyzer.ts";

export async function analyseDependencies(
  targetFileName: string,
  filePath: string,
) {
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

  const targetFile = projectFiles.find((f) => f.includes(targetFileName));

  if (!targetFile) {
    console.error(`❌ Could not find file: ${targetFileName}`);
    return;
  }

  // 3. Build the Dependency Graph
  const graph: Record<string, string[]> = {};
  for (const file of projectFiles) {
    try {
      graph[file] = getTsDependencies(file);
    } catch (e) {
      // Silently skip files that fail parsing (e.g. invalid syntax)
      continue;
    }
  }

  const dependants = Object.keys(graph).filter((file) => {
    return graph[file].some((dep) => {
      const dir = path.dirname(file);
      const absoluteDep = path.resolve(dir, dep);
      return targetFile.startsWith(absoluteDep);
    });
  });

  const prompt = `
        You are a Principal Architect. Analyze this dependency data:
        
        FILE: ${path.basename(targetFile)}
        DIRECT DEPENDANTS: ${dependants.map((f) => path.basename(f)).join(", ") || "None"}
        
        TASK:
        Summarize the "Architectural Weight" of this file. 
        If this file is a 'Type Definition' file used by many others, warn about 'Type Couplings'.
        If it's a 'Service', explain how many layers of the app it touches.
    `;

  const response = await ollama.chat({
    model: "llama3",
    messages: [{ role: "user", content: prompt }],
  });

  return response.message.content;
}
