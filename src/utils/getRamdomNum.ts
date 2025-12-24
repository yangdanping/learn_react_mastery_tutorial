export const generateRandomInteger = (min = 1, max = 20): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateRandomNumber = (min = 1, max = 20, fixNum = 0): number => {
  if ((max <= 1 && min >= 0) || fixNum) {
    const randomNumber = Math.random() * (max - min) + min;
    return Number(randomNumber.toFixed(fixNum ? fixNum : 1));
  } else {
    return generateRandomInteger(min, max);
  }
};
