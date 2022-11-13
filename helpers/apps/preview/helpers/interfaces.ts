export interface IImgOptions { random?: boolean, size?: { width: number, height: number } };
export interface ITextOptions { size?: number, charIndent?: number };
export interface imgObj {
  path: string;
  left: number;
  top: number;
  options: IImgOptions;}
export interface textObj {
  text: string;
  left: number;
  top: number;
  options: ITextOptions;}
export interface renderObj {
  blank: string;
  imgs: imgObj[];
  texts: textObj[];}