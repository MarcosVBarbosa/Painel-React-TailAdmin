export function SetupUserName(name: string): string | { erro: string } {
  const ignorar = ["de", "da", "do", "dos", "das"];

  if (!name || name.trim().length === 0) {
    return { erro: "Nome não informado" };
  }

  // 🔤 Remove acentos
  const semAcento = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // ❌ Validação: não pode ter caracteres especiais
  if (/[^a-zA-Z0-9\s]/.test(semAcento)) {
    return { erro: "Nome contém caracteres especiais inválidos" };
  }

  // ❌ Validação: múltiplos espaços (ex: "marcos   barbosa")
  if (/\s{2,}/.test(semAcento)) {
    return { erro: "Nome contém múltiplos separadores inválidos" };
  }

  const normalizado = semAcento.trim().toLowerCase();

  const arrayName = normalizado.split(" ");

  if (arrayName.length < 2) {
    return { erro: "Informe nome e sobrenome" };
  }

  const firstName = arrayName[0];
  const lastName = arrayName[arrayName.length - 1];

  let abreviaName = "";

  if (arrayName.length > 2) {
    const meio = arrayName.slice(1, -1).filter((n) => !ignorar.includes(n));

    // ❌ evita abreviação inválida
    if (meio.some((n) => n.length === 0)) {
      return { erro: "Nome inválido" };
    }

    abreviaName = meio.map((n) => n[0]).join("");
  }

  const username = abreviaName
    ? `${firstName}.${abreviaName}${lastName}`
    : `${firstName}.${lastName}`;

  // ❌ segurança final
  if (!/^[a-z0-9]+(\.[a-z0-9]+)?$/.test(username)) {
    return { erro: "Não foi possível gerar o username" };
  }

  return username;
}
