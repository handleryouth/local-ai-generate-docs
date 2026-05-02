import { twirlTimer } from "./src/helper/timer.ts";
import { analyzeCode } from "./src/helper/analyse-code.ts";

async function generateDocs(projectPath: string) {
  const timer = twirlTimer;

  try {
    console.log("analysing code...");
    await analyzeCode(projectPath);
    console.log("write to files finished!");
  } finally {
    clearInterval(timer);
  }
}

await generateDocs("/Volumes/Data 2/web/quotes-app-testing");
