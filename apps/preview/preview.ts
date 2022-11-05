{
  const fs = require('fs/promises');
  const { render } = require('./input');
  const { todayDate, random, loadImg } = require('./../helpers');

  interface IBlank {
    top: number,
    left: number,
    text: string,
    number: string,
    resize: number,
    direction: string,
    blankName: string,
  };

  class PreviewGenerator {
    constructor() { this.execute() }

    PADDING = 20;
    OUTPUT_PATH = './apps/preview/output/';
    BLANKS_PATH = './apps/preview/helpers/blanks/';
    BIMBA_FACES_PATH = './apps/preview/helpers/bimba_faces/';
    NUMBER_CHARS_PATH = './apps/preview/helpers/number_chars/';

    private async execute () {
      const hashtag = await loadImg(`${this.NUMBER_CHARS_PATH}#.png`);
      render.forEach(({top, left, number, text, direction, blankName, resize }: IBlank) => {
        fs.readdir(`${this.BIMBA_FACES_PATH}${direction}`).then((files: string[]) => {
          const filesAmount = files.length;
          const randomIndex = random(filesAmount);
          const bimbaImgName = files[randomIndex];
          const promises: Array<Promise<any>> = [
            loadImg(`${this.BLANKS_PATH}${blankName}`),
            loadImg(`${this.BIMBA_FACES_PATH}${direction}/${bimbaImgName}`)
          ];
          const chars = number.split("");
          chars.forEach((char: string) => promises.push(loadImg(`${this.NUMBER_CHARS_PATH}${char}.png`)));
          Promise.all(promises).then((imgs) => {
            const blank = imgs.shift();
            const bimba = imgs.shift();
            if(resize) bimba.resize(resize, resize);
            blank.composite(bimba, top, left);
            blank.composite(hashtag, this.PADDING, this.PADDING);
            imgs.forEach((img, i) => {blank.composite(img, ( i + 1 ) * 115, this.PADDING)});
            blank.writeAsync(`${this.OUTPUT_PATH}${number}_preview_${todayDate()}.jpg`);
          });
        });
        });
    }
  }

  new PreviewGenerator();
}
