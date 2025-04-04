import { startIntro } from '/challenges/common/js/storyline.js';
import { setupEventListeners, triggerStartGame, initializeGameParameters, startTimer, endGame } from '/challenges/common/js/game-mechanics.js';
import { showPlayerNumberInput, isPlayerNumberValid } from '/challenges/common/js/player-input.js';
import * as GAME from '/challenges/common/js/game-variables.js';
import { getScore, setScore, isGameOver, setGameOver, getTimerInterval, setTimerInterval } from '/challenges/common/js/game-variables.js';

const gameId = "challenge-2";

const storyTitles = ["Storyline", "Challenge"];

// Specific storyline
const storylineText = [
  "The handover was going fine for Player 136...until VIC went rogue, rejecting every processing without reason, RabbitMQ clogged, messages stuck in a purgatory of retries, and the Pipeline Guardian activated its failsafe: the Compliance Sentinel! Armed with precision lasers, it is ready to decommision any player out of sync!",
  "Advance through the pipeline when processing is allowed to distribute the hotfix correctly and end this madness. Stop when a validation check is in progress. Any unauthorized movement will trigger an immediate rollback...and termination. Reach the end before the time runs out, or be stuck in the handover phase forever! Will you do it in 45 seconds?!"
];

// Specific game elements
const doll = document.getElementById('doll');
const lightStatus = document.getElementById('light-status');
const finishLine = document.getElementById('finish-line');

// Specific game sounds
//const dollSound = document.getElementById('doll-song');
const redLightSound = document.getElementById('red-light-sound');
const greenLightSound = document.getElementById('green-light-sound');
const gunshotSound = document.getElementById('gunshot-sound');
const eliminationSound = document.getElementById('elimination-sound');

// Specific game mechanics variables
let startTime = 45;
let playerPosition = 30;
let walkSpeed = 0.5; // Slower walking speed
let isRedLight = false;
let isPlayerMoving = false;
let isPlayerWalking = false;
let playerAnimationFrame;
let lightChangeInterval;

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

function handleShapeSelection() {
  if (selectedShape) {
    const playerSvg = GAME.player.querySelector('svg');

    if (selectedShape === 'circle') {
      playerSvg.innerHTML = `
        <rect x="5" y="5" width="20" height="30" fill="green" />
			  <circle cx="15" cy="13" r="7" fill="black" />
			  <circle cx="15" cy="13" r="3" fill="white" />
        <rect x="0" y="30" width="80" height="8" fill="green" />
        <rect x="8" y="35" width="14" height="20" fill="green" />
      `;
    } else if (selectedShape === 'square') {
      playerSvg.innerHTML = `
        <rect x="5" y="5" width="20" height="30" fill="green" />
			  <circle cx="15" cy="13" r="7" fill="black" />
			  <rect x="11" y="9" width="8" height="8" fill="white" />
        <rect x="0" y="30" width="80" height="8" fill="green" />
        <rect x="8" y="35" width="14" height="20" fill="green" />
      `;
    } else if (selectedShape === 'triangle') {
      playerSvg.innerHTML = `
			  <rect x="5" y="5" width="20" height="30" fill="green" />
			  <circle cx="15" cy="13" r="7" fill="black" />
			  <polygon points="15,8 10,16 20,16" fill="white" />
			  <rect x="0" y="30" width="80" height="8" fill="green" />
        <rect x="8" y="35" width="14" height="20" fill="green" />
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
  playerPosition = 30;
  startTime = 45;
  isRedLight = false;
  isPlayerWalking = false;

  // Position player
  GAME.player.classList.remove('walking');
  GAME.player.style.left = `${playerPosition}px`;

  // Update UI
  GAME.timerDisplay.textContent = `Time: ${startTime}`;
  lightStatus.textContent = "GREEN LIGHT";
  lightStatus.style.color = "#22ff22";

  // Start light changes
  startLightChanges();
  
  // Rotate doll to face away initially
  rotateDoll(false);

  // Setup keyboard controls
  document.addEventListener('keydown', handleKeyDown);
}

function startLightChanges() {
  // Initial green light for a few seconds
  setTimeout(() => {
    if (!isGameOver()) {
      changeLight();
      
      // Start random light changes
      lightChangeInterval = setInterval(() => {
        if (!isGameOver()) {
          changeLight();
        }
      }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds
    }
  }, 3000);
}

function changeLight() {
  isRedLight = !isRedLight;
  
  if (isRedLight) {
    // Change to red light
    lightStatus.textContent = "RED LIGHT";
    lightStatus.style.color = "#ff2222";
    greenLightSound.currentTime = 0; 
    greenLightSound.play();
    
    // Rotate doll to face player
    rotateDoll(true);
    
    // Check if player is moving during red light
    setTimeout(() => {
      if (isPlayerMoving && isRedLight && !isGameOver()) {
        eliminatePlayer();
      }
    }, 300); // Small delay to give player time to react
  } else {
    // Change to green light
    lightStatus.textContent = "GREEN LIGHT";
    lightStatus.style.color = "#22ff22";
    redLightSound.currentTime = 0; 
    redLightSound.play();
    
    // Rotate doll to face away
    rotateDoll(false);
  }
}

function rotateDoll(facingPlayer) {
  const dollSvg = doll.querySelector('svg');
  const gitlabIcon = document.getElementById('gitlab-icon');
  const dollFace = document.getElementById('doll-face');

  if (!dollSvg) return;

  if (facingPlayer) {
    // Doll facing player (frontside)
    dollSvg.style.transform = 'rotateY(0deg)';
    gitlabIcon.style.display = 'block';
    dollFace.style.fill = '#FFD700';
  } else {
    // Doll facing away (backside)
    dollSvg.style.transform = 'rotateY(180deg)';
    gitlabIcon.style.display = 'none';
    dollFace.style.fill = 'transparent';
  }
}

function handleKeyDown(e) {
  if (e.code === 'Space') {
    e.preventDefault(); // Prevent page scrolling
    toggleWalking();
  }
}

function toggleWalking() {
  if (isGameOver()) return;
  
  isPlayerWalking = !isPlayerWalking;
  
  if (isPlayerWalking) {
    GAME.player.classList.add('walking');
    startWalking();
  } else {
    GAME.player.classList.remove('walking');
    isPlayerMoving = false;
    cancelAnimationFrame(playerAnimationFrame);
  }
}

function startWalking() {
  isPlayerMoving = true;
  walkPlayer();
}

function walkPlayer() {
  if (isGameOver() || !isPlayerWalking) return;
  playerPosition += walkSpeed;
  GAME.player.style.left = `${playerPosition}px`;
      
  // Check if player is moving during red light
  if (isRedLight) {
    eliminatePlayer();
    gameOver(false);
    return;
  }
  
  // Check if player reached finish line
  const finishLinePosition = GAME.gameContainer.offsetWidth - finishLine.offsetWidth - 50;
  if (playerPosition >= finishLinePosition) {
    // Extract the time from the timer display
    const timeLeftText = GAME.timerDisplay.textContent;
    const timeLeft = parseInt(timeLeftText.replace("Time: ", ""), 10);

    // Calculate the score based on the remaining time
    setScore(getScore() + calculateScore(timeLeft));
    gameOver(true);
    return;
  }
  
  // Continue walking
  playerAnimationFrame = requestAnimationFrame(walkPlayer);
}

function eliminatePlayer() {
  if (isGameOver()) return; // Prevent multiple elimination
  
  setGameOver(true);
  
  // Stop player movement
  isPlayerWalking = false;
  GAME.player.classList.remove('walking');
  isPlayerMoving = false;
  cancelAnimationFrame(playerAnimationFrame);
  
  // Show laser beam from doll to player
  fireLaserBeam();
  
  // Show blood effect
  createBloodEffect();
  
  // Play elimination sound
  //dollSound.pause();
  gunshotSound.play();
  setTimeout(() => {
    eliminationSound.play();
  }, 300);
  
  // Show game over screen after a short delay
  setTimeout(() => {
    GAME.gameOverElement.style.display = 'flex';
  }, 1000);
}

function fireLaserBeam() {
  const laserBeam = document.getElementById('laser-beam');
  const laserLine = document.getElementById('laser-line');
  
  // Get doll and player positions
  const dollRect = doll.getBoundingClientRect();
  const playerRect = GAME.player.getBoundingClientRect();
  const gameContainerRect = GAME.gameContainer.getBoundingClientRect();
  
  // Calculate positions relative to game container
  const dollX = dollRect.left - gameContainerRect.left + dollRect.width / 2;
  const dollY = dollRect.top - gameContainerRect.top + dollRect.height / 3;
  const playerX = playerRect.left - gameContainerRect.left + playerRect.width / 2;
  const playerY = playerRect.top - gameContainerRect.top + playerRect.height / 2;
  
  // Set laser line coordinates
  laserLine.setAttribute('x1', dollX);
  laserLine.setAttribute('y1', dollY);
  laserLine.setAttribute('x2', playerX);
  laserLine.setAttribute('y2', playerY);
  
  // Show laser
  laserBeam.style.display = 'block';
  
  // Hide laser after animation
  setTimeout(() => {
    laserBeam.style.display = 'none';
  }, 500);
}

function createBloodEffect() {
  for (let i = 0; i < 20; i++) {
    const blood = document.createElement('div');
    blood.className = 'blood';
    
    // Random size between 5 and 15 pixels
    const size = 5 + Math.random() * 10;
    blood.style.width = `${size}px`;
    blood.style.height = `${size}px`;
    
    // Position around player
    const bloodX = playerPosition + (Math.random() * 30 - 15);
    const bloodY = GAME.gameContainer.offsetHeight - 80 + (Math.random() * 60 - 30);
    
    blood.style.left = `${bloodX}px`;
    blood.style.top = `${bloodY}px`;
    
    GAME.gameContainer.appendChild(blood);
    
    // Remove blood after animation
    setTimeout(() => {
      if (GAME.gameContainer.contains(blood)) {
        GAME.gameContainer.removeChild(blood);
      }
    }, 2000);
  }
}

function calculateScore(timeLeft) {
  // If timeLeft is 25 or more, the score is always 500
  if (timeLeft >= 25) return 500;
  
  // If timeLeft is between 1 and 24, the score decreases by 10 each second
  if (timeLeft > 0) return 240 + (timeLeft * 10);

  // If timeLeft is 0, score is 0
  return 0;
}

function gameOver(isVictory) {
  endGame(isVictory, gameId, GAME, getGameOptions());
}

function getGameOptions() {
  return {
    clearIntervals: [lightChangeInterval],
    removeEventListeners: [
      { event: 'keydown', handler: handleKeyDown }
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