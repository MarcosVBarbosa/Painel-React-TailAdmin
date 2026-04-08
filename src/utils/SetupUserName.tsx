export function SetupUserName(name: string): string {
  const ignorar = ["de", "da", "do", "dos", "das"];
  const arrayName = name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((n) => n.length > 0);
  if (arrayName.length < 2) return "";
  const firstName = arrayName[0];
  const lastName = arrayName[arrayName.length - 1];
  let abreviaName = "";
  if (arrayName.length > 2) {
    abreviaName = arrayName
      .slice(1, -1)
      .filter((n) => !ignorar.includes(n))
      .map((n) => n[0])
      .join("");
  }
  return abreviaName
    ? `${firstName}.${abreviaName}${lastName}`
    : `${firstName}.${lastName}`;
}
