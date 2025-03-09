const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer-display');
const playerSelector = document.getElementById('player-selector');
const startGameBtn = document.getElementById('start-game');
const celebration = document.getElementById('celebration');
const gameOver = document.getElementById('game-over');
const gameCompletion = document.getElementById('game-completion');
const homeButton = document.getElementById('home-button');
const nextGameButton = document.getElementById('next-game-button');
const retryButton = document.getElementById('retry-button');

const hearts = [
  document.getElementById('heart1'),
  document.getElementById('heart2'),
  document.getElementById('heart3')
];

// Sound elements
const victorySound = document.getElementById('victory-sound');
//const typingSound = document.getElementById('typing-sound');
const gameStartSound = document.getElementById('game-start-sound');
const countdownSound = document.getElementById('countdown-sound');
const countdownFastSound = document.getElementById('countdown-fast-sound');
const laserSound = document.getElementById('laser-sound');
const eliminationSound = document.getElementById('elimination-sound');

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

startGameBtn.addEventListener('click', () => {
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
    gameStartSound.play();
    startGame();
  }
});

function startGame() {
  // Initialize game state
  score = 0;
  gameTime = 30;
  bullets = [];
  targets = [];
  lives = 3;
  for (let i = 0; i < hearts.length; i++) {
    hearts[i].style.display = 'inline';
  }
  
  reasonEliminated.innerHTML= "";
  isGameOver = false;
  
  // Update UI
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${gameTime}`;
  
  // Position player
  playerPosition = (gameContainer.offsetWidth / 2) - 30;
  player.style.left = `${playerPosition}px`;
  
  // Start game loops
  gameInterval = setInterval(updateGame, 20);
  targetGenerationInterval = setInterval(generateTarget, 600);
  
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
        if (score >= 500) {
          endGame(true);
        }
        
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
  laserSound.play();
}

function generateTarget() {
  if (isGameOver) return;
  
  const targetElement = document.createElement('div');
  targetElement.className = 'target';
  
  // Create pineapple pizza SVG
  const pizzaSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  pizzaSVG.setAttribute('width', '40');
  pizzaSVG.setAttribute('height', '40');
  pizzaSVG.setAttribute('viewBox', '0 0 40 40');
  
  // Pizza base (circle)
  const pizzaBase = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  pizzaBase.setAttribute('cx', '20');
  pizzaBase.setAttribute('cy', '20');
  pizzaBase.setAttribute('r', '18');
  pizzaBase.setAttribute('fill', '#E8B96F');
  pizzaBase.setAttribute('stroke', '#C87137');
  pizzaBase.setAttribute('stroke-width', '2');
  
  // Pizza sauce
  const pizzaSauce = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  pizzaSauce.setAttribute('cx', '20');
  pizzaSauce.setAttribute('cy', '20');
  pizzaSauce.setAttribute('r', '15');
  pizzaSauce.setAttribute('fill', '#D13B1C');
  
  // Pizza cheese
  const pizzaCheese = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  pizzaCheese.setAttribute('cx', '20');
  pizzaCheese.setAttribute('cy', '20');
  pizzaCheese.setAttribute('r', '14');
  pizzaCheese.setAttribute('fill', '#F7D358');
  
  // Pineapple pieces (triangles)
  const positions = [
    { x: 10, y: 15 },
    { x: 25, y: 10 },
    { x: 20, y: 25 },
    { x: 15, y: 30 },
    { x: 28, y: 22 }
  ];
  
  positions.forEach(pos => {
    const pineapple = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    pineapple.setAttribute('points', `${pos.x},${pos.y} ${pos.x + 5},${pos.y} ${pos.x + 2.5},${pos.y - 5}`);
    pineapple.setAttribute('fill', '#FFD700');
    pizzaSVG.appendChild(pineapple);
  });
  
  // Add all elements to SVG
  pizzaSVG.appendChild(pizzaBase);
  pizzaSVG.appendChild(pizzaSauce);
  pizzaSVG.appendChild(pizzaCheese);
  
  targetElement.appendChild(pizzaSVG);
  
  // Random position and speed
  const targetX = Math.random() * (gameContainer.offsetWidth - 40);
  const targetY = -40;
  const targetSpeed = 1 + Math.random() * 2;
  
  targetElement.style.left = `${targetX}px`;
  targetElement.style.top = `${targetY}px`;
  
  gameContainer.appendChild(targetElement);
  
  targets.push({
    element: targetElement,
    x: targetX,
    y: targetY,
    width: 40,
    height: 40,
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
    hearts[i].style.display = i < lives ? 'inline' : 'none';
  }
}

function checkLifes(){
  if (lives <= 0) {
    endGame(false);
    reasonEliminated.innerHTML= "The pineapple pizzas destroyed the planet because there was no hearts left";
  }
}

function endGame(isVictory) {
  isGameOver = true;

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
    
    // Show game completion after a delay
    setTimeout(() => {
      celebration.style.display = 'none';
      gameCompletion.style.display = 'block';
    }, 5000);
  } else {
    // Game over sequence
    lives--;
    updateHeartsDisplay();
    checkLifes();
    gameOver.style.display = 'flex';
    eliminationSound.play();
  }
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

// Home and next game buttons
homeButton.addEventListener('click', () => {
  window.location.reload();
});

nextGameButton.addEventListener('click', () => {
  alert('Next game would load here!');
});