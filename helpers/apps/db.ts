require('dotenv').config();
const mysql = require('mysql2');

const { info } = require('./helpers/functions');

class DataBase {
  constructor() { info('\n CONNECTED TO DATABASE. '); }

  dataBaseUrl = process.env.PLANETSCALE_DATABASE_URL;
  userName = process.env.USERNAME;
  connection = mysql.createConnection(this.dataBaseUrl).promise();

  public async insert(url: string): Promise<void> {
    await this.connection.query(`INSERT INTO downloaded_videos (url, user) VALUES ('${url}', '${this.userName}');`);
  }
  public async check(url: string): Promise<boolean> {
    const data = await this.connection.query(`SELECT * FROM downloaded_videos WHERE url = '${url}'`);
    return Boolean(data[0].length);
  }
}

const dataBase = new DataBase();
export { dataBase };
