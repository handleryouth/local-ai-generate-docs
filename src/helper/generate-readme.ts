import fs from "node:fs";
import { analyseTree } from "./analyse-tree.ts";
import { ollama } from "../lib/ollama.ts";

type JsonSafeMap<K, V> = Array<[K, V]>;

export async function generateReadmeOverview(projectPath: string) {
  const excludeFiles = ["node_modules", ".next", "dist", "assets"];

  const jsFiles = fs.globSync(`${projectPath}/**/*.js`, {
    exclude: excludeFiles,
  });

  const tsxFiles = fs.globSync(`${projectPath}/**/*.tsx`, {
    exclude: excludeFiles,
  });

  const tsFiles = fs.globSync(`${projectPath}/**/*.ts`, {
    exclude: excludeFiles,
  });

  const files = [...jsFiles, ...tsxFiles, ...tsFiles];

  let treeAnalyseCollection: JsonSafeMap<string, string> = [];

  for (const file of files) {
    const analyseTreeResult = await analyseTree(file);

    for (const [file, content] of analyseTreeResult.entries()) {
      treeAnalyseCollection.push([file, content]);
    }
  }

  const finalPrompt = `
  I have a project with the following structure:
  ${JSON.stringify(treeAnalyseCollection, null, 2)}

  Please write:
  1. A "System Overview" section explaining how data flows from the Entry Points to the Core Infrastructure.
  2. A "Developer Guide" warning about the most "Fragile" files (those with the highest number of dependants).
  3. Make it eye catchy to introduce this project (use some emoticon but not overuse it).
  4. Format it like i a readme in a repository (make use of heading, body, point, or paragraph)
  5. Do not add any license related content.
`;

  const response = await ollama.chat({
    model: "llama3",
    messages: [{ role: "user", content: finalPrompt }],
  });

  fs.writeFileSync(`${projectPath}/README.md`, response.message.content);
}
