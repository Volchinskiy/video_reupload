const readline = require("readline");

const { log, err } = require("./functions/styledLogs");
const { last } = require("./functions/last");
const { executeYt_dlp } = require("./functions/executeYt_dlp");

class YouTubeLoader {
  constructor() { this.askUrl(); };
  
  terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
  vFormatId: null | number = null;
  aFormatId: null | number = null;
  allFormats: null | string = null;
  videoUrl: null | string = null;

  public askUrl() {
    this.terminal.question("Url: ", async (url: string) => {
      log("\nSTART IDENTIFYING SUITABLE FORMATS");
      this.videoUrl = url;
      await this.defFormats();
      this.defVFormat();
      this.defAFormat();
      if (!this.vFormatId || !this.aFormatId) {
        if (!this.vFormatId) err("\n COULDN'T DEFINE VIDEO FORMAT \u2639  \n");
        if (!this.aFormatId) err("\n COULDN'T DEFINE AUDIO FORMAT \u2639  \n");
        log(this.allFormats);
        this.askFormats();
        return;
      }
      await this.download();
      this.askUrl();
    });
  }

  private async defFormats(): Promise<void> {
    const allFormats = await executeYt_dlp(["-F", this.videoUrl]);
    this.allFormats = allFormats;
  }
  private defVFormat() {
    const formatsArr = this.allFormats!.split("\n");
    const mp4Arr = formatsArr.filter(
      (str: string) =>
        str.includes("mp4") &&
        (str.includes("avc1.640028") || str.includes("avc1.64002a"))
    );
    const lastFormat = last(mp4Arr);
    const foramtId = parseInt(lastFormat);
    if (foramtId) this.vFormatId = foramtId;
  }
  private defAFormat() {
    const formatsArr = this.allFormats!.split("\n");
    const m4aArr = formatsArr.filter(
      (str: string) => str.includes("m4a") && str.includes("medium")
    );
    const lastFormat = last(m4aArr);
    const foramtId = parseInt(lastFormat);
    if (foramtId) this.aFormatId = foramtId;
  }
  private async askFormats(): Promise<void> {
    this.terminal.question(
      "Enter the needed formats.\nExample: 137+140\n: ",
      async (formats: string) => {
        const [vId, aId]: string[] = formats.split("+");
        if (!vId || !aId) {
          err("\n BAD INPUT \n");
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
    log("\nSTARTED UPLOADING\n");
    await executeYt_dlp([
      "-f",
      `${this.vFormatId}+${this.aFormatId}`,
      this.videoUrl,
      "-P",
      "./videos"
      ,]).then((r: string) => log(r));
    log("FINISHED UPLOADING VIDEO", "\n");
    this.resetState();
  }
  private resetState () {
    this.vFormatId = null;
    this.aFormatId = null;
    this.allFormats = null;
    this.videoUrl = null;
  }
}

const youTubeLoader = new YouTubeLoader(); 
export { youTubeLoader };
