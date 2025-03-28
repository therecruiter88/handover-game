import { startIntro } from '/challenges/common/js/storyline.js';
import { setupEventListeners, triggerStartGame, initializeGameParameters, startTimer, endGame } from '/challenges/common/js/game-mechanics.js';
import { showPlayerNumberInput, isPlayerNumberValid } from '/challenges/common/js/player-input.js';
import * as GAME from '/challenges/common/js/game-variables.js';
import { getScore, setScore, isGameOver, getTimerInterval, setTimerInterval } from '/challenges/common/js/game-variables.js';

const gameId = "challenge-1";
const storyTitles = ["Storyline", "Challenge"];

// Specific storyline
const storylineText = [
  "Today was meant to be a simple farewell pizza party for Player 297. But something went horribly wrong. Dark forces have unleashed an unstoppable plague of pineapple pizzas, threatening to take over the planet and ruining the party...",
  "What was once a celebration has become a mission, a battle for survival. To save Player 297 farewell party and stop the invasion, you must destroy every mutant pizza before it's too late! You have 30 seconds to do it, so...good luck...i guess..."
];

//Specific game elements
const scoreDisplay = document.getElementById('score-display');

// Specific game sounds
const laserSound = document.getElementById('laser-sound');

// Specific game mechanics variables
let startTime = 30;
let playerPosition = 270;
let bullets = [];
let targets = [];

// Specific game mechanics intervals
let gameInterval;
let targetGenerationInterval;

// Specific game key controls
const keys = {
  left: false,
  right: false,
  space: false
};

window.onload = showPlayerNumberInput;

// Call the setup function
setupEventListeners({
  playerNumberSelect: GAME.playerNumberSelect,
  playerNumberInput: GAME.playerNumberInput,
  beginChallengeButton: GAME.beginChallengeButton,
  isPlayerNumberValid,
  startIntro,
  storylineText,
  storyTitles,
  homeButton: GAME.homeButton,
});

// Specific game player selector
function handleShapeSelection() {
  if (selectedShape) {
    const playerSvg = GAME.player.querySelector('svg');

    if (selectedShape === 'circle') {
      playerSvg.innerHTML = `
        <rect x="15" y="10" width="30" height="40" fill="#ff0066" />
        <circle cx="30" cy="20" r="10" fill="black" />
        <circle cx="30" cy="20" r="5" fill="white" />
        <rect x="18" y="50" width="24" height="25" fill="#ff0066" />
        <rect x="10" y="40" width="40" height="10" fill="#ff0066" />
      `;
    } else if (selectedShape === 'square') {
      playerSvg.innerHTML = `
        <rect x="15" y="10" width="30" height="40" fill="#ff0066" />
        <circle cx="30" cy="20" r="10" fill="black" />
        <rect x="25" y="15" width="10" height="10" fill="white" />
        <rect x="18" y="50" width="24" height="25" fill="#ff0066" />
        <rect x="10" y="40" width="40" height="10" fill="#ff0066" />
      `;
    } else if (selectedShape === 'triangle') {
      playerSvg.innerHTML = `
        <rect x="15" y="10" width="30" height="40" fill="#ff0066" />
        <circle cx="30" cy="20" r="10" fill="black" />
        <polygon points="30,15 25,25 35,25" fill="white" />
        <rect x="18" y="50" width="24" height="25" fill="#ff0066" />
        <rect x="10" y="40" width="40" height="10" fill="#ff0066" />
      `;
    }

    // Hide player selector and show game
    GAME.playerSelector.style.display = 'none';
    GAME.gameContainer.style.display = 'block';

    // Start the game
    startGame();
  }
}

// Call the reusable function with custom shape selection logic
triggerStartGame(GAME.startGameButton, handleShapeSelection);

function startGame() {
  // Initialize common game state logic
  initializeGameParameters(GAME, startTime);
  // Initialize specific game state logic
  initializeGameSpecificParameters();

  // Start timer countdown
  setTimerInterval(
    startTimer(
      getTimerInterval(),
      startTime,
      GAME.timerDisplay, 
      GAME.countdownSound, 
      GAME.countdownFastSound,
      gameId,
      GAME, 
      getGameOptions()
    )
  );
  
}

function initializeGameSpecificParameters(){
  // Start game loops
  gameInterval = setInterval(updateGame, 20);
  targetGenerationInterval = setInterval(generateTarget, 500);

  // Position player
  playerPosition = (GAME.gameContainer.offsetWidth / 2) - 30;
  GAME.player.style.left = `${playerPosition}px`;

  // Update UI
  scoreDisplay.textContent = `Score: ${getScore()}`;
  bullets = [];
  targets = [];

  // Setup keyboard controls
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
}

function handleKeyDown(e) {
  if (e.key === 'ArrowLeft') keys.left = true;
  if (e.key === 'ArrowRight') keys.right = true;
  if (e.key === ' ' && !keys.space) {
    keys.space = true;

    // Reset sound and play
    laserSound.currentTime = 0; // Restart from beginning
    laserSound.play();
    laserSound.volume = 1.0;

    fireBullet();
  }
}

function handleKeyUp(e) {
  if (e.key === 'ArrowLeft') keys.left = false;
  if (e.key === 'ArrowRight') keys.right = false;
  if (e.key === ' ') keys.space = false;
}

function updateGame() {
  if (isGameOver()) return;
  
  // Move player
  const moveSpeed = 7;
  if (keys.left && playerPosition > 30) {
    playerPosition -= moveSpeed;
  }

  if (keys.right && playerPosition < GAME.gameContainer.offsetWidth - 30) {
    playerPosition += moveSpeed;
  }

  GAME.player.style.left = `${playerPosition}px`;
  
  // Update bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.y -= 7; // Move bullet up
    bullet.element.style.top = `${bullet.y}px`;
    
    // Remove bullets that are off screen
    if (bullet.y < 0) {
      GAME.gameContainer.removeChild(bullet.element);
      bullets.splice(i, 1);
    }
  }
  
  // Update targets
  for (let i = targets.length - 1; i >= 0; i--) {
    const target = targets[i];
    target.y += target.speed;
    target.element.style.top = `${target.y}px`;
    
    // Check if target hit bottom
    if (target.y > GAME.gameContainer.offsetHeight) {
      GAME.gameContainer.removeChild(target.element);      
      targets.splice(i, 1);
      continue;
    }
    
    // Check for bullet collisions
    for (let j = bullets.length - 1; j >= 0; j--) {
      const bullet = bullets[j];
      if (checkCollision(bullet, target)) {
        // Create hit effect
        createHitEffect(target.x, target.y);
        
        // Update score
        setScore(getScore() + 10);
        scoreDisplay.textContent = `Score: ${getScore()}`;
        
        // Remove bullet and target
        GAME.gameContainer.removeChild(bullet.element);
        GAME.gameContainer.removeChild(target.element);
        bullets.splice(j, 1);
        targets.splice(i, 1);
        
        // Check win condition
        if (getScore() >= 500) gameOver(true);
        
        break;
      }
    }
  }
}

function fireBullet() {
  const bulletElement = document.createElement('div');
  bulletElement.className = 'bullet';
  
  const bulletX = playerPosition + 27; // Center of player
  const bulletY = GAME.gameContainer.offsetHeight - 100; // Just above player
  
  bulletElement.style.left = `${bulletX}px`;
  bulletElement.style.top = `${bulletY}px`;
  
  GAME.gameContainer.appendChild(bulletElement);

  bullets.push({
    element: bulletElement,
    x: bulletX,
    y: bulletY,
    width: 5,
    height: 15
  });

}

function generateTarget() {
  if (isGameOver()) return;

  const targetElement = document.createElement('div');
  targetElement.className = 'target';

  // Create an image element instead of the SVG
  const pizzaImage = document.createElement('img');
  pizzaImage.src = './assets/img/pineapple-pizza.png';
  pizzaImage.alt = 'Pineapple Pizza';
  pizzaImage.style.width = '40px';
  pizzaImage.style.height = '40px';
  pizzaImage.style.objectFit = 'cover'; // To ensure the image fits inside the container

  targetElement.appendChild(pizzaImage);

  // Random position and speed
  const targetWidth = 40;
  const leftPadding = 30;
  const rightPadding = 0;
  const gameWidth = GAME.gameContainer.offsetWidth;
  const maxTargetX = gameWidth - targetWidth - rightPadding - leftPadding;
  
  const targetX = leftPadding + Math.random() * maxTargetX; // Ensure pizza stays within game area
  const targetY = -targetWidth; // Start above the screen
  const targetSpeed = 2 + Math.random() * 4; // Random speed for falling

  // Set position using template literals
  targetElement.style.left = `${targetX}px`;
  targetElement.style.top = `${targetY}px`;

  // Append the target to the game container
  GAME.gameContainer.appendChild(targetElement);

  targets.push({
    element: targetElement,
    x: targetX,
    y: targetY,
    width: 40, // Match the image size for collision detection
    height: 40, // Match the image size for collision detection
    speed: targetSpeed
  });
}

function checkCollision(bullet, target) {
  return bullet.x < target.x + target.width &&
         bullet.x + bullet.width > target.x &&
         bullet.y < target.y + target.height &&
         bullet.y + bullet.height > target.y;
}

function createHitEffect(x, y) {
  const hitEffect = document.createElement('div');
  hitEffect.className = 'hit-effect';
  hitEffect.style.left = `${x}px`;
  hitEffect.style.top = `${y}px`;
  
  GAME.gameContainer.appendChild(hitEffect);
  
  // Remove hit effect after animation
  setTimeout(() => {
    if (GAME.gameContainer.contains(hitEffect)) {
      GAME.gameContainer.removeChild(hitEffect);
    }
  }, 300);
}

function gameOver(isVictory) {
  endGame(isVictory, gameId, GAME, getGameOptions());
}

function getGameOptions() {
  return {
    clearIntervals: [gameInterval, targetGenerationInterval],
    removeEventListeners: [
      { event: 'keydown', handler: handleKeyDown },
      { event: 'keyup', handler: handleKeyUp }
    ]
  };
}

// Retry button functionality
GAME.retryButton.addEventListener('click', () => {
  // Reset game elements
  GAME.gameOverElement.style.display = 'none';
  
  resetGameElements();
  
  // Restart the game
  startGame();
});

// Reset specific game elements
function resetGameElements() {
  // Clear existing targets and bullets
  targets.forEach(target => {
    GAME.gameContainer.removeChild(target.element);
  });
  bullets.forEach(bullet => {
    GAME.gameContainer.removeChild(bullet.element);
  });
}