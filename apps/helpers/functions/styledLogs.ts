const c = console;
const wrapper = (a: number) => (...str: string[]): void => c.log(`\x1b[1m\x1b[${a}m%s\x1b[0m`, ...str);

export const info = wrapper(44);
export const warn = wrapper(43);
export const error = wrapper(41);
export const success = wrapper(42);
export const log = (...str: string[]): void => c.log("\x1b[1m%s\x1b[0m", ...str);
