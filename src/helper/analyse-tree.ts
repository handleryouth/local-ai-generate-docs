import fs from "node:fs";
import { ollama } from "../lib/ollama.ts";
import Parser from "tree-sitter";
import { analyseDirectDependencies } from "./analyse-dependencies.ts";
import path from "node:path";
import { analyseCodebase } from "./analyse-codebase.ts";
import { javascriptObject, parser } from "../lib/tree-sitter.ts";

export async function analyseTree(file: string) {
  const fileExplainMap = new Map<string, string>();
  const code = fs.readFileSync(file, "utf8");
  const tree = parser.parse(code);

  const query = new Parser.Query(
    javascriptObject,
    `
        (function_declaration name: (identifier) @name) @func
        (variable_declarator value: (arrow_function)) @func
      `,
  );

  const captures = query.captures(tree.rootNode);
  const codebaseRelationships = await analyseCodebase(
    "/Volumes/Data 2/web/quotes-app-testing",
  );

  const directDependantsResult = await analyseDirectDependencies(
    file,
    codebaseRelationships,
  );

  const filesThatUseThisFileString =
    directDependantsResult?.filesThatUseThisFile?.join(", ") || "None";

  const importedModulesByTheFileString =
    directDependantsResult?.importedModulesByTheFile?.join(", ") || "None";

  for (const { node } of captures) {
    const funcCode = node.text;

    const response = await ollama.chat({
      model: "llama3",
      messages: [
        {
          role: "user",
          content: `
          You are a Senior Technical Architect documenting a codebase.
    
    FILE IDENTITY: ${path.basename(file)}
    
    1. INTERNAL STRUCTURE (What it does):
    The following functions were detected in this file:
    ${funcCode}
    
    2. EXTERNAL RELATIONSHIPS (Where it is used):
    - This file depends on: ${importedModulesByTheFileString}
    - This file is a dependency for: ${filesThatUseThisFileString}

    TASK:
    Write a brief 3-part documentation block for this file:
    - SUMMARY: What is the primary responsibility of this file?
    - LOGIC: Briefly explain the main functions (${funcCode}) and how they interact.
    - ARCHITECTURAL IMPACT: If a developer modifies this file, which parts of the system are most likely to be affected? (now there is ${filesThatUseThisFileString})


     write this on brief paragraph and wrap the text so it does not to be scrolled to the left too much! and do not add any comment mark

  `,
        },
      ],
    });

    fileExplainMap.set(file, response.message.content);
  }

  return fileExplainMap;
}
