import { startIntro } from '/challenges/common/js/storyline.js';
import { setupEventListeners, triggerStartGame, initializeGameParameters, startTimer, endGame } from '/challenges/common/js/game-mechanics.js';
import { showPlayerNumberInput, isPlayerNumberValid } from '/challenges/common/js/player-input.js';
import * as GAME from '/challenges/common/js/game-variables.js';
import { getScore, setScore, isGameOver, setGameOver, getTimerInterval, setTimerInterval } from '/challenges/common/js/game-variables.js';

const gameId = "challenge-4";

const storyTitles = ["Storyline", "Challenge"];

// Specific storyline
const storylineText = [
  "You thought it was over. You solved the enigma, unlocked the vault, and when faced with two pills, the blue one looked... safely boring. So naturally, you took the red....because...so many questions to answer, right? But instead of answers, chaos erupted! The system glitched, pixels warped, and now you're stuck inside a mash-up retro game...",
  "To escape the Handover Game in your new reality skin, you must collect ALL shiny stuff while dodging pixelated ghosts and platform-hopping like a fast plumber. You don't have much time and the only way out... is through. Scoring like a madman only will not get you to safety. Let’s see if you’re really The One to uncover the truth behind it all."
];

// Specific game elements
const scoreDisplay = document.getElementById('score-display');
const rocket = document.getElementById('rocket');

// Specific game sounds
const jumpSound = document.getElementById('jump-sound');
const coinSound = document.getElementById('coin-collect-sound');
const rocketUnblockedSound = document.getElementById('rocket-unblocked-sound');
const rocketLaunchSound = document.getElementById('rocket-launch-sound');

// Specific game mechanics variables
let startTime = 30;
const INITIAL_PLAYER_STATE = {
  x: 50,
  y: 300,
  width: 16,
  height: 30,
  velocityY: 0,
  isJumping: false
};

let player = { ...INITIAL_PLAYER_STATE };
let platforms = [];
let enemies = [];
let coins = [];
let maxCoins = 10;
let playerSpeed = 4;
let gravity = 0.5;
let jumpForce = 14;
let enemySpeed = 2;
let platformCount = 10;
let coinValue = 50;

const enemyTypes = ['enemy-red', 'enemy-pink', 'enemy-yellow', 'enemy-burgundy'];
let randomType = '';

let isRocketDisplayed = false;
let isRocketLaunched = false;

// Specific game mechanics intervals
let gameInterval;
let keysInterval;
let animationFrame;

// Specific game key controls
const keys = {};

window.onload = showPlayerNumberInput(startIntro, storylineText,storyTitles);

// Call the setup function
setupEventListeners({
  playerNumberSelect: GAME.playerNumberSelect,
  beginChallengeButton: GAME.beginChallengeButton,
  isPlayerNumberValid,
  startIntro,
  storylineText,
  storyTitles,
  homeButton: GAME.homeButton,
});

// Specific game player selector
function handleShapeSelection() {
  const playerSvg = GAME.player.querySelector('svg');

  playerSvg.innerHTML = `
    <rect x="0" y="8" width="16" height="22" rx="3" fill="#FFE733"/>
    <rect x="0" y="15" width="16" height="15" rx="2" fill="#4575D4"/>
    <rect x="2" y="8" width="3" height="12" fill="#4575D4"/>
    <rect x="11" y="8" width="3" height="12" fill="#4575D4"/>
    <circle cx="8" cy="8" r="7" fill="#FFE733"/>
    <rect x="2" y="7" width="12" height="2" fill="#333333"/>
    <rect x="3" y="5" width="10" height="4" rx="2" fill="#C0C0C0"/>
    <circle cx="8" cy="7.5" r="2.5" fill="#FFFFFF"/>
    <circle cx="8" cy="7.5" r="1.2" fill="#333333"/>
    `;

  // Hide player selector and show game
  instructionsPopup.style.display = 'none';
  GAME.gameContainer.style.display = 'block';

  // Start the game
  startGame();
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
  gameInterval = setInterval(updateGameState, 20);

  // Start animation loop
  animationFrame = requestAnimationFrame(renderGame);

  // Update UI
  scoreDisplay.textContent = `Score: ${getScore()}`;

  // Reset game state
  resetGameState();

  // Create platforms
  createPlatforms();
      
  // Create initial enemies and coins
  createEnemies();
  createCoins();

  // Set up keyboard listeners
  setupControls();

  // Setup keyboard controls
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
}

function resetGameState() {
  player = { ...INITIAL_PLAYER_STATE };
  platforms = [];
  enemies = [];
  coins = [];
  startTime = 30;
  rocket.classList.add('hidden');
}

function createPlatforms() {
  // Create floor
  platforms.push({
    x: 0,
    y: 380,
    width: 600,
    height: 20
  });
  
  // Create evenly distributed platforms with more space between them and padding from edges
  const sectionWidth = 500 / (platformCount - 1);
  for (let i = 0; i < platformCount; i++) {
    platforms.push({
      x: Math.max(20, Math.min(550, 30 + (i * sectionWidth) + (Math.random() * 30 - 15))),
      y: 100 + (i % 3) * 80 + Math.random() * 30,
      width: Math.min(70 + Math.random() * 60, 550 - Math.max(20, 30 + (i * sectionWidth))),
      height: 20
    });
  }
}

function createEnemies() {
  enemies = []; // Clear existing enemies

  // Always create an enemy on the ground platform (index 0)
  randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

  const groundPlatform = platforms[0];
  enemies.push({
    x: groundPlatform.x + 200, // Place it somewhere in the middle of the ground
    y: groundPlatform.y - 20,  // 30px above the ground
    width: 20,
    height: 20,
    direction: Math.random() > 0.5 ? 1 : -1,
    platform: 0,
    type: randomType
  });
  
  // Create enemies on other platforms as before
  for (let i = 1; i < platforms.length; i++) {
    const platform = platforms[i];
    
    // Skip platforms that are too small for enemies (less than 80px wide)
    if (platform.width < 80) {
      continue;
    }
    
    // Calculate a safe position for the enemy on the platform
    const minX = platform.x + 15;
    const maxX = platform.x + platform.width - 45;
    const enemyX = Math.max(minX, Math.min(maxX, platform.x + platform.width / 2 - 15));
    
    randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

    enemies.push({
      x: enemyX,
      y: platform.y - 20,
      width: 20,
      height: 20,
      direction: Math.random() > 0.5 ? 1 : -1,
      platform: i,
      type: randomType
    });
  }
}

function createCoins() {
  for (let i = 0; i < maxCoins; i++) {
    // Create a coin position
    let coinX = 50 + Math.random() * 500;
    let coinY = 50 + Math.random() * 280;
    let validPosition = false;
    
    // Check if coin overlaps with any platform
    while (!validPosition) {
      validPosition = true;
      
      for (const platform of platforms) {
        // Check if coin overlaps with platform
        if (coinX < platform.x + platform.width &&
            coinX + 20 > platform.x &&
            coinY < platform.y + platform.height &&
            coinY + 20 > platform.y) {
          // Coin overlaps, try a new position
          coinX = 30 + Math.random() * 540;
          coinY = 30 + Math.random() * 320;
          validPosition = false;
          break;
        }
      }
    }
    
    coins.push({
      x: coinX,
      y: coinY,
      width: 20,
      height: 20,
      collected: false
    });
  }
}

function setupControls() {
  // Setup keyboard controls
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  
  // Game update function to check key states
  function checkKeys() {
    if (keys['ArrowLeft'] && player.x > 0) {
      player.x -= playerSpeed;
    }
    if (keys['ArrowRight'] && player.x < GAME.gameContainer.offsetWidth - player.width) {
      player.x += playerSpeed;
    }
  }
  
  // Add to game loop
  keysInterval = setInterval(checkKeys, 20);
}

function handleKeyDown(e) {
  keys[e.key] = true;
    
  // Jump when Space or Up arrow is pressed
  if ((e.key === ' ' || e.key === 'ArrowUp') && !player.isJumping) {
    player.velocityY = -jumpForce;
    player.isJumping = true;
    
    // Play jump sound
    jumpSound.currentTime = 0;
    jumpSound.play();
  }
}

function handleKeyUp(e) {
  keys[e.key] = false;
    
  // Allow variable jump height by reducing upward velocity when jump key is released
  if ((e.key === ' ' || e.key === 'ArrowUp') && player.velocityY < -3) {
    player.velocityY = -3;
  }
}

function updateGameState() {
  if (isGameOver()) return;

  // Apply gravity to player with improved jumping physics
  player.velocityY += gravity;
  player.y += player.velocityY;

  checkPlatformCollision();
  checkPlayerFitsPlatform();

  // Ensure player falls onto platform edges
  if (player.isJumping) {
    for (const platform of platforms) {
      if (player.y + player.height > platform.y &&
          player.y + player.height < platform.y + platform.height + 10 &&
          ((player.x + player.width > platform.x && player.x + player.width < platform.x + 10) || 
           (player.x < platform.x + platform.width && player.x > platform.x + platform.width - 10))) {
        player.isJumping = false;
        player.velocityY = 0;
        player.y = platform.y - player.height;
      }
    }
  }

  // Keep player within screen boundaries
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > GAME.gameContainer.offsetWidth) player.x = GAME.gameContainer.offsetWidth - player.width;

  checkPlayerFallOfTheBottom();

  // Update enemies
  for (const enemy of enemies) {
    const platform = platforms[enemy.platform];
    enemy.x += enemy.direction * enemySpeed;
    
    // Keep enemy on platform
    if (enemy.x < platform.x) {
      enemy.x = platform.x;
      enemy.direction *= -1;
    } else if (enemy.x + enemy.width > platform.x + platform.width) {
      enemy.x = platform.x + platform.width - enemy.width;
      enemy.direction *= -1;
    }
    
    // Check for collision with player
    if (checkCollision(player, enemy)) {
      triggerEnemyEatAnimation(enemy);
      setGameOver(true);
      gameOver(false);
      player.x = 50;
      player.y = 300;
      player.velocityY = 0;
    }
  }
  
  checkCoinCollected();
  checkAllCoinsCollected();
  checkRocketCollision();
}

function checkPlatformCollision() {
  // Check for platform collisions
  player.isJumping = true;
  for (const platform of platforms) {
    // Bottom collision - player lands on platform
    if (player.y + player.height > platform.y &&
        player.y + player.height < platform.y + platform.height + 10 &&
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width) {
      if (player.velocityY > 0) {
        player.isJumping = false;
        player.velocityY = 0;
        player.y = platform.y - player.height;
     }
    }
  
    // Top collision - player hits platform from below
    if (player.y < platform.y + platform.height &&
        player.y > platform.y &&
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width) {
      if (player.velocityY < 0) {
        player.velocityY = 0;
        player.y = platform.y + platform.height;
      }
    }
  }
}

function checkPlayerFitsPlatform() {
  // Ensure player fits between platforms when jumping
  for (let i = 0; i < platforms.length - 1; i++) {
    const currentPlatform = platforms[i];
    const nextPlatform = platforms[i + 1];
  
    const gapStart = currentPlatform.x + currentPlatform.width;
    const gapEnd = nextPlatform.x;
    const gapHeight = currentPlatform.y - (nextPlatform.y + nextPlatform.height);
  
    if (player.y + player.height < currentPlatform.y &&
      player.y > nextPlatform.y + nextPlatform.height &&
      player.x + player.width > gapStart &&
      player.x < gapEnd &&
      (gapEnd - gapStart) > player.width && // Gap must be strictly greater than player's width
      gapHeight >= player.height) {
      // Allow player to fit between platforms
      player.isJumping = false;
    }
  }
}

function checkPlayerFallOfTheBottom() {
  // Check for falling off the bottom
  if (player.y > GAME.gameContainer.offsetHeight) {
    player.x = 50;
    player.y = 300;
    player.velocityY = 0;
  }
}

function checkCoinCollected() {
  // Check for coin collection
  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];
    if (!coin.collected && checkCollision(player, coin)) {
      coin.collected = true;
      setScore(getScore() + coinValue);
      scoreDisplay.textContent = `Score: ${getScore()}`;
        
      // Play more appealing coin sound
      coinSound.currentTime = 0;
      coinSound.play();
    }
  }
}

function renderGame() {
  if (isGameOver()) return;

  // Clear canvas or update DOM elements
  GAME.player.style.left = `${player.x}px`;
  GAME.player.style.top = `${player.y}px`;
  GAME.player.style.width = `${player.width}px`; // Ensure SVG matches player's width
  GAME.player.style.height = `${player.height}px`; // Ensure SVG matches player's height
  
  // Render platforms
  renderPlatforms();
  
  // Render enemies
  renderEnemies();
  
  // Render coins
  renderCoins();
  
  // Continue animation loop
  animationFrame = requestAnimationFrame(renderGame);
}

function renderPlatforms() {
  // Remove existing platforms
  const existingPlatforms = document.querySelectorAll('.platform');
  existingPlatforms.forEach(p => p.remove());
  
  // Create platform elements
  platforms.forEach(platform => {
    const platformElement = document.createElement('div');
    platformElement.className = 'platform';
    platformElement.style.left = `${platform.x}px`;
    platformElement.style.top = `${platform.y}px`;
    platformElement.style.width = `${platform.width}px`;
    platformElement.style.height = `${platform.height}px`;
    GAME.gameContainer.appendChild(platformElement);
  });
}

function renderEnemies() {
  // Remove existing enemies
  const existingEnemies = document.querySelectorAll('.enemy');
  existingEnemies.forEach(e => e.remove());
  
  // Create enemy elements with funny ghost appearance
  enemies.forEach(enemy => {
    const enemyElement = document.createElement('div');
    enemyElement.className = 'enemy';
    enemyElement.style.left = `${enemy.x}px`;
    enemyElement.style.top = `${enemy.y}px`;
    enemyElement.style.width = `${enemy.width}px`;
    enemyElement.style.height = `${enemy.height}px`;
    // Add direction-based styling
    enemyElement.style.transform = enemy.direction > 0 ? 'scaleX(1)' : 'scaleX(-1)';
    
    // Add SVG ghost inside the enemy div (old enemy)
    /*enemyElement.innerHTML = `
      <svg viewBox="0 0 30 30" width="30" height="30">
        <path d="M5,15 Q5,5 15,5 Q25,5 25,15 L25,25 L20,20 L15,25 L10,20 L5,25 Z" fill="#6c95eb" />
        <circle cx="10" cy="12" r="2" fill="white" />
        <circle cx="20" cy="12" r="2" fill="white" />
        <circle cx="10" cy="12" r="1" fill="black" />
        <circle cx="20" cy="12" r="1" fill="black" />
        <path d="M10,18 Q15,20 20,18" fill="none" stroke="black" stroke-width="1" />
      </svg>
    `;*/

    renderEnemyImage(enemyElement, enemy);
    GAME.gameContainer.appendChild(enemyElement);
  });
}

function renderEnemyImage(enemyElement, enemy) {
    // Pick image based on type
    let enemyImage = '';

    switch (enemy.type) {
      case 'enemy-red':
        enemyImage = './assets/img/enemy-1.gif';
        break;
      case 'enemy-pink':
        enemyImage = './assets/img/enemy-2.gif';
        break;
      case 'enemy-yellow':
        enemyImage = './assets/img/enemy-3.gif';
        break;
      case 'enemy-burgundy':
        enemyImage = './assets/img/enemy-4.gif';
        break;
      default:
        enemyImage = './assets/img/enemy-1.gif';
    }
  
    // Using background image approach
    enemyElement.style.backgroundImage = `url(${enemyImage})`;
    enemyElement.style.backgroundSize = 'cover';
    enemyElement.style.backgroundRepeat = 'no-repeat';
    enemyElement.style.imageRendering = 'pixelated';
    enemyElement.style.width = `${enemy.width}px`;
    enemyElement.style.height = `${enemy.height}px`;
}

function renderCoins() {
  // Remove existing coins
  const existingCoins = document.querySelectorAll('.coin');
  existingCoins.forEach(c => c.remove());
  
  // Create coin elements with an image
  coins.forEach(coin => {
    if (!coin.collected) {
      const coinElement = document.createElement('div');
      coinElement.className = 'coin';
      coinElement.style.left = `${coin.x}px`;
      coinElement.style.top = `${coin.y}px`;
      coinElement.style.width = `${coin.width}px`;
      coinElement.style.height = `${coin.height}px`;
      coinElement.style.backgroundImage = 'url(./assets/img/coin.png)';
      coinElement.style.backgroundSize = 'cover';
      GAME.gameContainer.appendChild(coinElement);
    }
  });
}

function checkCollision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function triggerEnemyEatAnimation(enemy) {
  const enemyElement = document.querySelector(`.enemy[style*="left: ${enemy.x}px"]`);

  if (enemyElement) {
    enemyElement.classList.add('eat-animation');
    setTimeout(() => {
      enemyElement.classList.remove('eat-animation');
    }, 600); // Match the animation duration
  }

  if (GAME.player) {
    GAME.player.classList.add('player-hit');
    setTimeout(() => {
      GAME.player.classList.remove('player-hit');
      // Reset player visibility after "respawn"
      GAME.player.style.opacity = '1';
      GAME.player.style.transform = 'scale(1)';
    }, 500); // Match the fade animation
  }
}

function checkAllCoinsCollected() {
  const remainingCoins = document.querySelectorAll('.coin:not(.collected)');

  if (remainingCoins.length === 0) {
    // Show rocket
    if (!isRocketDisplayed) {
      rocketUnblockedSound.currentTime = 0;
      rocketUnblockedSound.play();
    }
    rocket.classList.remove('hidden');
    isRocketDisplayed = true;
  }
}

function checkRocketCollision() {
  if (rocket.classList.contains('hidden')) return;
  
  // Ensure playerElement exists before trying to access getBoundingClientRect()
  if (!GAME.player) return;

  const rocketRect = rocket.getBoundingClientRect();
  const playerRect = GAME.player.getBoundingClientRect();

  // Check for collision between the player and rocket
  if (
    playerRect.left < rocketRect.right &&
    playerRect.right > rocketRect.left &&
    playerRect.top < rocketRect.bottom &&
    playerRect.bottom > rocketRect.top
  ) {
    enemySpeed = 0;  // This will stop all enemies from moving
    launchRocket();
  }
}

function launchRocket() {
  if (isRocketLaunched) return;

  isRocketLaunched = true;

  if (!GAME.player || !rocket) return;

  // Stop the background music immediately
  if (GAME.gameStartSound) {
    GAME.gameStartSound.pause();
    GAME.gameStartSound.currentTime = 0; // Reset to the beginning
  }

  setTimeout(() => {
    // Play the rocket launch sound after the delay
    rocketLaunchSound.currentTime = 0; // Reset sound
    rocketLaunchSound.play(); // Play the rocket sound
  }, 1000);
  
  setTimeout(() => {
    // Launch the rocket upwards with player
    GAME.player.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
    GAME.player.style.transform = 'translateY(-500px) rotate(-45deg) scale(1.2)';
    GAME.player.style.opacity = '0'; // Fade out player

    rocket.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
    rocket.style.transform = 'translateY(-500px) rotate(-45deg) scale(1.2)';
    rocket.style.opacity = '0'; // Fade out rocket

    // After the transition, remove both from the screen
    setTimeout(() => {
      GAME.player.style.display = 'none';
      rocket.style.display = 'none';

      //console.log("Rocket and player are off-screen");
    }, 2000); // Matches the transition duration
  }, 1000);

  setScore(getScore() + 100);
  scoreDisplay.textContent = `Score: ${getScore()}`;

  gameOver(true);
}

function gameOver(isVictory) {
  endGame(isVictory, gameId, GAME, getGameOptions());
}

function getGameOptions() {
  return {
    clearIntervals: [gameInterval, keysInterval],
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
 
  // Restart the game
  startGame();
});