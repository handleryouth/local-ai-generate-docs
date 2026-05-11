import { twirlTimer } from "./src/helper/timer.ts";
import { analyzeCode } from "./src/helper/analyse-code.ts";
import { generateGlobalCommitMessage } from "./src/helper/analyse-git-difference.ts";
import { generateReadmeOverview } from "./src/helper/generate-readme.ts";
import { getRandomAdvice } from "./src/helper/random-advice.ts";
import { setImmediateInterval } from "./src/helper/set-immediate-interval.ts";

// async function generateDocs(projectPath: string) {
//   try {
//     console.log("analysing code...");
//     await analyzeCode(projectPath);
//     console.log("write to files finished!");
//   } finally {
//   }
// }

// function generateCommitMessage() {
//   generateGlobalCommitMessage();
// }

// generateCommitMessage();

// await generateDocs("/Volumes/Data 2/web/quotes-app-testing");

(async () => {
  const abortInstance = new AbortController();
  const abortSignal = abortInstance.signal;
  const timer = twirlTimer();
  getRandomAdvice(abortSignal);
  try {
    await generateReadmeOverview("/Volumes/Data 2/web/quotes-app-testing");
  } finally {
    clearInterval(timer);
    abortInstance.abort();
  }
})();
