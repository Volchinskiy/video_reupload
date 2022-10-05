const c = console.log;
const log = (...str: string[]): void => c("\x1b[1m%s\x1b[0m", ...str);
const warn = (...str: string[]): void => c("\x1b[33m%s\x1b[0m", ...str);
const err = (...str: string[]): void => c("\x1b[41m%s\x1b[0m", ...str);
export { log, warn, err };
