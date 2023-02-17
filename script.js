/* eslint-disable operator-linebreak */
/* eslint-disable wrap-iife */
const gridCell = document.querySelectorAll('.gridCell');
const oButton = document.querySelector('.O');
const xButton = document.querySelector('.X');
const buttonWrapper = document.querySelector('.buttonWrapper');

// eslint-disable-next-line wrap-iife

const GameboardModule = (function () {
  const gameboard = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return {
    gameboard,
  };
})();

const gameFlowModule = (function () {
  let pieceChoice;
  let computerPiece;
  let turnDecider = 'player';
  let computerChoice;

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

  function getComputerChoice() {
    if (turnDecider === 'computer') {
      computerChoice = Math.floor(Math.random() * 9) + 1;
      const cell = document.getElementById(computerChoice.toString());
      cell.innerHTML = computerPiece;
      turnDecider = 'player';
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
          // Find the index of the selected number in the gameboard array
          const index = GameboardModule.gameboard.indexOf(selectedNumber);
          if (index !== -1) {
            // Remove the selected number from the gameboard array
            GameboardModule.gameboard.splice(index, 1);
          }

          // Set the innerHTML of the selected cell to the player's piece
          cell.innerHTML = pieceChoice;
          console.log(GameboardModule.gameboard);

          // Change the turn decider to the computer
          turnDecider = 'computer';
          getComputerChoice();
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
