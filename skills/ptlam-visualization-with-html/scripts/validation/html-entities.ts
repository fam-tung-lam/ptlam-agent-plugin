/** Decode the HTML character references needed by the local inspector. */
export function decodeHtmlEntities(value: string): string {
  const named: Readonly<Record<string, string>> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: "\u00a0",
    quot: '"',
  };

  return value.replace(
    /&(?:#(\d+)|#x([\da-f]+)|([a-z]+));/gi,
    (entity, decimal: string, hexadecimal: string, name: string) => {
      const codePoint = decimal
        ? Number.parseInt(decimal, 10)
        : hexadecimal
          ? Number.parseInt(hexadecimal, 16)
          : undefined;
      if (codePoint !== undefined && Number.isSafeInteger(codePoint)) {
        try {
          return String.fromCodePoint(codePoint);
        } catch {
          return entity;
        }
      }
      return named[name?.toLowerCase()] ?? entity;
    },
  );
}
