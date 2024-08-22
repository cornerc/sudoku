import Sudoku from "./sudoku";

const sudoku = new Sudoku([
  [9, 7, 8, 6, 2, 5, 3, 1, 4],
  [3, 4, 2, 1, 8, 9, 7, 6, 5],
  [6, 1, 5, 4, 3, 7, 2, 9, 8],
  [4, 8, 3, 7, 9, 2, 6, 5, 1],
  [5, 6, 1, 3, 4, 8, 9, 2, 7],
  [7, 2, 9, 5, 6, 1, 4, 8, 3],
  [1, 9, 7, 2, 5, 3, 8, 4, 6],
  [8, 5, 6, 9, 7, 4, 1, 3, 2],
  [2, 3, 4, 8, 1, 6, 5, 0, 9],
]);

console.log(sudoku.info(true));
console.log(sudoku.validate());
