import { readLines, run } from '../run';

const marker = 'X';
type InputType = string;
type Board = InputType[][];
type Input = [InputType[], Board[]];

const part1 = ([calledNumbers, boards]: Input) => {
  for (let i = 0; i < calledNumbers.length; i++) {
    const calledNumber = calledNumbers[i];
    for (let j = 0; j < boards.length; j++) {
      const board = boards[j];
      markBoard(board, calledNumber);
      if (i >= 4 && isBoardWinner(board)) {
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
      if (i >= 4 && isBoardWinner(board)) {
        if (boards.length === 1) {
          return calculateScore(board, calledNumber);
        }

        boards.splice(j, 1);
        j--;
      }
    }
  }
};

const calculateScore = (board: Board, lastCalledNumber: InputType) => {
  const unmarkedSum = board.reduce((boardSum, row) => {
    return boardSum + row.reduce((rowSum, cell) => rowSum + (cell !== marker ? parseInt(cell) : 0), 0);
  }, 0);

  return unmarkedSum * parseInt(lastCalledNumber);
};

const markBoard = (board: Board, num: InputType) => {
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === num) board[i][j] = marker;
    });
  });
};

const isBoardWinner = (board: Board) => {
  // Check Columns
  const [firstRow] = board;
  for (let i = 0; i < firstRow.length; i++) {
    const val = firstRow[i];
    if (val === marker) {
      let isWinner = true;

      for (let j = 1; j < board.length; j++) {
        if (board[j][i] !== marker) {
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
    if (row[0] === marker) {
      let isWinner = true;
      for (let j = 1; j < row.length; j++) {
        if (row[j] !== marker) {
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
  const calledNumbers: InputType[] = input[0].split(',');
  const boards: Array<InputType[][]> = [];
  let board: InputType[][] = [];
  for (let i = 2; i < input.length; i++) {
    const line = input[i];
    if (line) {
      const gameRow = line.trim().split(/ +/);
      board.push(gameRow);
    }

    if (!line || i + 1 === input.length) {
      boards.push(board);
      board = [];
    }
  }
  return [calledNumbers, boards];
}

const processedInput = processInput(readLines('./day04-input'));

run(part1, processedInput); // part1: 39902 -- 0.8405ms
run(part2, processedInput); // part2: 26936 -- 1.7435ms
