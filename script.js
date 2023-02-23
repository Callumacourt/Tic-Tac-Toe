const selectors = {
  gridCell: document.querySelectorAll('.gridCell'),
  oButton: document.querySelector('.O'),
  xButton: document.querySelector('.X'),
  buttonWrapper: document.querySelector('.buttonWrapper'),
  winnerDisplayer: document.querySelector('.winner'),
  resetButton: document.querySelector('.resetButton'),
  playerWinsTracker: document.querySelector('.playerWins'),
  computerWinsTracker: document.querySelector('.computerWins'),
  endGameButton: document.querySelector('.endGame'),
  matchWinner: document.querySelector('.matchWinner'),
};

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
        firstCell.innerHTML === secondCell.innerHTML
        && secondCell.innerHTML === thirdCell.innerHTML
        && firstCell.innerHTML.trim() !== ''
        && firstCell.innerHTML !== undefined
      ) {
        winner = firstCell.innerHTML;
        return winner;
      }
    });
    return winner;
  }

  function checkForDraw() {
    if (
      GameboardModule.checkForWinner() === null
      && Array.from(selectors.gridCell).every((cell) => cell.innerHTML !== '')
    ) {
      selectors.winnerDisplayer.innerHTML = "It's a draw!";
    }
  }

  return {
    gameboard,
    winningCombinations,
    checkForWinner,
    checkForDraw,
  };
}());

const gameFlowModule = (function () {
  let pieceChoice;
  let computerPiece;
  let turnDecider = 'player';

  function getComputerPiece() {
    if (pieceChoice === 'O') {
      computerPiece = 'X';
    } else if (pieceChoice === 'X') {
      computerPiece = 'O';
    }
  }

  function getPlayerPiece() {
    if (pieceChoice === undefined) {
      const handleClick = (piece) => {
        pieceChoice = piece;
        selectors.buttonWrapper.classList.remove('selectionNeeded');
        getComputerPiece();
        selectors.oButton.removeEventListener('click', handleOClick);
        selectors.xButton.removeEventListener('click', handleXClick);
      };

      const handleOClick = () => handleClick('O');
      const handleXClick = () => handleClick('X');

      selectors.oButton.addEventListener('click', handleOClick);
      selectors.xButton.addEventListener('click', handleXClick);
    }
  }

  function resetPieces() {
    pieceChoice = undefined;
    computerPiece = undefined;
  }

  function generateComputerChoice() {
    return Math.floor(Math.random() * 9) + 1;
  }

  const computerArray = [];
  const playerArray = [];
  let computerWins;
  computerWins = 0;
  let playerWins;
  playerWins = 0;
  let gameOver;
  gameOver = false;

  playerWins = 0;

  function winsTracker(winner) {
    if (winner === pieceChoice) {
      selectors.playerWinsTracker.innerHTML = `Player Wins: ${playerWins}`;
    } else if (winner === computerPiece) {
      computerWins += 1;
      selectors.computerWinsTracker.innerHTML = `Computer Wins: ${computerWins}`;
    }
  }

  function checkForWinnerAndUpdate(winner) {
    selectors.winnerDisplayer.innerHTML = `${winner} wins!`;
    gameOver = true;

    winsTracker(winner);
  }

  function setComputerChoice() {
    if (GameboardModule.gameboard.length === 0) {
      return;
    }
    const computerChoice = generateComputerChoice();
    const index = GameboardModule.gameboard.indexOf(computerChoice);

    if (index !== -1) {
      const cell = document.getElementById(computerChoice.toString());
      cell.innerHTML = computerPiece;
      computerArray.push(computerChoice);
      GameboardModule.gameboard.splice(index, 1);

      const winner = GameboardModule.checkForWinner();
      if (winner !== null) {
        checkForWinnerAndUpdate(winner);
      }
      turnDecider = 'player';
    } else {
      setComputerChoice();
    }
  }

  function resetWins() {
    computerWins = null;
    playerWins = null;
    selectors.computerWinsTracker.innerHTML = '';
    selectors.playerWinsTracker.innerHTML = '';
  }

  function matchWinnerChecker() {
    if (computerWins > playerWins) {
      selectors.matchWinner.innerHTML = 'The computer has won the match';
      resetWins();
    } else if (playerWins > computerWins) {
      selectors.matchWinner.innerHTML = 'The player has won the match';
      resetWins();
    } else {
      selectors.matchWinner.innerHTML = 'The match was a draw';
      resetWins();
    }
  }

  function updateWinner() {
    const winner = GameboardModule.checkForWinner();
    if (winner !== null) {
      selectors.winnerDisplayer.innerHTML = `${winner} wins!`;
      gameOver = true;
      if (winner === pieceChoice) {
        playerWins += 1;
        selectors.playerWinsTracker.innerHTML = `Player Wins: ${playerWins}`;
      } else if (winner === computerPiece) {
        computerWins += 1;
        selectors.computerWinsTracker.innerHTML = `Computer Wins: ${computerWins}`;
      }
    }
  }

  function getPlayerChoice() {
    Array.from(selectors.gridCell).forEach((cell) => {
      // Make player select a piece at game start //
      cell.addEventListener('click', () => {
        if (pieceChoice === undefined) {
          selectors.buttonWrapper.classList.add('selectionNeeded');
        }
        // Check if cell is empty, piece is chosen, it's player's turn and the game isn't over
        if (
          turnDecider === 'player'
          && cell.innerHTML.trim() === ''
          && pieceChoice !== undefined
          && selectors.winnerDisplayer.innerHTML === ''
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
          cell.innerHTML = pieceChoice;

          turnDecider = 'computer';
          GameboardModule.checkForDraw();
          updateWinner();

          setComputerChoice();

          /* fixes reset error -  */
          if (gameOver === true) {
            turnDecider = 'player';
          }
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
}());

const gameAdmin = (function () {
  function resetGame() {
    GameboardModule.gameboard = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    selectors.winnerDisplayer.innerHTML = '';
    gameFlowModule.turnDecider = 'player';
    gameFlowModule.playerArray.length = 0;
    gameFlowModule.computerArray.length = 0;
    selectors.matchWinner.innerHTML = '';
    gameFlowModule.resetPieces();

    Array.from(selectors.gridCell).forEach((cell) => {
      cell.innerHTML = '';
    });

    gameFlowModule.getPlayerPiece();
  }

  window.addEventListener('load', () => {
    gameFlowModule.getPlayerPiece();
    gameFlowModule.getPlayerChoice();
    selectors.endGameButton.addEventListener('click', () => {
      gameFlowModule.matchWinnerChecker();
    });
  });

  selectors.resetButton.addEventListener('click', () => {
    resetGame();
  });
}());
