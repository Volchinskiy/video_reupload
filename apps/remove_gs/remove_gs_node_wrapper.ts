const { log, error, success } = require("./../helpers/functions");
const { sadFace, happyFace } = require("./../helpers/emoji");
const { spawn } = require("child_process");
const fs = require('fs/promises');
require("dotenv").config();

const showData = (data: Buffer, type: string) => {
  const readableData = data.toString()
  if(type === "error") { error(readableData); return; };
  log(readableData);
}

const removeGS = (imgName: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const path = process.env.GS_PY_REMOVER;
    const processPy = spawn("python", [path, imgName]);
    processPy.stdout.on("data", (d: Buffer) => showData(d, "log"));
    processPy.stderr.on("data", (d: Buffer) => showData(d, "error"));
    processPy.on("close", (code: number) => { if(code) reject(code); resolve(code); });
  });
}

const execute = async () => {
  const path = process.env.GS_INPUT_FOLDER;
  const files = await fs.readdir(path);
  console.log();
  for (const file of files) {
    try {
      await removeGS(file);
      success(`FINISHED REMOVING GREEN SCREEN FROM ${file} ${happyFace}\n`);
    } catch {
      error(`SOMETHING WENT WRONG WITH ${file} ${sadFace}\n`);
    }
  }
}

execute();
