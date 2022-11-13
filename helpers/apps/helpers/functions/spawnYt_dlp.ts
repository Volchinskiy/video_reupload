const { spawn } = require('child_process');
const { log, error } = require('./index');
require("dotenv").config();

export const spawnProcess = (path: string) => (commands: string[], isShowLogs?: boolean) => {
  return new Promise((resolve, reject) => {
    let buffer: string = '';
    const newProcess = spawn(path, commands);
    newProcess.stdout.on("data", (data: Buffer) => {
      const readableData = data.toString();
      if (isShowLogs) log(readableData.replace('\n', ''));
      buffer += readableData;});
    newProcess.stderr.on("data", (data: Buffer) => {
      const readableData = data.toString();
      error(readableData);});
    newProcess.on("close", (code: number) => {
      if(code) reject(code); else resolve(buffer); });});}

export const spawnYt_dlp = spawnProcess(process.env.YT_DLP_PATH!);
export const spawnPy = spawnProcess("python");
