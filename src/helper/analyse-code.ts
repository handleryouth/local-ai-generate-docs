import fs from "node:fs";
import { writetoBeginningFile } from "./write-to-beginning-files.ts";
import { documentEnd, documentStart } from "../constant/text.ts";
import { analyseTree } from "./analyse-tree.ts";

export async function analyzeCode(projectPath: string) {
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

  for (const file of files) {
    const analyseTreeResult = await analyseTree(file);

    for (const [file, content] of analyseTreeResult.entries()) {
      writetoBeginningFile(
        file,
        `
        /*
          ${documentStart}
          ${content}
          ${documentEnd}
        */
          `,
      );
    }
  }
}
