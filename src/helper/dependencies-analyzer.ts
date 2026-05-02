import * as fs from "fs";
import { parse } from "@typescript-eslint/typescript-estree";

export function getTsDependencies(filePath: string): string[] {
  const code = fs.readFileSync(filePath, "utf-8");
  const dependencies: string[] = [];

  const ast = parse(code, {
    filePath,
    range: true,
    tokens: true,
  });

  const walk = (node: any) => {
    if (node.type === "ImportDeclaration" && node.source.type === "Literal") {
      dependencies.push(node.source.value as string);
    }

    for (const key in node) {
      if (node[key] && typeof node[key] === "object") {
        if (Array.isArray(node[key])) {
          node[key].forEach(walk);
        } else {
          walk(node[key]);
        }
      }
    }
  };

  walk(ast);
  return dependencies;
}
