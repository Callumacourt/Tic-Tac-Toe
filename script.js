/* eslint-disable operator-linebreak */
/* eslint-disable wrap-iife */
const gridCell = document.querySelectorAll('.gridCell');
const oButton = document.querySelector('.O');
const xButton = document.querySelector('.X');
const buttonWrapper = document.querySelector('.buttonWrapper');
const winnerDisplayer = document.querySelector('.winner');
const resetButton = document.querySelector('.resetButton');
const playerWinsTracker = document.querySelector('.playerWins');
const computerWinsTracker = document.querySelector('.computerWins');
const endGameButton = document.querySelector('.endGame');

// eslint-disable-next-line wrap-iife

const GameboardModule = (function () {
  const gameboard = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const winningCombinations = [
    /* rows */
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    /* diagonals */
    [1, 5, 9],
    [3, 5, 7],
    /* columns */
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
  ];

  let playerWins;
  let computerWins;

  function checkForWinner() {
    let winner = null;
    GameboardModule.winningCombinations.forEach((combination) => {
      const firstCell = document.getElementById(combination[0].toString());
      const secondCell = document.getElementById(combination[1].toString());
      const thirdCell = document.getElementById(combination[2].toString());
      if (
        firstCell.innerHTML === secondCell.innerHTML &&
        secondCell.innerHTML === thirdCell.innerHTML &&
        firstCell.innerHTML.trim() !== '' &&
        firstCell.innerHTML !== undefined
      ) {
        winner = firstCell.innerHTML;
        return winner;
      }
    });
    return winner;
  }

  function checkForDraw() {
    if (
      GameboardModule.checkForWinner() === null &&
      Array.from(gridCell).every((cell) => cell.innerHTML !== '')
    ) {
      winnerDisplayer.innerHTML = "It's a draw!";
    }
  }

  return {
    gameboard,
    winningCombinations,
    checkForWinner,
    checkForDraw,
  };
})();

const gameFlowModule = (function () {
  let pieceChoice;
  let computerPiece;
  let turnDecider = 'player';
  let playerArray;
  let computerArray;
  playerArray = [];
  computerArray = [];

  let gameOver = false;

  function getComputerPiece() {
    if (pieceChoice === 'O') {
      computerPiece = 'X';
    } else if (pieceChoice === 'X') {
      computerPiece = 'O';
    } else {
      console.error();
    }
  }

  function getPlayerPiece() {
    if (pieceChoice === undefined) {
      const oButtonClickHandler = () => {
        pieceChoice = 'O';
        buttonWrapper.classList.remove('selectionNeeded');
        getComputerPiece();
        oButton.removeEventListener('click', oButtonClickHandler);
        xButton.removeEventListener('click', xButtonClickHandler);
      };

      const xButtonClickHandler = () => {
        pieceChoice = 'X';
        buttonWrapper.classList.remove('selectionNeeded');
        getComputerPiece();
        xButton.removeEventListener('click', xButtonClickHandler);
        oButton.removeEventListener('click', oButtonClickHandler);
      };

      oButton.addEventListener('click', oButtonClickHandler);
      xButton.addEventListener('click', xButtonClickHandler);
    }
  }

  function resetPieces() {
    pieceChoice = undefined;
    computerPiece = undefined;
  }

  function generateComputerChoice() {
    return Math.floor(Math.random() * 9) + 1;
  }

  let computerWins;
  let playerWins;
  computerWins = 0;
  playerWins = 0;

  function setComputerChoice() {
    if (GameboardModule.gameboard.length === 0) {
      return;
    }

    let flag;
    flag = false;

    const computerChoice = generateComputerChoice();
    const index = GameboardModule.gameboard.indexOf(computerChoice);
    if (index !== -1) {
      const cell = document.getElementById(computerChoice.toString());
      cell.innerHTML = computerPiece;
      computerArray.push(computerChoice);
      console.log(computerArray);
      GameboardModule.gameboard.splice(index, 1);
      const winner = GameboardModule.checkForWinner();
      if (winner !== null) {
        winnerDisplayer.innerHTML = `${winner} wins!`;
        gameOver = true;
        /* turn into function please */
        if (winner === pieceChoice) {
          console.log('');
          playerWinsTracker.innerHTML = `Player Wins: ${playerWins}`;
        } else if (winner === computerPiece) {
          computerWins += 1;
          computerWinsTracker.innerHTML = `Computer Wins: ${computerWins}`;
        }
      }
      turnDecider = 'player';
    } else {
      setComputerChoice();
    }
  }

  function matchWinnerChecker() {
    if (computerWins > playerWins) {
      alert('The Computer has won the match');
    } else {
      alert('The Player has won the match');
    }
  }

  function getPlayerChoice() {
    Array.from(gridCell).forEach((cell) => {
      cell.addEventListener('click', () => {
        console.log(turnDecider);
        console.log(pieceChoice);
        console.log(cell.innerHTML);
        // Check if cell is empty, piece is chosen, and it's player's turn
        if (
          turnDecider === 'player' &&
          cell.innerHTML.trim() === '' &&
          pieceChoice !== undefined
        ) {
          // Get the ID of the selected cell and convert it to a number
          const selectedNumber = Number(cell.id);
          playerArray.push(selectedNumber);
          // Find the index of the selected number in the gameboard array
          const index = GameboardModule.gameboard.indexOf(selectedNumber);
          if (index !== -1) {
            // Remove the selected number from the gameboard array
            GameboardModule.gameboard.splice(index, 1);
          }

          // Set the innerHTML of the selected cell to the player's piece
          cell.innerHTML = pieceChoice;
          console.log(playerArray);
          console.log(pieceChoice);

          turnDecider = 'computer';
          GameboardModule.checkForDraw();
          const winner = GameboardModule.checkForWinner();
          if (winner !== null) {
            winnerDisplayer.innerHTML = `${winner} wins!`;
            gameOver = true;
            if (winner === pieceChoice) {
              playerWins += 1;
              flag = true;
              playerWinsTracker.innerHTML = `Player Wins: ${playerWins}`;
            } else if (winner === computerPiece) {
              computerWins += 1;
              computerWinsTracker.innerHTML = `Computer Wins: ${computerWins}`;
            }
          }

          setComputerChoice();
        } else if (pieceChoice === undefined) {
          buttonWrapper.classList.add('selectionNeeded');
        } else if (GameboardModule.checkForDraw === true) {
          winnerDisplayer.innerHTML = "It's a draw";
        }

        /* fixes reset error */
        if (gameOver === true) {
          turnDecider = 'player';
        }
      });
    });
  }
  return {
    getPlayerPiece,
    getPlayerChoice,
    getComputerPiece,
    resetPieces,
    playerArray,
    computerArray,
    matchWinnerChecker,
  };
})();

function resetGame() {
  GameboardModule.gameboard = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  winnerDisplayer.innerHTML = '';
  gameFlowModule.turnDecider = 'player';
  gameFlowModule.playerArray.length = 0;
  gameFlowModule.computerArray.length = 0;
  gameFlowModule.resetPieces();

  // Remove event listeners from cells
  Array.from(gridCell).forEach((cell) => {
    cell.innerHTML = '';
    cell.removeEventListener('click', gameFlowModule.getPlayerChoice);
  });

  // Add event listeners back to cells
  Array.from(gridCell).forEach((cell) => {
    cell.addEventListener('click', gameFlowModule.getPlayerChoice);
  });
  gameFlowModule.getPlayerPiece();
}

window.addEventListener('load', () => {
  gameFlowModule.getPlayerPiece();
  gameFlowModule.getPlayerChoice();
  endGameButton.addEventListener('click', () => {
    gameFlowModule.matchWinnerChecker();
  });
});

resetButton.addEventListener('click', () => {
  resetGame();
  console.log(GameboardModule.gameboard);
});
