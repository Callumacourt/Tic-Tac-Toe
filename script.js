/* eslint-disable operator-linebreak */
/* eslint-disable wrap-iife */
const gridCell = document.querySelectorAll('.gridCell');
const oButton = document.querySelector('.O');
const xButton = document.querySelector('.X');
const buttonWrapper = document.querySelector('.buttonWrapper');
const winnerDisplayer = document.querySelector('.winner');

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

  return {
    gameboard,
    winningCombinations,
    checkForWinner,
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
    if (pieceChoice !== 'X' || pieceChoice !== 'O') {
      oButton.addEventListener('click', () => {
        pieceChoice = 'O';
        buttonWrapper.classList.remove('selectionNeeded');
        getComputerPiece();
        oButton.removeEventListener('click', () => {});
      });
      xButton.addEventListener('click', () => {
        pieceChoice = 'X';
        getComputerPiece();
        buttonWrapper.classList.remove('selectionNeeded');
      });
    }
  }

  function generateComputerChoice() {
    return Math.floor(Math.random() * 9) + 1;
  }

  function setComputerChoice() {
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
      }
      turnDecider = 'player';
    } else {
      setComputerChoice();
    }
  }

  function getPlayerChoice() {
    Array.from(gridCell).forEach((cell) => {
      cell.addEventListener('click', () => {
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

          // Change the turn decider to the computer
          turnDecider = 'computer';
          const winner = GameboardModule.checkForWinner();
          if (winner !== null) {
            winnerDisplayer.innerHTML = `${winner} wins!`;
          }
          setComputerChoice();
        } else if (pieceChoice === undefined) {
          buttonWrapper.classList.add('selectionNeeded');
        }
      });
    });
  }

  return {
    getPlayerPiece,
    getPlayerChoice,
    getComputerPiece,
  };
})();

const playerCreator = (playerName) => {
  const player = {
    name: playerName,
  };
  return player;
};

window.addEventListener('load', () => {
  gameFlowModule.getPlayerPiece();
  gameFlowModule.getPlayerChoice();
});
