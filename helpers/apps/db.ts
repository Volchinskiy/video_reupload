require('dotenv').config();
const mysql = require('mysql2');

const { info } = require('./helpers/functions');

class DataBase {
  constructor() { info('\n CONNECTED TO DATABASE. '); }

  userName = process.env.USERNAME;

  DATA_BASE_URL = process.env.PLANETSCALE_DATABASE_URL;
  CONNECTION = mysql.createConnection(this.DATA_BASE_URL).promise();

  public async insert(url: string): Promise<void> {
    await this.CONNECTION.query(`INSERT INTO downloaded_videos (url, user) VALUES ('${url}', '${this.userName}');`);
  }
  public async check(url: string): Promise<boolean> {
    const data = await this.CONNECTION.query(`SELECT * FROM downloaded_videos WHERE url = '${url}'`);
    return Boolean(data[0].length);
  }
}

const dataBase = new DataBase();
export { dataBase };
