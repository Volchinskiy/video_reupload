import { renderObj, imgObj, textObj } from "./helpers/interfaces";
import Jimp from 'jimp';

{
  const fs = require('fs/promises');
  const { todayMilliseconds, random, loadImg } = require('./../helpers');
  const { render } = require('./input');
  class PreviewGenerator {
    constructor() { this.execute(); }

    OUTPUT_PATH = process.env.PREVIEW_OUTPUT_PATH;
    RESOURCES_PATH = process.env.PREVIEW_RESOURCES_PATH;

    imgs:  null | imgObj[]  = null;
    texts: null | textObj[] = null;

    private async execute () {
      render.forEach(async ({ blank, imgs, texts }: renderObj) => {
        this.imgs = imgs;
        this.texts = texts;
        const randomPaths = await this.getRandomPaths();
        for (let i = 0, j = 0, l = this.imgs.length; i < l; i++) {
          const img = JSON.parse(JSON.stringify(this.imgs[i]));
          const { random } = img.options;
          if (random) (img.path += randomPaths[j], this.imgs[i] = img, j++);}
        const promisesImgs: Promise<Jimp>[] = [this.loadImg(blank)];
        this.imgs.forEach(({ path }) => promisesImgs.push(this.loadImg(path)));
        const loadedImgs = await Promise.all(promisesImgs);
        const blankImg = loadedImgs.shift()!;
        this.addImgsToBlank(blankImg, loadedImgs);
        const charsMatrix = this.texts.map(({ text }: textObj) => {
          const chars = text.split("");
          const promises: Promise<Jimp>[] = [];
          chars.forEach((char: string) => promises.push(this.loadImg(`${char}.png`)));
          return promises;});
        const loadedCharsMatrix = await Promise.all(charsMatrix.map((promises) => Promise.all(promises)));
        this.addTextToBlank(blankImg, loadedCharsMatrix);
        blankImg.writeAsync(`${this.OUTPUT_PATH}preview_${todayMilliseconds()}.jpg`);});}
    private addTextToBlank (blank: Jimp, loadedCars: Array<Jimp[]>) {
      loadedCars.forEach((chars, i) => {
        chars.forEach((char: Jimp) => {
          const textData = JSON.parse(JSON.stringify(this.texts![i]));
          const { left, top, options } = textData;
          const { size, charIndent } = options;
          if (size) char.resize(size, size);
          blank.composite(char, left, top);
          textData.left += charIndent;
          this.texts![i] = textData;})});}
    private addImgsToBlank (blank: Jimp, loadedImgs: Jimp[]) {
      loadedImgs.forEach((loadedImg, i) => {
        const { left, top, options } = this.imgs![i];
        const { width, height } = options.size!;
        if (width || height) loadedImg.resize(width, height);
        blank.composite(loadedImg, left, top);});}
    private async getRandomPaths (): Promise<string[]> {
      const radomDirs: Array<Promise<any>> = [];
      this.imgs!.forEach(({ path, options }: imgObj) => {
        const { random } = options;
        if (random) radomDirs.push(fs.readdir(this.RESOURCES_PATH + path));});
      const filesMatrix = await Promise.all(radomDirs);
      return filesMatrix.map((files: string[]) => {
        const filesAmount = files.length;
        const randomIndex = random(filesAmount);
        const fileName = files[randomIndex];
        return fileName;})}

    private loadImg = (path: string) => loadImg(`${this.RESOURCES_PATH}${path}`);
  }

  new PreviewGenerator();
}
