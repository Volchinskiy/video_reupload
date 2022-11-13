{
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

    OUTPUT_PATH: string = process.env.DOWNLOADED_VIDEOS_PATH!;
    TERMINAL = readline.createInterface({ input: process.stdin, output: process.stdout });
    A_FILTER_FUNC = (str: string) => str.includes('m4a') && str.includes('medium');
    V_FILTER_FUNC = (str: string) => str.includes('mp4') && (str.includes('avc1.640028') || str.includes('avc1.64002a') || str.includes('avc1.4d401e'));

    videoUrl:   null | string = null;
    vFormatId:  null | number = null;
    aFormatId:  null | number = null;
    allFormats: null | string = null;

    public askUrl(): void {
      this.TERMINAL.question('\nPLEASE, ENTER VIDEO URL: ', async (url: string) => {
        const isDownloaded = await dataBase.check(url);
        if(isDownloaded) {
          error(`\n SORRY, THIS VIDEO HAS BEEN DOWNLOADED ${sadFace}`);
          this.askUrl();
          return;}
        this.videoUrl = url;
        info('\nSTARTED DEFINING THE BEST VIDEO AND AUDIO FORMATS.');
        await this.knowAllFormats();
        this.defFormat('video');
        this.defFormat('audio');
        if (!this.vFormatId || !this.aFormatId) {
          this.whatDidntDef();
          log(this.allFormats);
          this.askFormats();
          return;}
        await this.download();
        this.askUrl();
        return;});}
    private async knowAllFormats(): Promise<void> {
      const allFormats = await spawnYt_dlp(['-F', this.videoUrl]);
      this.allFormats = allFormats;}
    private defFormat (format: string) {
      const allFormatsArr = this.allFormats!.split('\n');
      const isVideo = format === "video";
      const func = isVideo ? this.V_FILTER_FUNC : this.A_FILTER_FUNC;
      const neededFormats = allFormatsArr.filter(func);
      const lastFormat = last(neededFormats);
      const formatId = parseInt(lastFormat);
      if (formatId) {
        if (isVideo) this.vFormatId = formatId;
        else this.aFormatId = formatId;}}
    private async askFormats(): Promise<void> {
      this.TERMINAL.question(
        'PLEASE, ENTER THE NEEDED FORMATS.\nEXAMPLE: 137+140\n: ',
        async (formats: string) => {
          const [vId, aId]: string[] = formats.split('+');
          if (!vId || !aId) {
            error('\n INVALID INPUT, PLEASE TRY AGAIN. \n');
            this.askFormats();
            return;}
          this.vFormatId = +vId;
          this.aFormatId = +aId;
          await this.download();
          this.askUrl();});}
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
      this.resetState();}
    private resetState (): void {
      this.vFormatId  = null;
      this.aFormatId  = null;
      this.allFormats = null;
      this.videoUrl   = null;}
    private whatDidntDef(): void {
      const notVFormat = !this.vFormatId;
      const notAFormat = !this.aFormatId;
      const messages = {
        a: 'SORRY, AUDIO FORMAT COULDN\'T BE DEFINED.',
        v: 'SORRY, VIDEO FORMAT COULDN\'T BE DEFINED.',
        va : 'SORRY, VIDEO AND AUDIO FORMATS COULDN\'T BE DEFINED.',
      }
      if (notVFormat) {
        if(notAFormat) { error(`\n ${messages.va} ${sadFace}\n`); return; };
        error(`\n ${messages.v} ${sadFace}\n`); return;}
      if (notAFormat) {
        if(notVFormat) { error(`\n ${messages.va} ${sadFace}\n`); return; };
        error(`\n ${messages.a} ${sadFace}\n`);};}
  }

  new YouTubeLoader();
}
