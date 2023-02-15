/* eslint-disable wrap-iife */
const GameFlow = {};

const GameboardModule = (function () {
  const gameboard = ['x', 'o', 'x', 'x', 'o', 'x'];

  function printToScreen() {
    const container = document.createElement('div');
    for (let i = 0; i < gameboard.length; i++) {
      const cell = document.createElement('div');
      cell.innerHTML = gameboard[i];
      container.appendChild(cell);
    }
    document.body.appendChild(container);
  }

  return {
    printToScreen,
  };
})();

GameboardModule.printToScreen();

export default GameboardModule;

const playerCreator = (playerName) => {
  const player = {
    name: playerName,
  };
  return player;
};

const PlayerOne = playerCreator('Player');

console.log(PlayerOne);
