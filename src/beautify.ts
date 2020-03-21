export function beautify(code: string) {
  const lines = code.split("\n");
  const resLines = [];
  let tabs = "";
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      continue;
    }
    if (trimmed[trimmed.length - 1] === "}") {
      tabs = tabs.slice(2);
    }
    const tabbed = tabs + trimmed;

    resLines.push(tabbed);
    if (trimmed[trimmed.length - 1] === "{") {
      tabs += "  ";
    }
  }
  return resLines.join("\n");
}
