// lib
require("dotenv").config();
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// project
const { default: todayDate } = require("./utils/todayDate");

class Parser {
  // API_KEY: string = "AIzaSyASLQiV5NVdLlnu84zX56ovg899O3oQKJ0";
  // BASE_URL: string = "https://www.youtube.com/watch?";
  // BASE_SEARCH_URL: string = "";

  SCOPES: string[] = ["https://www.googleapis.com/auth/youtube.readonly"];
  TOKEN_DIR: string = process.env.TOKEN_DIR!;
  TOKEN_PATH: string = `${this.TOKEN_DIR}/access_token_${todayDate()}.json`;

  CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET!;
  CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID!;
  REDIRECT_URL: string = process.env.GOOGLE_REDIRECT_URL!;

  public authorize(credentials: any, callback: any) {
    const oauth2Client = new OAuth2(
      this.CLIENT_ID,
      this.CLIENT_SECRET,
      this.REDIRECT_URL
    );

    fs.readFile(this.TOKEN_PATH, function (err: Error, token: any) {
      if (err) {
        // this.getNewToken(oauth2Client, callback);
      } else {
        oauth2Client.credentials = JSON.parse(token);
        callback(oauth2Client);
      }
    });
  }

  getNewToken(oauth2Client: any, callback: any) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.SCOPES,
    });
    console.log("Authorize this app by visiting this url: ", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code: any) => {
      rl.close();
      oauth2Client.getToken(code, function (err: Error, token: any) {
        if (err) {
          console.log("Error while trying to retrieve access token", err);
          return;
        }
        oauth2Client.credentials = token;
        // this.storeToken(token);
        callback(oauth2Client);
      });
    });
  }

  public getChannel(auth: any) {
    const service = google.youtube("v3");

    service.channels.list(
      {
        auth: auth,
        part: "snippet,contentDetails,statistics",
        forUsername: "GoogleDevelopers",
      },
      (err: Error, response: any) => {
        if (err) {
          console.log("The API returned an error: " + err);
          return;
        }

        const channels = response.data.items;
        if (!channels.length) {
          console.log("No channel found.");
        } else {
          console.log(
            "This channel's ID is %s. Its title is '%s', and " +
              "it has %s views.",
            channels[0].id,
            channels[0].snippet.title,
            channels[0].statistics.viewCount
          );
        }
      }
    );
  }

  public storeToken(token: any) {
    try {
      fs.mkdirSync(this.TOKEN_DIR);
    } catch (err: any) {
      if (err.code != "EEXIST") {
        throw err;
      }
    }
    fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err: Error) => {
      if (err) throw err;
      console.log(`Token stored to ${this.TOKEN_PATH}`);
    });
  }
}

const parser = new Parser();
export default parser;
