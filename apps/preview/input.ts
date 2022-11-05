const createBlank = (
  blankName: string,
  direction: string,
  top: number,
  left: number,
  resize: number,
  ) => ({
    direction,
    blankName,
    top,
    left,
    resize
  });

const blippi = createBlank("preview_blank_blippi_1.jpg", "right", -120, 0, 1300);

export const render = [
  {
    number: "17",
    text: "rr",
    ...blippi,
  },
];
