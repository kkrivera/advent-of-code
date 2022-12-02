import { readLines, run } from '../run-deno.ts';

const enum HAND {
  'ROCK' = 1,
  'PAPER' = 2,
  'SCISSORS' = 3,
}

const enum OUTCOME {
  'LOSS' = 0,
  'DRAW' = 3,
  'VICTORY' = 6,
}

type Input1 = [HAND, HAND][];
type Input2 = [HAND, OUTCOME][];

const toHand = (i: string): HAND =>
  i === 'A' || i === 'X' ? HAND.ROCK : i === 'B' || i === 'Y' ? HAND.PAPER : HAND.SCISSORS;

const toOutcome = (i: string): OUTCOME => (i === 'X' ? OUTCOME.LOSS : i === 'Y' ? OUTCOME.DRAW : OUTCOME.VICTORY);

const getOutcome = (them: HAND, you: HAND): number => {
  let score = OUTCOME.LOSS;
  if (you === HAND.ROCK) {
    if (them === HAND.ROCK) score = OUTCOME.DRAW;
    else if (them === HAND.SCISSORS) score = OUTCOME.VICTORY;
  } else if (you === HAND.PAPER) {
    if (them === HAND.PAPER) score = OUTCOME.DRAW;
    else if (them == HAND.ROCK) score = OUTCOME.VICTORY;
  } else {
    if (them === HAND.SCISSORS) score = OUTCOME.DRAW;
    else if (them === HAND.PAPER) score = OUTCOME.VICTORY;
  }

  return score;
};

const getHand = (them: HAND, desiredOutcome: OUTCOME): HAND => {
  let you: HAND;
  if (desiredOutcome === OUTCOME.LOSS) {
    if (them === HAND.ROCK) you = HAND.SCISSORS;
    else if (them === HAND.PAPER) you = HAND.ROCK;
    else you = HAND.PAPER;
  } else if (desiredOutcome === OUTCOME.DRAW) {
    you = them;
  } else {
    if (them === HAND.ROCK) you = HAND.PAPER;
    else if (them === HAND.PAPER) you = HAND.SCISSORS;
    else you = HAND.ROCK;
  }

  return you;
};

const part1 = (input: Input1) => {
  return input.reduce((acc, [them, you]) => acc + you + getOutcome(them, you), 0);
};

const part2 = (input: Input2) => {
  return input.reduce((acc, [them, desiredOutcome]) => acc + desiredOutcome + getHand(them, desiredOutcome), 0);
};

const fullInput = readLines('./day02-input');

const input1 = fullInput.map((line) => line.split(' ').map(toHand)) as Input1;
const input2 = fullInput.map((line) =>
  line.split(' ').map((label, i) => (i === 0 ? toHand(label) : toOutcome(label)))
) as Input2;

run(part1, input1);
run(part2, input2);
