// Export each element individually
export const playerNumberSelect = document.getElementById('player-number');
export const beginChallengeButton = document.getElementById('begin-challenge');
export const gameContainer = document.getElementById('game-container');
export const player = document.getElementById('player');
export const timerDisplay = document.getElementById('timer-display');
export const playerSelector = document.getElementById('player-selector');
export const startGameButton = document.getElementById('start-game');
export const gameOverElement = document.getElementById('game-over');
export const retryButton = document.getElementById('retry-button');
export const homeButton = document.getElementById('home-button');

export const hearts = [
  document.getElementById('heart1'),
  document.getElementById('heart2'),
  document.getElementById('heart3')
];

// Sound elements
//const typingSound = document.getElementById('typing-sound');
export const gameStartSound = document.getElementById('game-start-sound');
export const countdownSound = document.getElementById('countdown-sound');
export const countdownFastSound = document.getElementById('countdown-fast-sound');
export const eliminationSound = document.getElementById('elimination-sound');
export const victorySound = document.getElementById('victory-sound');

export let gameTime;
export let lives = 3;
export let score = 0;
export let gameOver = false;
export let timerInterval;

export function getLives() { return lives; }
export function setLives(value) { lives = value; }

export function getScore() { return score; }
export function setScore(value) { score = value; }

export function isGameOver() { return gameOver; }
export function setGameOver(value) { gameOver = value; }

export function getTimerInterval() { return timerInterval; }
export function setTimerInterval(value) { timerInterval = value; }