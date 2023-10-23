import { classify } from '@angular-devkit/core/src/utils/strings';

export const spacify = (words: string): string => {
  let spacifiedWords = '';
  const classifiedWords = classify(words);
  [...classifiedWords].forEach((c, index) => {
    if (
      index > 0 &&
      c === c.toUpperCase() &&
      classifiedWords.charAt(index - 1) !==
        classifiedWords.charAt(index - 1).toUpperCase()
    ) {
      spacifiedWords += ' ';
    }
    spacifiedWords += c;
  });
  return spacifiedWords;
};
