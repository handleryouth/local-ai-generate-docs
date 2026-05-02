import fs from "node:fs";
import { documentEnd, documentStart } from "../constant/text.ts";
import { format } from "prettier";

export async function writetoBeginningFile(path: string, content: string) {
  const fileContent = fs.readFileSync(path, "utf8");

  const docRegex = new RegExp(
    "^(\\s*)\\/\\*\\s*\\n\\s*" +
      documentStart +
      "\\s*[\\s\\S]*?" +
      documentEnd +
      "\\s*\\n\\s*\\*\\/",
    "m",
  );

  if (docRegex.test(fileContent)) {
    let updatedCode = fileContent.replace(docRegex, content);
    const formattedCode = await format(updatedCode, { parser: "typescript" });
    fs.writeFileSync(path, formattedCode);
  } else {
    let updatedCode = content + fileContent;
    const formattedCode = await format(updatedCode, { parser: "typescript" });
    fs.writeFileSync(path, formattedCode);
  }
}
