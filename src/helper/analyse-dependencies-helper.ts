import path from "node:path";

export async function analyseDirectDependencies(
  targetFile: string,
  codebaseRelationships: Record<string, string[]>,
) {
  const filesThatUseThisFile = Object.keys(codebaseRelationships)
    .filter((file) => {
      return codebaseRelationships[file].some((dep) => {
        const dir = path.dirname(file);
        const absoluteDep = path.resolve(dir, dep);
        return targetFile.startsWith(absoluteDep);
      });
    })
    .map((f) => path.basename(f));

  const importedModulesByTheFile = codebaseRelationships[targetFile];

  return {
    filesThatUseThisFile,
    importedModulesByTheFile,
  };
}
