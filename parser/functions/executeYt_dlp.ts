const util = require("node:util");
const execFile = util.promisify(require("node:child_process").execFile);
const executeYt_dlp = async (commands: string[]): Promise<string> => {
  const filePath = "./utilities/yt-dlp.exe";
  const { stdout } = await execFile(filePath, commands);
  return stdout;
};
export { executeYt_dlp };
