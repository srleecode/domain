import { logging } from '@angular-devkit/core';
import { createConsoleLogger } from '@angular-devkit/core/node';
import * as chalk from 'chalk';

let logger: logging.Logger;
export const getLogger = (isVerbose = false): any => {
  if (!logger) {
    logger = createConsoleLogger(isVerbose, process.stdout, process.stderr, {
      warn: (s) => chalk.bold(chalk.yellow(s)),
      error: (s) => chalk.bold(chalk.red(s)),
      info: (s) => chalk.white(s),
    });
  }
  return logger;
};
