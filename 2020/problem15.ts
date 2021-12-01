function part1(input: number[], place: number = 2020) {
  const inputMap = input.reduce((acc, cur, i) => {
    acc[cur] = i + 1;
    return acc;
  }, {});

  let lastSpokenWord = input[input.length - 1];
  for (let i = input.length; i < place; i++) {
    const spokenWord = i - (inputMap[lastSpokenWord] || i);
    inputMap[lastSpokenWord] = i;
    lastSpokenWord = spokenWord;
  }

  console.log(inputMap)
  return lastSpokenWord;
}

const providedInput = '8,0,17,4,1,12';
const input = providedInput.split(',').map((num) => parseInt(num));

console.log(part1(input));
console.log(part1(input, 30000000));

export {}