/* eslint-disable @typescript-eslint/no-empty-function */
const logger =
  process.env.NODE_ENV === "development"
    ? console
    : {
        log: (_s: string) => {},
        warn: (_s: string) => {},
        error: (_s: string) => {},
      };

export const log = logger.log;
export const warn = logger.warn;
export const error = logger.log;
