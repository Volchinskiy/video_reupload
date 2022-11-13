{
  const { error, success, spawnPy } = require("./../helpers/functions");
  const { sadFace, happyFace } = require("./../helpers/emoji");
  const fs = require('fs/promises');

  class RemoveGreenScreen {
    constructor() { this.execute(); }

    HELPER_PATH: string = process.env.GS_PY_REMOVER_PATH!;

    private async execute () {
      const postfix = process.argv[2];
      const files = await fs.readdir(process.env.GS_INPUT_PATH);
      console.log();
      for (const file of files) {
        const commands = postfix ? [this.HELPER_PATH, file, postfix] : [this.HELPER_PATH, file];
        try {
          await spawnPy(commands, true);
          success(`FINISHED REMOVING GREEN SCREEN FROM ${file} ${happyFace}\n`);}
        catch {
          error(`SOMETHING WENT WRONG WITH ${file} ${sadFace}\n`);}}}
  }

  new RemoveGreenScreen();
}
