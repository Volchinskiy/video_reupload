export interface IImgOptions { random?: boolean, size?: { width: number, height: number } };
export interface ITextOptions { size?: number, charIndent?: number };
export interface imgObj {
  path: string;
  left: number;
  top: number;
  options: IImgOptions;
}
export interface textObj {
  text: string;
  left: number;
  top: number;
  options: ITextOptions;
}
export interface renderObj {
  blank: string;
  imgs: imgObj[];
  texts: textObj[];
}

const noResize = { width: 0, height: 0 };
const imgPlug = { random: false, size: noResize };
const textPlug = { size: 0, charIndent: 115 };

const registerImg = (path: string, left: number, top: number, options: IImgOptions = imgPlug) => {
  const { random, size } = options;
  if(!size) options.size = noResize;
  if(!random) options.random = false;
  return { path, left, top, options };
}

const registerText = (text: string, left: number, top: number, options: ITextOptions = textPlug) => {
  const { size, charIndent } = options;
  if(!size) options.size = 0;
  if(!charIndent) options.charIndent = 115;
  return { text, left, top, options };
}

const text0 = registerText('#18', 20, 20);
const text1 = registerText('#180', 420, 620, { size: 150, charIndent: 70 } );

const img0 = registerImg('right/', -120, 0, {random: true, size: {width: 1300, height: 1300}});

export const render: renderObj[] = [
  {
    blank: 'preview_blank_blippi_1.jpg',
    imgs: [img0],
    texts: [text0, text1],
  },
];
