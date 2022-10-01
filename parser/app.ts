import axios from "axios";
import { URLSearchParams } from "url";
const fs = require("fs");

// async function getVideoInfo(videoId: any, eurl: any) {
//   const response = await axios.get(
//     `https://www.youtube.com/get_video_info?video_id=${videoId}&el=embedded&eurl=${eurl}&sts=18333`
//   );
//   const parsedResponse = Object.fromEntries(new URLSearchParams(response.data));
//   console.log(parsedResponse);
// }

async function getVideoInfo(videoId: string) {
  const videoIdRegex = /^[\w_-]+$/;
  console.log("videoIdRegex =", videoIdRegex);
  const eurl = `https://youtube.googleapis.com/v/${videoId}`;
  if (!videoIdRegex.test(videoId)) {
    throw new Error("Invalid videoId.");
  }
  console.log("eurl =", eurl);
  const { data: response } = await axios.get(
    `https://www.youtube.com/get_video_info?video_id=${videoId}&el=embedded&eurl=${eurl}&sts=18333`
  );
  console.log("response =", response);

  // const parsedResponse = Object.fromEntries(new URLSearchParams(response));

  // const jsonResponse = JSON.parse(parsedResponse.player_response);
  // const { playabilityStatus, videoDetails, streamingData } = jsonResponse;
  // const videoInfo = {
  //   playabilityStatus,
  //   videoDetails,
  //   streamingData,
  // };

  // return videoInfo;
}

getVideoInfo("fJ9rUzIMcZQ");
// console.log();

// fs.writeFile("./test1", JSON.stringify(getVideoInfo("fJ9rUzIMcZQ")), (err: Error) => {
//   if (err) { console.log(err); return; }
//   console.log("Success");
// });
