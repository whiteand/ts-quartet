export function addTabs(code: string, n: number = 1) {
  if (n === 1) {
    return code
      .split("\n")
      .map(e => "  " + e)
      .join("\n");
  }
  return code
    .split("\n")
    .map(e => "    " + e)
    .join("\n");
}
