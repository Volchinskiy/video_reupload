const readline = require('readline');
require("dotenv").config();

const {
  spawnYt_dlp,  log,
  last,         error,
  success,      info,
} = require('./../helpers/functions');
const { sadFace } = require('./../helpers/emoji');
const { dataBase } = require('./../db');

class YouTubeLoader {
  constructor() { this.askUrl(); };

  OUTPUT_PATH: string = './apps/yt_loader/output';
  TERMINAL = readline.createInterface({ input: process.stdin, output: process.stdout });
  vFormatId:  null | number = null;
  aFormatId:  null | number = null;
  allFormats: null | string = null;
  videoUrl:   null | string = null;

  public askUrl() {
    this.TERMINAL.question('\nPLEASE, ENTER VIDEO URL: ', async (url: string) => {
      const isDownloaded = await dataBase.check(url);
      if(isDownloaded) {
        error(`\n SORRY, THIS VIDEO HAS BEEN DOWNLOADED ${sadFace}`);
        this.askUrl();
        return;
      }
      this.videoUrl = url;
      info('\nSTARTED DEFINING THE BEST VIDEO AND AUDIO FORMATS.');
      await this.defFormats();
      this.defVFormat();
      this.defAFormat();
      if (!this.vFormatId || !this.aFormatId) {
        if (!this.vFormatId) error(`\n SORRY, VIDEO FORMAT COULDN\'T BE DEFINED. ${sadFace}\n`); // here call method whatDidntDef
        if (!this.aFormatId) error(`\n SORRY, AUDIO FORMAT COULDN\'T BE DEFINED. ${sadFace}\n`);
        log(this.allFormats);
        this.askFormats();
        return;
      }
      await this.download();
      this.askUrl();
      return;
    });
  }
  private async defFormats(): Promise<void> {
    const allFormats = await spawnYt_dlp(['-F', this.videoUrl], false);
    this.allFormats = allFormats;
  }
  private defVFormat() { // maybe use new Function
    const formatsArr = this.allFormats!.split('\n');
    const mp4Arr = formatsArr.filter((str: string) => str.includes('mp4') && (str.includes('avc1.640028') || str.includes('avc1.64002a') || str.includes('avc1.4d401e')));
    const lastFormat = last(mp4Arr);
    const foramtId = parseInt(lastFormat);
    if (foramtId) this.vFormatId = foramtId;
  }
  private defAFormat() { // maybe use new Function
    const formatsArr = this.allFormats!.split('\n');
    const m4aArr = formatsArr.filter((str: string) => str.includes('m4a') && str.includes('medium'));
    const lastFormat = last(m4aArr);
    const foramtId = parseInt(lastFormat);
    if (foramtId) this.aFormatId = foramtId;
  }
  private async askFormats(): Promise<void> {
    this.TERMINAL.question(
      'PLEASE, ENTER THE NEDDED FORMATS.\nEXAMPLE: 137+140\n: ',
      async (formats: string) => {
        const [vId, aId]: string[] = formats.split('+');
        if (!vId || !aId) {
          error('\n INVALID INPUT, PLEASE TRY AGAIN. \n');
          this.askFormats();
          return;
        }
        this.vFormatId = +vId;
        this.aFormatId = +aId;
        await this.download();
        this.askUrl();
      }
    );
  }
  private async download(): Promise<void> {
    info('\nSTARTED VIDEO DOWNLOADING.\n');
    await spawnYt_dlp([
      '-f',
      `${this.vFormatId}+${this.aFormatId}`,
      this.videoUrl,
      '-P',
      this.OUTPUT_PATH
      ], true);
    await dataBase.insert(this.videoUrl);
    success('\nFINISHED VIDEO DOWNLOADING.');
    this.resetState();
  }
  private resetState () {
    this.vFormatId  = null;
    this.aFormatId  = null;
    this.allFormats = null;
    this.videoUrl   = null;
  }
}

const youTubeLoader = new YouTubeLoader();
export { youTubeLoader };
