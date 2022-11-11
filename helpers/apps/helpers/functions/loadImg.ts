const Jimp = require("jimp");
export const loadImg = (path: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const img = Jimp.read(path);
      resolve(img);
    } catch (err) {
      reject(err);
    }
})};
