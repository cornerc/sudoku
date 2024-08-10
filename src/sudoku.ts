class Sudoku {
  private board: Cell[][] = [];

  constructor(numbers: number[][]) {
    for (let row = 0; row < 9; row++) {
      this.board.push([]);
      for (let col = 0; col < 9; col++) {
        this.board[row].push(new Cell(numbers[row][col]));
      }
    }
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
    for (let BRow = 0; BRow < 3; BRow++) {
      for (let BCol = 0; BCol < 3; BCol++) {
        const uniqueNumMap = new Set<number>();
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            const num = this.board[BRow * 3 + row][BCol * 3 + col].getNum();
            if (num !== undefined) {
              uniqueNumMap.add(num);
            }
          }
        }
        if (uniqueNumMap.size !== 9) {
          console.log(`Block ${BRow + 1}-${BCol + 1} is invalid`);
          valid = false;
        }
      }
    }
    return valid;
  }

  /** フィールドの情報を出力する */
  info(table = false) {
    if (table) {
      const divider = "-------------------------------------";
      const boldDivider = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
      const separate = "|";
      const boldSeparate = "┃";

      console.log(boldDivider);
      for (let row = 0; row < 9; row++) {
        let rowStr = boldSeparate;
        for (let col = 0; col < 9; col++) {
          rowStr += " ";
          rowStr += this.board[row][col].getNum() || " ";
          rowStr += " ";
          rowStr += (col + 1) % 3 === 0 ? boldSeparate : separate;
        }
        console.log(rowStr);
        console.log((row + 1) % 3 === 0 ? boldDivider : divider);
      }
    } else {
      console.log(this.board);
    }
  }
}

class Cell {
  private num: number | undefined = undefined;
  constructor(initialNum?: number) {
    this.num = initialNum;
  }

  getNum() {
    if (this.num !== 0 && this.num !== undefined) {
      return this.num;
    } else {
      return undefined;
    }
  }
}

export default Sudoku;
