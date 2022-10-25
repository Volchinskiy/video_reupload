const { log } = require('./styledLogs');
const { spawn } = require('child_process');

export const spawnYt_dlp = (commands: string[], isShowLogs: boolean): Promise<any> => {
  return new Promise((resolve) => {
    let buffer: string = '';
    const filePath = './utilities/yt-dlp.exe';
    const processYT = spawn(filePath, commands);
    processYT.stdout.on("data", (data: Buffer) => {
      const readableData = data.toString();
      if (isShowLogs) log(readableData.replace("\n", ""));
      buffer += readableData;
    });
    processYT.on("close", (code: number) => {
      if (code) throw new Error("SORRY, SOMETHING HAPPENED WITH yt_dlp.");
      resolve(buffer);
    });
  });
};
