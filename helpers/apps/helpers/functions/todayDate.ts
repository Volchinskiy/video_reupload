const maybeAddZero = (a: number): string => (a < 10 ? `0${a}` : `${a}`);
export const todayDate = (): string => {
  const today = new Date();
  const day = maybeAddZero(today.getDate());
  const month = maybeAddZero(today.getMonth() + 1);
  const year = today.getFullYear();
  return `${day}_${month}_${year}`;
};

export const todayMilliseconds = (): string => `${Date.now()}`
