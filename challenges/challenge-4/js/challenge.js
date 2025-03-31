import { startIntro } from '/challenges/common/js/storyline.js';
import { setupEventListeners, triggerStartGame, initializeGameParameters, startTimer, endGame } from '/challenges/common/js/game-mechanics.js';
import { showPlayerNumberInput, isPlayerNumberValid } from '/challenges/common/js/player-input.js';
import * as GAME from '/challenges/common/js/game-variables.js';
import { getScore, setScore, isGameOver, getTimerInterval, setTimerInterval } from '/challenges/common/js/game-variables.js';

const gameId = "challenge-4";

const storyTitles = ["Storyline", "Challenge"];

// Specific storyline
const storylineText = [
  "UNDER CONSTRUCTION",
  "UNDER CONSTRUCTION"
];

// Specific game elements
const scoreDisplay = document.getElementById('score-display');
const coinSound = document.getElementById('coin-sound');

// Specific game sounds
//const laserSound = document.getElementById('laser-sound');

// Specific game mechanics variables
let startTime = 60;
let playerPosition = 270;
let platforms = [];
let coins = [];
let playerVelocityY = 0;
let isJumping = false;
let isOnGround = true;

const UI_HEIGHT = 150; // Height reserved for UI elements (score, hearts, timer)
const PLAYER_HEIGHT = 70; // Increased to match actual player SVG height
const PLATFORM_HEIGHT = 20;
const PLAYER_FEET_OFFSET = 40;
const TOTAL_COINS = 15;

// Specific game mechanics intervals
let gameInterval;

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
        <rect x="5" y="14" width="20" height="30" fill="#DC143C" />
        <circle cx="15" cy="22" r="7" fill="black" />
        <circle cx="15" cy="21" r="3" fill="white" />
        <rect x="0" y="43" width="30" height="8" fill="#DC143C" />
        <rect x="8" y="50" width="14" height="20" fill="#DC143C" />
      `;
    } else if (selectedShape === 'square') {
      playerSvg.innerHTML = `
        <rect x="5" y="14" width="20" height="30" fill="#DC143C" />
        <circle cx="15" cy="22" r="7" fill="black" />
        <rect x="11" y="18" width="8" height="8" fill="white" />
        <rect x="0" y="43" width="30" height="8" fill="#DC143C" />
        <rect x="8" y="50" width="14" height="20" fill="#DC143C" />
      `;
    } else if (selectedShape === 'triangle') {
      playerSvg.innerHTML = `
        <rect x="5" y="14" width="20" height="30" fill="#DC143C" />
        <circle cx="15" cy="22" r="7" fill="black" />
        <polygon points="15,16 10,26 20,26" fill="white" />
        <rect x="0" y="43" width="30" height="8" fill="#DC143C" />
        <rect x="8" y="50" width="14" height="20" fill="#DC143C" />
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

function initializeGameSpecificParameters() {
  // Start game loops
  gameInterval = setInterval(updateGame, 20);

  // Generate platforms first
  platforms = [];
  generateInitialPlatforms();

  // Position player
  const basePlatform = platforms[0];
  playerPosition = (GAME.gameContainer.offsetWidth / 2) - 15;
  
  // Ensure player is exactly on top of the base platform
  GAME.player.style.left = `${playerPosition}px`;
  GAME.player.style.top = `${basePlatform.y - PLAYER_FEET_OFFSET}px`;

  // Reset physics state
  playerVelocityY = 0;
  isOnGround = true;
  isJumping = false;

  // Generate coins after platforms
  coins = [];
  generateInitialCoins();

  // Update UI
  scoreDisplay.textContent = `Score: ${getScore()}`;

  // Setup keyboard controls
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
}

function generateInitialPlatforms() {
  const numberOfPlatforms = 10;
  const minDistanceBetweenPlatforms = 40;
  const availableHeight = GAME.gameContainer.offsetHeight - UI_HEIGHT - PLATFORM_HEIGHT;
  const platformHeightSpacing = availableHeight / numberOfPlatforms;
  
  // Always add base platform first - full width at bottom
  const basePlatform = {
      x: 0,
      y: GAME.gameContainer.offsetHeight - PLATFORM_HEIGHT,
      width: GAME.gameContainer.offsetWidth,
      height: PLATFORM_HEIGHT
  };
  createPlatformElement(basePlatform);
  platforms.push(basePlatform);

  // Generate platforms in sections to ensure better distribution
  for (let i = 1; i < numberOfPlatforms; i++) {
      let platformWidth = Math.random() * 200 + 100;
      let platformX = Math.random() * (GAME.gameContainer.offsetWidth - platformWidth);
      let platformY = UI_HEIGHT + (i * platformHeightSpacing);
      
      let validPosition = false;
      let attempts = 0;
      
      while (!validPosition && attempts < 10) {
          validPosition = true;
          
          for (const existingPlatform of platforms) {
              const verticalDistance = Math.abs(platformY - existingPlatform.y);
              const horizontalOverlap = !(platformX + platformWidth < existingPlatform.x || 
                                      platformX > existingPlatform.x + existingPlatform.width);
              
              if (verticalDistance < minDistanceBetweenPlatforms && horizontalOverlap) {
                  validPosition = false;
                  platformX = Math.random() * (GAME.gameContainer.offsetWidth - platformWidth);
                  platformY += minDistanceBetweenPlatforms/2;
                  attempts++;
                  break;
              }
          }
      }

      // Ensure platform is not too close to the UI elements
      platformY = Math.max(platformY, UI_HEIGHT + minDistanceBetweenPlatforms);

      const platform = {
          x: platformX,
          y: platformY,
          width: platformWidth,
          height: PLATFORM_HEIGHT
      };

      createPlatformElement(platform);
      platforms.push(platform);
  }
}

function createPlatformElement(platform) {
  const platformElement = document.createElement('div');
  platformElement.className = 'platform';
  platformElement.style.position = 'absolute';
  platformElement.style.left = `${platform.x}px`;
  platformElement.style.top = `${platform.y}px`;
  platformElement.style.width = `${platform.width}px`;
  platformElement.style.height = `${platform.height}px`;
  platformElement.style.backgroundColor = '#EB257A';
  platformElement.style.borderRadius = '5px';
  
  GAME.gameContainer.appendChild(platformElement);
  platform.element = platformElement;
}

function generateInitialCoins() { 
  const COIN_SIZE = 30;
  const MIN_PLATFORM_DISTANCE = 20;
  const MIN_COIN_DISTANCE = 40;
  const MAX_ATTEMPTS = 100;
  let attempts = 0;
  let totalCoinsPlaced = 0;

  // Create array of available platforms (skip base platform)
  const availablePlatforms = platforms.slice(1);

  while (totalCoinsPlaced < TOTAL_COINS && attempts < MAX_ATTEMPTS) {
    console.log(`Placing coin (${totalCoinsPlaced}/(${TOTAL_COINS}): `);

    // Select random platform
    const platformIndex = Math.floor(Math.random() * availablePlatforms.length);
    const platform = availablePlatforms[platformIndex];

    const coinElement = document.createElement('div');
    coinElement.className = 'coin';
    const coinImage = document.createElement('img');
    coinImage.src = './assets/img/coin.png';
    coinImage.alt = 'Coin';
    coinImage.style.width = '30px';
    coinImage.style.height = '30px';
    
    coinElement.appendChild(coinImage);

    // Generate random position within wider area above platform
    const minX = Math.max(0, platform.x - platform.width/2);
    const maxX = Math.min(GAME.gameContainer.offsetWidth - COIN_SIZE, platform.x + platform.width * 1.5);
    const coinX = minX + (Math.random() * (maxX - minX));
    const coinY = platform.y - (60 + Math.random() * 100); // 60-160px above platform

    let validPosition = true;

    // Check collision with platforms
    for (const otherPlatform of platforms) {
      const tooCloseX = coinX + COIN_SIZE > otherPlatform.x - MIN_PLATFORM_DISTANCE && 
                       coinX < otherPlatform.x + otherPlatform.width + MIN_PLATFORM_DISTANCE;
      const tooCloseY = coinY + COIN_SIZE > otherPlatform.y - MIN_PLATFORM_DISTANCE && 
                       coinY < otherPlatform.y + otherPlatform.height + MIN_PLATFORM_DISTANCE;

      if (tooCloseX && tooCloseY) {
        validPosition = false;
        break;
      }
    }

    console.log(`Coin collision with platforms (${attempts}): ` + !validPosition);

    // Check collision with existing coins
    if (!validPosition) {
      for (const existingCoin of coins) {
        const distanceX = Math.abs(coinX - existingCoin.x);
        const distanceY = Math.abs(coinY - existingCoin.y);
        if (distanceX < MIN_COIN_DISTANCE && distanceY < MIN_COIN_DISTANCE) {
          validPosition = false;
          break;
        }
      }
    }

    console.log(`Coin collision with other coins (${attempts}): ` + !validPosition);

    // Ensure coin is not in UI area
    if (!validPosition) {
      if (coinY < UI_HEIGHT + MIN_PLATFORM_DISTANCE) {
        validPosition = false;
      }
    }

    console.log(`Coin collision top container (${attempts}): ` + !validPosition);

    if (validPosition) {
      coinElement.style.position = 'absolute';
      coinElement.style.left = `${coinX}px`;
      coinElement.style.top = `${coinY}px`;

      GAME.gameContainer.appendChild(coinElement);

      coins.push({
        element: coinElement,
        x: coinX,
        y: coinY,
        width: COIN_SIZE,
        height: COIN_SIZE
      });

      totalCoinsPlaced++;
      attempts = 0;
      console.log(`Placed coin (${totalCoinsPlaced}/${TOTAL_COINS})`);
    } else {
      attempts++;
      console.log(`Not placed coin (${totalCoinsPlaced}/${TOTAL_COINS})`);
    }
  }
}

function handleKeyDown(e) {
  if (e.key === 'ArrowLeft') keys.left = true;
  if (e.key === 'ArrowRight') keys.right = true;
  if (e.key === ' ' && !isJumping && isOnGround) {
    keys.space = true;
    jump();
  }
}

function handleKeyUp(e) {
  if (e.key === 'ArrowLeft') keys.left = false;
  if (e.key === 'ArrowRight') keys.right = false;
}

function jump() {
  isJumping = true;
  isOnGround = false;
  playerVelocityY = -15; // Set jump strength
}

function updateGame() {
  if (isGameOver()) return;

  // Move player
  const moveSpeed = 5;
  if (keys.left && playerPosition > 40) {
      playerPosition -= moveSpeed;
  }
  if (keys.right && playerPosition < GAME.gameContainer.offsetWidth - 15) {
      playerPosition += moveSpeed;
  }

  GAME.player.style.left = `${playerPosition}px`;

    // Only apply gravity if not on ground
    if (!isOnGround) {
      playerVelocityY += 0.8;
      const newPosition = GAME.player.offsetTop + playerVelocityY;
      
      // Check if player is below the game container
      if (newPosition + PLAYER_HEIGHT > GAME.gameContainer.offsetHeight) {
          // Force player to base platform
          const basePlatform = platforms[0];
          GAME.player.style.top = `${basePlatform.y - PLAYER_HEIGHT}px`;
          playerVelocityY = 0;
          isOnGround = true;
          isJumping = false;
          return;
      }
      
      GAME.player.style.top = `${newPosition}px`;
  }

  // Reset ground state for new frame
  isOnGround = false;

  // Platform collision logic
  for (const platform of platforms) {
    const playerFeetPosition = GAME.player.offsetTop + PLAYER_FEET_OFFSET;
    
    // Check if player is within platform's horizontal bounds
    const isWithinPlatformX = playerPosition + 15 > platform.x && 
                             playerPosition < platform.x + platform.width;
    
    // Check if player's feet are at the right height to land on platform
    const isAtPlatformHeight = playerFeetPosition >= platform.y - 5 && 
                              playerFeetPosition <= platform.y + 5 &&
                              playerVelocityY >= 0; // Only land when moving downward
    
    if (isWithinPlatformX && isAtPlatformHeight) {
        playerVelocityY = 0;
        isOnGround = true;
        isJumping = false;
        // Position player so their feet are exactly on the platform
        GAME.player.style.top = `${platform.y - PLAYER_FEET_OFFSET}px`;
        break;
    }
  }

  // Platform collision logic
  for (const platform of platforms) {
      if (GAME.player.offsetTop + 30 >= platform.y - 5 && // Added small threshold
          GAME.player.offsetTop + 30 <= platform.y + 5 && // Added small threshold
          playerPosition + 15 > platform.x && 
          playerPosition < platform.x + platform.width) {
          
          playerVelocityY = 0;
          isOnGround = true;
          isJumping = false;
          GAME.player.style.top = `${platform.y - 30}px`;
          break; // Exit loop once we find a platform to stand on
      }
  }

  // Update coin collection
  for (let i = coins.length - 1; i >= 0; i--) {
    const coin = coins[i];
    if (checkCollisionWithCoin(coin)) {
      collectCoin(coin);
      coins.splice(i, 1); // Remove coin from game
    }
  }
}

function checkCollisionWithCoin(coin) {
  return playerPosition + 15 > coin.x && playerPosition < coin.x + coin.width &&
         GAME.player.offsetTop + 30 >= coin.y && GAME.player.offsetTop + 30 <= coin.y + coin.height;
}

function collectCoin(coin) {
  if (coinSound) coinSound.play();
  setScore(getScore() + 10);
  scoreDisplay.textContent = `Score: ${getScore()}`;
}

function gameOver(isVictory) {
  endGame(isVictory, gameId, GAME, getGameOptions());
}

function getGameOptions() {
  return {
    clearIntervals: [gameInterval],
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
  // Clear existing platforms and coins
  coins.forEach(coin => {
    if (coin.element && coin.element.parentNode) {
      GAME.gameContainer.removeChild(coin.element);
    }
  });
  platforms.forEach(platform => {
    if (platform.element && platform.element.parentNode) {
      GAME.gameContainer.removeChild(platform.element);
    }
  });
  coins = [];
  platforms = [];
}