{
  const { log, error, success } = require("./../helpers/functions");
  const { sadFace, happyFace } = require("./../helpers/emoji");
  const { spawn } = require("child_process");
  const fs = require('fs/promises');

  const showData = (type: string) => (data: Buffer) => {
    const readableData = data.toString()
    if(type === "error") { error(readableData); return; };
    log(readableData);
  }
  const showError = showData("error");
  const showLog = showData("log")


  const removeGS = (imgName: string, postfix?: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const path = process.env.GS_PY_REMOVER;
      const argv = postfix ? [path, imgName, postfix] : [path, imgName];
      const processPy = spawn("python", argv);
      processPy.stdout.on("data", showLog);
      processPy.stderr.on("data", showError);
      processPy.on("close", (code: number) => { if(code) reject(code); resolve(code); });
    });
  }

  const execute = async () => {
    const files = await fs.readdir(process.env.GS_INPUT_PATH);
    const postfix = process.argv[2];
    console.log();
    for (const file of files) {
      try {
        if(postfix) {
          await removeGS(file, postfix);
          success(`FINISHED REMOVING GREEN SCREEN FROM ${file} ${happyFace}\n`);
          continue;
        }
        await removeGS(file);
        success(`FINISHED REMOVING GREEN SCREEN FROM ${file} ${happyFace}\n`);
      } catch {
        error(`SOMETHING WENT WRONG WITH ${file} ${sadFace}\n`);
      }
    }
  }

  execute();
}
