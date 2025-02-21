/**
 * Shuffle the elements of an array in place using the Fisher-Yates algorithm.
 * @param {Array} numbers The array to shuffle.
 * @returns {Array} A new array with shuffled elements, or an empty array if the input is invalid.
 */
export function shuffleNumbers(numbers) {
  if (Array.isArray(numbers)) {
    const shuffledNumbers = [...numbers];

    for (let i = shuffledNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffledNumbers[i], shuffledNumbers[j]] = [
        shuffledNumbers[j],
        shuffledNumbers[i],
      ];
    }

    return shuffledNumbers;
  }

  return [];
}
