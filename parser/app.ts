const util = require("node:util");
const execFile = util.promisify(require("node:child_process").execFile);
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const log = (str: string): void => {
  console.log("\x1b[41m%s\x1b[0m", str);
};
const last = (array: string[]): string => array[array.length - 1];
const execYt_dlp = async (commands: string[]) => {
  const filePath = "./parser_v2/yt-dlp.exe";
  const { stdout } = await execFile(filePath, commands);
  return stdout;
};

const getFormats = async (url: string) => {
  return await execYt_dlp(["-F", url]);
};

const getMp4Id = (format: string) => {
  try {
    const formats = format.split("\n");
    const mp4arr = formats.filter(
      (str: string) =>
        str.includes("mp4") &&
        (str.includes("avc1.640028") || str.includes("avc1.64002a"))
    );
    const lastFormat = last(mp4arr);
    return lastFormat
      .split(" ")
      .filter((item: string) => !!item && item != "|")[0];
  } catch (error: any) {
    return new Error(error.message);
  }
};

const bestAudio = (str: string) => {
  try {
    const formats = str.split("\n");
    const mp4arr = formats.filter(
      (str: string) => str.includes("m4a") && str.includes("medium")
    );
    const lastFormat = last(mp4arr);
    return lastFormat
      .split(" ")
      .filter((item: string) => !!item && item != "|")[0];
  } catch (error: any) {
    return new Error(error.message);
  }
};

const askFormat = async (url: string) => {
  rl.question(
    "Enter Formats Look Like '137+140': ",
    async (formats: string) => {
      if (formats.split("+").length != 2) {
        log("BAD INPUT");
        askFormat(url);
        return;
      }
      const str = await execYt_dlp(["-f", formats, url, "-P", "./videos"]);
      console.log(str);
      rl.close();
    }
  );
};

// console.clear();
rl.question("Url: ", async (url: string) => {
  log(" START ");

  const str = await getFormats(url);

  const mp4Id = getMp4Id(str);
  if (mp4Id.hasOwnProperty("message")) {
    log("WE COULDN'T FIND BEST VIDEO FORMAT");
    console.log(str);
    askFormat(url);
    return;
  }

  const audioId = bestAudio(str);
  if (audioId.hasOwnProperty("message")) {
    log("WE COULDN'T FIND BEST AUDIO FORMAT");
    console.log(str);
    askFormat(url);
    return;
  }

  const finishStr = await execYt_dlp([
    "-f",
    `${mp4Id}+${audioId}`,
    url,
    "-P",
    "./videos",
  ]);
  console.log(finishStr);

  log(" FINISH ");
  rl.close();
});
