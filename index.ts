// import { twirlTimer } from "./src/helper/timer.ts";
import { analyzeCode } from "./src/helper/analyse-code.ts";
import { generateGlobalCommitMessage } from "./src/helper/analyse-git-difference.ts";

// async function generateDocs(projectPath: string) {
//   try {
//     console.log("analysing code...");
//     await analyzeCode(projectPath);
//     console.log("write to files finished!");
//   } finally {
//   }
// }

function generateCommitMessage() {
  generateGlobalCommitMessage();
}

generateCommitMessage();

// await generateDocs("/Volumes/Data 2/web/quotes-app-testing");
