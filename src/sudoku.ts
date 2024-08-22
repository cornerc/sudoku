class Sudoku {
  private board: Cell[][] = [];

  constructor(numbers: number[][]) {
    for (let row = 0; row < 9; row++) {
      this.board.push([]);
      for (let col = 0; col < 9; col++) {
        this.board[row].push(new Cell(numbers[row][col]));
      }
    }
    this.updateCandidates();
  }

  /** 数独のルールに従っているかを検証 */
  validate() {
    let valid = true;
    // 行の検査
    for (let row = 0; row < 9; row++) {
      const uniqueNumMap = new Set<number>();
      for (let col = 0; col < 9; col++) {
        const num = this.board[row][col].getNum();
        if (num !== undefined) {
          uniqueNumMap.add(num);
        }
      }
      if (uniqueNumMap.size !== 9) {
        console.log(`Row ${row + 1} is invalid`);
        valid = false;
      }
    }

    // 列の検査
    for (let col = 0; col < 9; col++) {
      const uniqueNumMap = new Set<number>();
      for (let row = 0; row < 9; row++) {
        const num = this.board[row][col].getNum();
        if (num !== undefined) {
          uniqueNumMap.add(num);
        }
      }
      if (uniqueNumMap.size !== 9) {
        console.log(`Col ${col + 1} is invalid`);
        valid = false;
      }
    }

    // ブロックの検査
    this.runAllBlock((BRow, BCol) => {
      const uniqueNumMap = new Set<number>();
      this.runAllBlock((row, col) => {
        const num = this.board[BRow * 3 + row][BCol * 3 + col].getNum();
        if (num !== undefined) {
          uniqueNumMap.add(num);
        }
      });
      if (uniqueNumMap.size !== 9) {
        console.log(`Block ${BRow + 1}-${BCol + 1} is invalid`);
        valid = false;
      }
    });
    return valid;
  }

  /** フィールドの情報を出力する */
  info() {
    let field = "";
    const divider = "-------------------------------------";
    const boldDivider = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
    const separate = "|";
    const boldSeparate = "┃";
    const breakLine = "\n";

    field += boldDivider + breakLine;
    for (let row = 0; row < 9; row++) {
      let rowStr = boldSeparate;
      for (let col = 0; col < 9; col++) {
        rowStr += " ";
        rowStr += this.board[row][col].getNum() || " ";
        rowStr += " ";
        rowStr += (col + 1) % 3 === 0 ? boldSeparate : separate;
      }
      field += rowStr + breakLine;
      field += ((row + 1) % 3 === 0 ? boldDivider : divider) + breakLine;
    }
    return field;
  }

  /** フィールドの候補情報を出力する */
  candidateInfo() {
    let field = "";
    this.runAllCell((row, col) => {
      field += `(${row + 1}, ${col + 1}): ${this.board[row][
        col
      ].getCandidates()}\n`;
    });
    return field;
  }

  /** 候補の更新 */
  updateCandidates() {
    // 行の検査
    for (let row = 0; row < 9; row++) {
      const uniqueNumMap = new Set<number>();
      for (let col = 0; col < 9; col++) {
        const num = this.board[row][col].getNum();
        if (num !== undefined) {
          uniqueNumMap.add(num);
        }
      }
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col].getNum() !== undefined) {
          continue;
        }
        this.board[row][col].setCandidates(
          this.board[row][col]
            .getCandidates()
            .filter((candidate) => !uniqueNumMap.has(candidate))
        );
      }
    }

    // 列の検査
    for (let col = 0; col < 9; col++) {
      const uniqueNumMap = new Set<number>();
      for (let row = 0; row < 9; row++) {
        const num = this.board[row][col].getNum();
        if (num !== undefined) {
          uniqueNumMap.add(num);
        }
      }
      for (let row = 0; row < 9; row++) {
        if (this.board[row][col].getNum() !== undefined) {
          continue;
        }
        this.board[row][col].setCandidates(
          this.board[row][col]
            .getCandidates()
            .filter((candidate) => !uniqueNumMap.has(candidate))
        );
      }
    }

    // ブロックの検査
    this.runAllBlock((BRow, BCol) => {
      const uniqueNumMap = new Set<number>();
      this.runAllBlock((row, col) => {
        const num = this.board[BRow * 3 + row][BCol * 3 + col].getNum();
        if (num !== undefined) {
          uniqueNumMap.add(num);
        }
      });
      this.runAllBlock((row, col) => {
        if (this.board[BRow * 3 + row][BCol * 3 + col].getNum() !== undefined) {
          return;
        }
        this.board[BRow * 3 + row][BCol * 3 + col].setCandidates(
          this.board[BRow * 3 + row][BCol * 3 + col]
            .getCandidates()
            .filter((candidate) => !uniqueNumMap.has(candidate))
        );
      });
    });
  }

  /** 数独を解く */
  run() {
    /** 解法1: 候補が１つしかないセルは数字が決定する */
    this.runAllCell((row, col) => {
      const candidates = this.board[row][col].getCandidates();
      if (candidates.length === 1) {
        this.board[row][col].setNum(candidates[0]);
      }
    });

    /** 解法2: 行・列・ブロックで候補が唯一つの場合数字が決定する */

    this.updateCandidates();
  }

  /** 全てのセルを走査するための汎用関数 */
  private runAllCell(callBack: (row: number, col: number) => void) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        callBack(row, col);
      }
    }
  }

  /** 全てのブロックを走査するための汎用関数 */
  private runAllBlock(callBack: (row: number, col: number) => void) {
    for (let BRow = 0; BRow < 3; BRow++) {
      for (let BCol = 0; BCol < 3; BCol++) {
        callBack(BRow, BCol);
      }
    }
  }
}

class Cell {
  private num: number | undefined = undefined;
  private candidates: number[] = [];
  constructor(initialNum?: number) {
    if (initialNum !== 0 && initialNum !== undefined) {
      this.num = initialNum;
    } else {
      this.num = undefined;
      this.candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
  }

  getNum() {
    return this.num;
  }

  setNum(initialNum?: number) {
    if (initialNum !== 0 && initialNum !== undefined) {
      this.num = initialNum;
      this.candidates = [];
    } else {
      this.num = undefined;
      this.candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
  }

  getCandidates() {
    return this.candidates;
  }

  setCandidates(candidates: number[]) {
    this.candidates = candidates;
  }
}

export default Sudoku;
