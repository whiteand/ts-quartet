function addTabs(line: string, tabsCount: number): string {
  let res = line;
  for (let i = 0; i < tabsCount; i++) {
    res = "  " + res;
  }
  return res;
}

export function beautifyStatements(
  statements: string[],
  intialTabSize: number = 1,
): string[] {
  const res: string[] = [];
  let tabsCount = intialTabSize;
  for (let i = 0; i < statements.length; i++) {
    const lines = statements[i].split("\n");
    for (let j = 0; j < lines.length; j++) {
      const line = lines[j].trim();
      if (!line) {
        continue;
      }
      if (line === "}") {
        tabsCount--;
      }
      res.push(addTabs(line, tabsCount));
      if (line[line.length - 1] === "{") {
        tabsCount++;
      }
    }
  }
  return res;
}
