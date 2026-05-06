import { execSync } from "node:child_process";
import { ollama } from "../lib/ollama.ts";
import { analyseTree } from "./analyse-tree.ts";
import { join } from "node:path";

export async function generateGlobalCommitMessage() {
  const stagedFiles = execSync("git diff --name-only --cached")
    .toString()
    .trim()
    .split("\n");

  if (!stagedFiles[0]) {
    console.log("No files staged for commit.");
    return;
  }

  const fullDiff = execSync("git diff --cached").toString();

  console.log("staged files", stagedFiles);

  const analyseTreeArray: string[] = [];

  for (const file of stagedFiles) {
    const analyseTreeField = await analyseTree(join(process.cwd(), file));

    for (const [, content] of analyseTreeField.entries()) {
      analyseTreeArray.push(content);
    }
  }

  const prompt = `
            You are a Principal Engineer. Review these staged changes:

            DOCUMENTATION:
            ${analyseTreeArray.join("\n")}

            STAGED FILES:
            ${stagedFiles.join(", ")}

            FULL CHANGES (DIFF):
            ${fullDiff}

            TASK:
            1. Write a Conventional Commit messages (combine all files changes into one commit message).
            
            Note: 
            - use this format when returning the value:
              <type>: <subject>
              make sure "only" return this format. "No prefix, no explanation, no other notes."
        `;

  const response = await ollama.chat({
    model: "llama3",
    messages: [{ role: "user", content: prompt }],
  });

  console.log(response.message.content);

  return response.message.content;
}
