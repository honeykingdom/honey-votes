/** Returns random number in range [min, max) */
const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);

export default getRandomInt;
