import { readLines, run } from '../run';

// const marker = 'X';
type Value = string;
type Board = Value[][];
type BoardMarks = { [value: Value]: boolean };
type BoardProps = {
  board: Board;
  boardMarks: BoardMarks;
  totalMarks: number;
};
type CalledNumbers = Value[];
type Input = [CalledNumbers, BoardProps[]];

const part1 = ([calledNumbers, boards]: Input) => {
  for (let i = 0; i < calledNumbers.length; i++) {
    const calledNumber = calledNumbers[i];
    for (let j = 0; j < boards.length; j++) {
      const board = boards[j];
      markBoard(board, calledNumber);
      if (isBoardWinner(board)) {
        return calculateScore(board, calledNumber);
      }
    }
  }
};

const part2 = ([calledNumbers, boards]: Input) => {
  for (let i = 0; i < calledNumbers.length; i++) {
    const calledNumber = calledNumbers[i];
    for (let j = 0; j < boards.length; j++) {
      const board = boards[j];
      markBoard(board, calledNumber);
      if (isBoardWinner(board)) {
        if (boards.length === 1) {
          return calculateScore(board, calledNumber);
        }

        boards.splice(j, 1);
        j--;
      }
    }
  }
};

const calculateScore = ({ board, boardMarks }: BoardProps, lastCalledNumber: Value) => {
  const unmarkedSum = board.reduce((boardSum, row) => {
    return boardSum + row.reduce((rowSum, value) => rowSum + (!boardMarks[value] ? parseInt(value) : 0), 0);
  }, 0);

  return unmarkedSum * parseInt(lastCalledNumber);
};

const markBoard = (boardProps: BoardProps, num: Value) => {
  const { boardMarks } = boardProps;
  if (boardMarks.hasOwnProperty(num)) {
    boardMarks[num] = true;
    boardProps.totalMarks++;
  }
};

const isBoardWinner = ({ board, boardMarks, totalMarks }: BoardProps): boolean => {
  if (totalMarks < 5) return false;

  // Check Columns
  const [firstRow] = board;
  for (let i = 0; i < firstRow.length; i++) {
    const val = firstRow[i];
    if (boardMarks[val]) {
      let isWinner = true;

      for (let j = 1; j < board.length; j++) {
        if (!boardMarks[board[j][i]]) {
          isWinner = false;
          break;
        }
      }

      if (isWinner) return true;
    }
  }

  // Check rows
  for (let i = 0; i < board.length; i++) {
    const row = board[i];
    if (boardMarks[row[0]]) {
      let isWinner = true;
      for (let j = 1; j < row.length; j++) {
        if (!boardMarks[row[j]]) {
          isWinner = false;
          break;
        }
      }

      if (isWinner) return true;
    }
  }

  return false;
};

function processInput(input: string[]): Input {
  const calledNumbers: CalledNumbers = input[0].split(',');
  const boardPropsArr: BoardProps[] = [];
  let board: Board = [];
  let boardMarks: BoardMarks = {};
  for (let i = 2; i < input.length; i++) {
    const line = input[i];
    if (line) {
      const gameRow = line.trim().split(/ +/);
      board.push(gameRow);
      gameRow.forEach((value) => (boardMarks[value] = false));
    }

    if (!line || i + 1 === input.length) {
      boardPropsArr.push({ board, boardMarks, totalMarks: 0 });
      board = [];
      boardMarks = {};
    }
  }

  return [calledNumbers, boardPropsArr];
}

const processedInput = processInput(readLines('./day04-input'));

run(part1, processedInput); // part1: 39902 -- 0.243ms
run(part2, processedInput); // part2: 26936 -- 0.7492ms
