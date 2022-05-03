const getRandomChars = (length) => {
  const randomStr = (Math.random() + 1).toString(36);
  if (length > randomStr.length - 2) {
    throw new Error('Invalid random string length');
  }
  return randomStr.substring(randomStr.length - length);
};

export { getRandomChars };
