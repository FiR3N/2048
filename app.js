document.addEventListener("DOMContentLoaded", () => {
  const score = document.getElementById("score");
  const cells = document.querySelectorAll(".game__cell");
  const moveUpButton = document.getElementById("move-up");
  const moveDownButton = document.getElementById("move-down");
  const moveLeftButton = document.getElementById("move-left");
  const moveRightButton = document.getElementById("move-right");
  const restartButton = document.getElementById("restart");
  const size = 4;
  let matrix = [];
  let isGameOver = false;
  let isGameInfinite = false;
  restartButton.addEventListener("click", restartButtonHandler);
  document.addEventListener("keydown", (event) => {
    if (isGameOver) return;
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        moveActionHanlder(moveUpButton, moveTop);
        break;
      case "ArrowDown":
        event.preventDefault();
        moveActionHanlder(moveDownButton, moveButton);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveActionHanlder(moveLeftButton, moveLeft);
        break;
      case "ArrowRight":
        event.preventDefault();

        moveActionHanlder(moveRightButton, moveRight);
        break;
    }
  });

  startGame();

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  function generateMatrix() {
    for (let i = 0; i < size; i++) {
      matrix[i] = Array(size).fill(0);
    }
  }
  function fillMatrix() {
    cells.forEach((item, index) => {
      matrix[Math.floor(index / size)][index % size] = Number(item.innerHTML);
    });
  }
  function fillCells() {
    cells.forEach((item, index) => {
      if (matrix[Math.floor(index / size)][index % size] > 0) {
        item.innerHTML = matrix[Math.floor(index / size)][index % size];
        item.setAttribute(
          "data-value",
          matrix[Math.floor(index / size)][index % size]
        );
      } else {
        item.innerHTML = "";
        item.setAttribute("data-value", 0);
      }
    });
  }
  function fillRandomCell() {
    setTimeout(() => {
      let randomNum = getRandomInt(10);
      let emptyCellsIndexArray = [];
      for (let i = 0, total = size * size; i < total; i++) {
        if (matrix[Math.floor(i / size)][i % size] === 0) {
          emptyCellsIndexArray.push(i);
        }
      }
      let newFilledCellIndex =
        emptyCellsIndexArray[getRandomInt(emptyCellsIndexArray.length)];

      cells.forEach((item, index) => {
        if (index == newFilledCellIndex) {
          item.innerHTML = randomNum === 0 ? 4 : 2;
          item.setAttribute("data-value", randomNum === 0 ? 4 : 2);
        }
      });
      fillMatrix(matrix, cells);
      checkGameOver();
    }, 50);
  }
  function transposeMatrix() {
    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
      }
    }
  }
  function startGame() {
    generateMatrix();
    fillRandomCell();
    fillRandomCell();
  }
  function restartGame() {
    isGameOver = false;
    score.innerHTML = 0;
    cells.forEach((item) => {
      item.innerHTML = "";
      item.setAttribute("data-value", 0);
    });
    startGame();
  }
  function checkGameOver() {
    for (let i = 0; i < size; i++) {
      const row = matrix[i];
      const nextRow = matrix[i + 1];
      for (let j = 0; j < size; j++) {
        const cell = row[j];
        if (cell === 0) {
          return false;
        }
        if (j < size - 1 && cell === row[j + 1]) {
          return false;
        }
        if (i < size - 1 && cell === nextRow[j]) {
          return false;
        }
      }
    }
    isGameOver = true;
    setTimeout(() => {
      alert("Игра окончена! Нет доступных ходов.");
      restartGame();
    }, 300);

    return true;
  }
  function checkWinCondition() {
    const hasWinningTile = matrix.some((row) => row.includes(2048));

    if (hasWinningTile && !isGameInfinite) {
      const answer = confirm(
        "Вы победили! Вы собрали плитку 2048!\n\nЖелаете продолжить игру для набора большего счета?"
      );
      if (!answer) {
        restartGame();
      } else {
        isGameInfinite = true;
      }
      return true;
    }
    return false;
  }
  function moveLeft() {
    for (let i = 0; i < size; i++) {
      let filteredRow = matrix[i].filter((num) => num);
      matrix[i] = filteredRow.concat(Array(4 - filteredRow.length).fill(0));
    }
    combineRowLeft();
    fillCells();
  }
  function moveRight() {
    for (let i = 0; i < size; i++) {
      let filteredRow = matrix[i].filter((num) => num);
      matrix[i] = Array(4 - filteredRow.length)
        .fill(0)
        .concat(filteredRow);
    }
    combineRowRight();
    fillCells();
  }
  function moveButton() {
    transposeMatrix();
    for (let i = 0; i < size; i++) {
      let filteredRow = matrix[i].filter((num) => num);
      matrix[i] = Array(4 - filteredRow.length)
        .fill(0)
        .concat(filteredRow);
    }
    combineRowRight();
    transposeMatrix();
    fillCells();
  }
  function moveTop() {
    transposeMatrix();
    for (let i = 0; i < size; i++) {
      let filteredRow = matrix[i].filter((num) => num);
      matrix[i] = filteredRow.concat(Array(4 - filteredRow.length).fill(0));
    }
    combineRowLeft();
    transposeMatrix();
    fillCells();
  }
  function combineRowLeft() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - 1; j++) {
        if (matrix[i][j + 1] === matrix[i][j]) {
          matrix[i][j] = matrix[i][j] + matrix[i][j + 1];
          matrix[i][j + 1] = 0;
          score.innerHTML = parseInt(score.innerHTML) + matrix[i][j];
        }
      }
    }
  }
  function combineRowRight() {
    for (let i = 0; i < size; i++) {
      for (let j = size - 1; j > 0; j--) {
        if (matrix[i][j] === matrix[i][j - 1]) {
          matrix[i][j] = matrix[i][j] + matrix[i][j - 1];
          matrix[i][j - 1] = 0;
          score.innerHTML = parseInt(score.innerHTML) + matrix[i][j];
        }
      }
    }
  }
  function restartButtonHandler() {
    const restartConditon = window.confirm(
      "Are you really want to restart a game?"
    );
    if (restartConditon) {
      restartGame();
    }
  }
  function moveActionHanlder(element, method) {
    element.classList.add("_active");
    setTimeout(() => {
      element.classList.remove("_active");
    }, 150);
    const matrixBeforeMove = JSON.parse(JSON.stringify(matrix));
    method();
    const matrixAfterMove = JSON.parse(JSON.stringify(matrix));
    if (JSON.stringify(matrixBeforeMove) !== JSON.stringify(matrixAfterMove)) {
      setTimeout(() => {
        checkWinCondition();
      }, 50);
      fillRandomCell();
    }
  }
});
