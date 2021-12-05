import { readLines, run } from '../run';

// const marker = 'X';
type Value = string;
type Board = Value[][];
type BoardMark = { marked: boolean; x: number; y: number };
type BoardMarks = { [value: Value]: BoardMark };
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
      const boardProps = boards[j];
      if (markBoard(boardProps, calledNumber)) {
        return calculateScore(boardProps, calledNumber);
      }
    }
  }
};

const part2 = ([calledNumbers, boards]: Input) => {
  for (let i = 0; i < calledNumbers.length; i++) {
    const calledNumber = calledNumbers[i];
    for (let j = 0; j < boards.length; j++) {
      const boardProps = boards[j];
      if (markBoard(boardProps, calledNumber)) {
        if (boards.length === 1) {
          return calculateScore(boardProps, calledNumber);
        }

        boards.splice(j, 1);
        j--;
      }
    }
  }
};

const calculateScore = ({ board, boardMarks }: BoardProps, lastCalledNumber: Value) => {
  const unmarkedSum = board.reduce((boardSum, row) => {
    return boardSum + row.reduce((rowSum, value) => rowSum + (!boardMarks[value].marked ? parseInt(value) : 0), 0);
  }, 0);

  return unmarkedSum * parseInt(lastCalledNumber);
};

const markBoard = (boardProps: BoardProps, lastCalledNumber: Value) => {
  const { boardMarks } = boardProps;
  if (boardMarks.hasOwnProperty(lastCalledNumber)) {
    const boardMark = boardMarks[lastCalledNumber];
    boardMark.marked = true;
    boardProps.totalMarks++;

    // Check Win Condition only if there are 4 or more total marks
    if (boardProps.totalMarks > 4) return isBoardWinner(boardProps, lastCalledNumber);
  }

  return false;
};

const isBoardWinner = (boardProps: BoardProps, lastCalledNumber: Value) => {
  return isRowWinner(boardProps, lastCalledNumber) || isColWinner(boardProps, lastCalledNumber);
};

const isRowWinner = (boardProps: BoardProps, lastCalledNumber: Value) => {
  return isDirWinner(boardProps, lastCalledNumber, -1, 0) && isDirWinner(boardProps, lastCalledNumber, 1, 0);
};

const isColWinner = (boardProps: BoardProps, lastCalledNumber: Value) => {
  return isDirWinner(boardProps, lastCalledNumber, 0, -1) && isDirWinner(boardProps, lastCalledNumber, 0, 1);
};

const isDirWinner = ({ board, boardMarks }: BoardProps, lastCalledNumber: Value, xStep: number, yStep: number) => {
  const [firstRow] = board;
  let { x, y } = boardMarks[lastCalledNumber];

  // Skip current board mark because we just marked it
  (x += xStep), (y += yStep);

  while (x >= 0 && x < firstRow.length && y >= 0 && y < board.length) {
    if (!boardMarks[board[y][x]].marked) return false;
    (x += xStep), (y += yStep);
  }
  return true;
};

function processInput(input: string[]): Input {
  const calledNumbers: CalledNumbers = input[0].split(',');
  const boardPropsArr: BoardProps[] = [];
  let board: Board = [];
  let boardMarks: BoardMarks = {};
  for (let i = 2; i < input.length; i++) {
    const line = input[i];
    if (line) {
      const row = line.trim().split(/ +/);
      const y = board.push(row) - 1;
      row.forEach((value, x) => (boardMarks[value] = { marked: false, x, y }));
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

run(part1, processedInput); // part1: 39902 -- 0.0899ms
run(part2, processedInput); // part2: 26936 -- 0.1963ms
