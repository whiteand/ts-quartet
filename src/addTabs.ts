const TAB = ["", "  ", "    "];
export function addTabs(code: string, n: number = 1) {
  const tab = TAB[n];
  return tab + code.replace(/\n/g, "\n" + tab);
}
