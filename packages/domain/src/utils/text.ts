const clearAndUpper = (text: string): string =>
  text.replace('-', '').toUpperCase();

export const toPascalCase = (text: string): string =>
  text.replace(/(^\w|-\w)/g, clearAndUpper);
