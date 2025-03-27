import { startIntro } from '/challenges/common/js/storyline.js';
import { isPlayerNumberValid } from '/challenges/common/js/player-validation.js';
import { saveScoreToDatabase } from '/challenges/common/js/score-manager.js';

const storyTitles = ["Storyline", "Challenge"];

// Story text
const storylineText = [
  "Today was meant to be a simple farewell pizza party for Player 297. But something went horribly wrong. Dark forces have unleashed an unstoppable plague of pineapple pizzas, threatening to take over the planet and ruining the party...",
  "What was once a celebration has become a mission, a battle for survival. To save Player 297 farewell party and stop the invasion, you must destroy every mutant pizza before it's too late! You have 30 seconds to do it, so...good luck...i guess..."
];

const playerNumberInput = document.getElementById('player-number');
const beginChallengeBtn = document.getElementById('begin-challenge');
const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer-display');
const startGameBtn = document.getElementById('start-game');
const celebration = document.getElementById('celebration');
const gameOver = document.getElementById('game-over');
const gameCompletion = document.getElementById('game-completion');
const retryButton = document.getElementById('retry-button');
const homeButton = document.getElementById('home-button');

const hearts = [
  document.getElementById('heart1'),
  document.getElementById('heart2'),
  document.getElementById('heart3')
];

// Sound elements
//const typingSound = document.getElementById('typing-sound');
const gameStartSound = document.getElementById('game-start-sound');
const countdownSound = document.getElementById('countdown-sound');
const countdownFastSound = document.getElementById('countdown-fast-sound');
const eliminationSound = document.getElementById('elimination-sound');
const victorySound = document.getElementById('victory-sound');

const laserSound = document.getElementById('laser-sound');

// Game variables
let playerPosition = 270;
let bullets = [];
let targets = [];
let score = 0;
let gameTime = 30;
let gameInterval;
let timerInterval;
let isGameOver = false;
let targetGenerationInterval;
let lives = 3;
const reasonEliminated = document.getElementById('reason-eliminated');

window.onload = showPlayerNumberInput;

// Display player number prompt
function showPlayerNumberInput() {
  const playerNumberInputElement = document.getElementById("player-name-prompt");
  const playerNumberSelect = document.getElementById('player-number');
  
  if (playerNumberInputElement) {
    document.getElementById('player-name-prompt').style.display = 'flex';
    document.getElementById('intro-container').style.display = 'none';
    document.getElementById('story-container').style.display = 'none';

    // Reset the select dropdown to its default state
    playerNumberSelect.value = ''; // This will select the first (disabled) option
  }

}

const playerNumberSelect = document.getElementById('player-number');

// Enable the "Begin Challenge" button once a player number is selected
playerNumberSelect.addEventListener('change', () => {
    // Enable the button if a valid number is selected
    beginChallengeBtn.disabled = playerNumberSelect.value === '';
});

// Validate input player number
playerNumberInput.addEventListener('input', () => {
  const isValid = playerNumberInput.value.length === 3;
  beginChallengeBtn.disabled = !isValid;
});

// Start the intro after input player number
beginChallengeBtn.addEventListener('click', () => {
  const selectedPlayerNumber = playerNumberSelect.value;

  if (!isPlayerNumberValid(selectedPlayerNumber)) {
    alert("Invalid player number! You're trying to mess up the scoreboard... xD");
    return;
  }

  setTimeout(() => {
    // Start the intro and storyline
    startIntro(storylineText, storyTitles);
  }, 500);
});

startGameBtn.addEventListener('click', () => {
  const storylineSound = document.getElementById('storyline-sound');
  
  const fadeAudio = setInterval(() => {
    if (storylineSound.volume > 0.1) {
      storylineSound.volume -= 0.1;
    } else {
      storylineSound.pause();
      storylineSound.volume = 0.5;
      clearInterval(fadeAudio);
    }
  }, 200);
  
  if (selectedShape) {
    // Set player shape based on selection
    const playerSvg = player.querySelector('svg');
    
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
    playerSelector.style.display = 'none';
    gameContainer.style.display = 'block';
    
    // Start the game
    startGame();
  }
});

function startGame() {
  // Initialize game state
  score = 0;
  gameTime = 30;
  bullets = [];
  targets = [];

  for (let i = 0; i < hearts.length; i++) {
    hearts[i].style.display = 'inline';
  }
  
  reasonEliminated.innerHTML= "";
  isGameOver = false;

  gameStartSound.currentTime = 0; // Restart from beginning
  gameStartSound.play();
  gameStartSound.volume = 0.5;
  
  // Update UI
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${gameTime}`;
  
  // Position player
  playerPosition = (gameContainer.offsetWidth / 2) - 30;
  player.style.left = `${playerPosition}px`;
  
  // Start game loops
  gameInterval = setInterval(updateGame, 20);
  targetGenerationInterval = setInterval(generateTarget, 500);
  
  // Start timer countdown
  timerInterval = setInterval(() => {
    gameTime--;
    if (gameTime <= 0) {
      gameTime = 0; // Ensure timer doesn't go below 0
      timerDisplay.textContent = `Time: ${gameTime}`;
      endGame(false);
      return;
    }
    
    // Play sound effects when time is running low
    if (gameTime <= 5) {
      // For 5 seconds and below, play the countdown every quarter second
      countdownFastSound.currentTime = 0;
      countdownFastSound.play();
      
      // Add quarter-second intervals for the last 5 seconds
      if (gameTime > 0) {
        setTimeout(() => {
          countdownFastSound.currentTime = 0;
          countdownFastSound.play();
        }, 250);
        
        setTimeout(() => {
          countdownFastSound.currentTime = 0;
          countdownFastSound.play();
        }, 500);
        
        setTimeout(() => {
          countdownFastSound.currentTime = 0;
          countdownFastSound.play();
        }, 750);
      }
    } else if (gameTime <= 10) {
      countdownFastSound.currentTime = 0;
      countdownFastSound.play();
      
      // Add half-second counter for the last 10 seconds
      if (gameTime > 0) {
        setTimeout(() => {
          countdownFastSound.currentTime = 0;
          countdownFastSound.play();
        }, 500);
      }
    } else {
      countdownSound.currentTime = 0;
      countdownSound.play();
    }
    
    timerDisplay.textContent = `Time: ${gameTime}`;
  }, 1000);
  
  // Setup keyboard controls
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
}

// Game key controls
const keys = {
  left: false,
  right: false,
  space: false
};

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
  if (isGameOver) return;
  
  // Move player
  const moveSpeed = 7;
  if (keys.left && playerPosition > 30) {
    playerPosition -= moveSpeed;
  }
  if (keys.right && playerPosition < gameContainer.offsetWidth - 30) {
    playerPosition += moveSpeed;
  }
  player.style.left = `${playerPosition}px`;
  
  // Update bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.y -= 7; // Move bullet up
    bullet.element.style.top = `${bullet.y}px`;
    
    // Remove bullets that are off screen
    if (bullet.y < 0) {
      gameContainer.removeChild(bullet.element);
      bullets.splice(i, 1);
    }
  }
  
  // Update targets
  for (let i = targets.length - 1; i >= 0; i--) {
    const target = targets[i];
    target.y += target.speed;
    target.element.style.top = `${target.y}px`;
    
    // Check if target hit bottom
    if (target.y > gameContainer.offsetHeight) {
      gameContainer.removeChild(target.element);      
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
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
        
        // Remove bullet and target
        gameContainer.removeChild(bullet.element);
        gameContainer.removeChild(target.element);
        bullets.splice(j, 1);
        targets.splice(i, 1);
        
        // Check win condition
        if (score >= 500) endGame(true);
        
        break;
      }
    }
  }
}

function fireBullet() {
  const bulletElement = document.createElement('div');
  bulletElement.className = 'bullet';
  
  const bulletX = playerPosition + 27; // Center of player
  const bulletY = gameContainer.offsetHeight - 100; // Just above player
  
  bulletElement.style.left = `${bulletX}px`;
  bulletElement.style.top = `${bulletY}px`;
  
  gameContainer.appendChild(bulletElement);

  bullets.push({
    element: bulletElement,
    x: bulletX,
    y: bulletY,
    width: 5,
    height: 15
  });

}

function generateTarget() {
  if (isGameOver) return;

  const targetElement = document.createElement('div');
  targetElement.className = 'target';

  // Create an image element instead of the SVG
  const pizzaImage = document.createElement('img');
  pizzaImage.src = './assets/img/pineapple-pizza.png'; // Path to your image
  pizzaImage.alt = 'Pineapple Pizza'; // For accessibility
  pizzaImage.style.width = '40px'; // Adjust the size as needed
  pizzaImage.style.height = '40px'; // Adjust the size as needed
  pizzaImage.style.objectFit = 'cover'; // To ensure the image fits inside the container

  targetElement.appendChild(pizzaImage);

  // Random position and speed
  const targetWidth = 40; // Width of the pizza image
  const leftPadding = 30; // Add padding on the left
  const rightPadding = 0; // Add padding on the right (optional)
  const gameWidth = gameContainer.offsetWidth;
  const maxTargetX = gameWidth - targetWidth - rightPadding - leftPadding;
  
  const targetX = leftPadding + Math.random() * maxTargetX; // Ensure pizza stays within game area
  const targetY = -targetWidth; // Start above the screen
  const targetSpeed = 2 + Math.random() * 4; // Random speed for falling

  // Set position using template literals
  targetElement.style.left = `${targetX}px`;
  targetElement.style.top = `${targetY}px`;

  // Append the target to the game container
  gameContainer.appendChild(targetElement);

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
  
  gameContainer.appendChild(hitEffect);
  
  // Remove hit effect after animation
  setTimeout(() => {
    if (gameContainer.contains(hitEffect)) {
      gameContainer.removeChild(hitEffect);
    }
  }, 300);
}

function updateHeartsDisplay() {
  for (let i = 0; i < hearts.length; i++) {
    if (i < lives) {
      hearts[i].src = './../../challenges/common/assets/img/heart_full.png';
      hearts[i].alt = 'Full Heart';
    } else {
      hearts[i].src = './../../challenges/common/assets/img/heart_empty.png';
      hearts[i].alt = 'Empty Heart';
    }
  }
}

function checkLifes(){
  // Player lost all lives
  if (lives <= 0) {
    reasonEliminated.innerHTML= "Oh no! You have failed this mission!";
    retryButton.classList.add('hidden');

    // Save score to Firebase
    const playerNumber = playerNumberSelect.value;
    saveScoreToDatabase(playerNumber, score, "challenge-1");
    
    // Redirect to the new page after 5 seconds
    setTimeout(() => {
      window.location.href = "/handover.html?challengeCompleted=true";
    }, 5000); // 5000 milliseconds = 5 seconds
  }
}

function endGame(isVictory) {
  isGameOver = true; // Prevent further execution if the game is already over (player ran out of lives)

  // Clear intervals
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  clearInterval(targetGenerationInterval);
  
  // Remove event listeners
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keyup', handleKeyUp);
  
  // Stop all sounds
  countdownSound.pause();
  countdownFastSound.pause();
  gameStartSound.pause();
   
  if (isVictory) {
    reasonEliminated.innerHTML = "";

    // Victory sequence
    celebration.style.display = 'flex';
    victorySound.play();
    
    // Create confetti
    for (let i = 0; i < 50; i++) {
      createConfetti();
    }

    // Save score to Firebase
    const playerNumber = playerNumberSelect.value;
    saveScoreToDatabase(playerNumber, score, "challenge-1");
    
    // Show game completion after a delay
    setTimeout(() => {
      celebration.style.display = 'none';
      gameCompletion.style.display = 'block';
    }, 5000);
  } else {
    // Game over sequence
    gameOver.style.display = 'flex';
    eliminationSound.play();
    loseLife();
  }
}

// Call checkLifes when you lose a life
function loseLife() {
  lives--;
  updateHeartsDisplay();
  checkLifes();  // This will trigger the end game logic if lives <= 0
}

// Retry button functionality
retryButton.addEventListener('click', () => {
  // Reset game elements
  gameOver.style.display = 'none';
  
  // Clear existing targets and bullets
  targets.forEach(target => {
    gameContainer.removeChild(target.element);
  });
  bullets.forEach(bullet => {
    gameContainer.removeChild(bullet.element);
  });
  
  // Restart game
  startGame();
});

homeButton.addEventListener('click', () => {
  window.location.href = '/handover.html?challengeCompleted=true';
});