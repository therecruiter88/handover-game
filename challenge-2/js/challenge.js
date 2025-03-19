import { database, ref, get, set } from '../../common/js/firebaseConfig.js';

const playerNumberInput = document.getElementById('player-number');
const beginChallengeBtn = document.getElementById('begin-challenge');
const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const timerDisplay = document.getElementById('timer-display');
const lightStatus = document.getElementById('light-status');
const playerSelector = document.getElementById('player-selector');
const startGameBtn = document.getElementById('start-game');
const celebration = document.getElementById('celebration');
const gameCompletion = document.getElementById('game-completion');
const scoreboardButton = document.getElementById('scoreboard-button');
const retryButton = document.getElementById('retry-button');
const doll = document.getElementById('doll');
const gameOver = document.getElementById('game-over');
const finishLine = document.getElementById('finish-line');

// Sound elements
//const typingSound = document.getElementById('typing-sound');
const countdownFastSound = document.getElementById('countdown-fast-sound');
const countdownSound = document.getElementById('countdown-sound');
const eliminationSound = document.getElementById('elimination-sound');
const victorySound = document.getElementById('victory-sound');
const gameStartSound = document.getElementById('game-start-sound');
//const dollSound = document.getElementById('doll-song');
const redLightSound = document.getElementById('red-light-sound');
const greenLightSound = document.getElementById('green-light-sound');
const gunshotSound = document.getElementById('gunshot-sound');

const hearts = [
  document.getElementById('heart1'),
  document.getElementById('heart2'),
  document.getElementById('heart3')
];

// Game variables
let playerPosition = 30;
let gameTime = 45;
let timerInterval;
let isGameOver = false;
let isRedLight = false;
let lightChangeInterval;
let playerMoving = false;
let playerAnimationFrame;
let playerWalking = false;
let walkSpeed = 0.5; // Slower walking speed
let lives = 3;
const winScore = document.getElementById('win-score');
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

  // Ensure the selected player number is from the dropdown list
  const validPlayers = ["001", "002", "016", "018", "019", "023", "026", "051", "054", "057", "065", "068", "077", "107", "120", "130", "135", "136", "141", "182", "183", "186", "187", "188", "194", "221", "222", "226", "229", "232", "243", "273", "278", "286", "287", "297", "301", "339", "343"];

  if (!validPlayers.includes(selectedPlayerNumber)) {
    alert("Invalid player number! You're trying to mess up the scoreboard... xD");
    return;
  }

  // Proceed with the challenge...
  setTimeout(() => {
    // Start the intro
    startIntro();
  }, 500);
});

startGameBtn.addEventListener('click', () => {
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
            <rect x="5" y="5" width="20" height="30" fill="#4CAF50" />
			      <circle cx="15" cy="13" r="7" fill="black" />
			      <circle cx="15" cy="13" r="3" fill="white" />
            <rect x="8" y="35" width="14" height="20" fill="#4CAF50" />
            <rect x="0" y="30" width="80" height="8" fill="#4CAF50" />
      `;
    } else if (selectedShape === 'square') {
      playerSvg.innerHTML = `
            <rect x="5" y="5" width="20" height="30" fill="#4CAF50" />
			      <circle cx="15" cy="13" r="7" fill="black" />
			      <rect x="11" y="9" width="8" height="8" fill="white" />
            <rect x="8" y="35" width="14" height="20" fill="#4CAF50" />
            <rect x="0" y="30" width="80" height="8" fill="#4CAF50" />
      `;
    } else if (selectedShape === 'triangle') {
      playerSvg.innerHTML = `
			      <rect x="5" y="5" width="20" height="30" fill="#4CAF50" />
			      <circle cx="15" cy="13" r="7" fill="black" />
			      <polygon points="15,8 10,16 20,16" fill="white" />
			      <rect x="8" y="35" width="14" height="20" fill="#4CAF50" />
			      <rect x="0" y="30" width="80" height="8" fill="#4CAF50" />
      `;
    }
    
    // Hide player selector and show game
    playerSelector.style.display = 'none';
    gameContainer.style.display = 'block';
    
    // Start the game
    //dollSound.loop = true;
    //dollSound.volume = 0.3;
    //dollSound.play();
    startGame();
  }
});

function startGame() {
  // Initialize game state
  playerPosition = 30;
  gameTime = 45;
  isGameOver = false;
  isRedLight = false;
  playerWalking = false;
  player.classList.remove('walking');
  player.style.left = `${playerPosition}px`;

  for (let i = 0; i < hearts.length; i++) {
    hearts[i].style.display = 'inline';
  }

  reasonEliminated.innerHTML= "";
  winScore.innerHTML = "";
  isGameOver = false;

  gameStartSound.currentTime = 0; // Restart from beginning
  gameStartSound.play();
  gameStartSound.volume = 0.5;
  
  // Update UI
  timerDisplay.textContent = `Time: ${gameTime}`;
  lightStatus.textContent = "GREEN LIGHT";
  lightStatus.style.color = "#22ff22";
  
  // Start light changes
  startLightChanges();
  
  // Rotate doll to face away initially
  rotateDoll(false);

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
  
  // Start the game loop
  document.addEventListener('keydown', handleKeyDown);
}

function startLightChanges() {
  // Initial green light for a few seconds
  setTimeout(() => {
    if (!isGameOver) {
      changeLight();
      
      // Start random light changes
      lightChangeInterval = setInterval(() => {
        if (!isGameOver) {
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
      if (playerMoving && isRedLight && !isGameOver) {
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
  if (isGameOver) return;
  
  playerWalking = !playerWalking;
  
  if (playerWalking) {
    player.classList.add('walking');
    startWalking();
  } else {
    player.classList.remove('walking');
    playerMoving = false;
    cancelAnimationFrame(playerAnimationFrame);
  }
}

function startWalking() {
  playerMoving = true;
  walkPlayer();
}

function walkPlayer() {
  if (isGameOver || !playerWalking) return;
  
  playerPosition += walkSpeed;
  player.style.left = `${playerPosition}px`;
  
  // Check if player is moving during red light
  if (isRedLight) {
    eliminatePlayer();
    endGame(false);
    return;
  }
  
  // Check if player reached finish line
  const finishLinePosition = gameContainer.offsetWidth - finishLine.offsetWidth - 50;
  if (playerPosition >= finishLinePosition) {
    endGame(true);
    return;
  }
  
  // Continue walking
  playerAnimationFrame = requestAnimationFrame(walkPlayer);
}

function eliminatePlayer() {
  if (isGameOver) return; // Prevent multiple elimination
  isGameOver = true;
  
  // Stop player movement
  playerWalking = false;
  player.classList.remove('walking');
  playerMoving = false;
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
    gameOver.style.display = 'flex';
  }, 1000);
}

function fireLaserBeam() {
  const laserBeam = document.getElementById('laser-beam');
  const laserLine = document.getElementById('laser-line');
  
  // Get doll and player positions
  const dollRect = doll.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();
  const gameContainerRect = gameContainer.getBoundingClientRect();
  
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
    const bloodY = gameContainer.offsetHeight - 80 + (Math.random() * 60 - 30);
    
    blood.style.left = `${bloodX}px`;
    blood.style.top = `${bloodY}px`;
    
    gameContainer.appendChild(blood);
    
    // Remove blood after animation
    setTimeout(() => {
      if (gameContainer.contains(blood)) {
        gameContainer.removeChild(blood);
      }
    }, 2000);
  }
}

function updateHeartsDisplay() {
  for (let i = 0; i < hearts.length; i++) {
    if (i < lives) {
      hearts[i].src = './assets/img/heart_full.png'; // Full heart
      hearts[i].alt = 'Full Heart';
    } else {
      hearts[i].src = './assets/img/heart_empty.png'; // Empty heart
      hearts[i].alt = 'Empty Heart';
    }
  }
}

function checkLifes(){
  // Player lost all lives
  if (lives <= 0) {
    reasonEliminated.innerHTML= "Oh no! You have failed this mission!";
    winScore.innerHTML = "";
    retryButton.classList.add('hidden');

    // Save score to Firebase
    const playerNumber = playerNumberSelect.value;
    saveScoreToDatabase(playerNumber, 0, "challenge-2");
    
    // Redirect to the new page after 5 seconds
    setTimeout(() => {
      window.location.href = "https://www.criticalflix.com/handover.html"; // Replace with the actual URL you want to redirect to
    }, 5000); // 5000 milliseconds = 5 seconds
  }
}

function endGame(isVictory) {
  isGameOver = true; // Prevent further execution if the game is already over (player ran out of lives)

  // Clear intervals
  clearInterval(timerInterval);
  clearInterval(lightChangeInterval);
  
  // Remove keyboard controls
  document.removeEventListener('keydown', handleKeyDown);
  
  // Stop all sounds
  countdownSound.pause();
  countdownFastSound.pause();
  gameStartSound.pause();
  
  if (isVictory) {
    const score = calculateScore(gameTime);

    reasonEliminated.innerHTML = "";
    winScore.innerHTML = `You achieved a score of "${score}"`;

    // Victory sequence
    celebration.style.display = 'flex';
    victorySound.play();
    
    // Create confetti
    for (let i = 0; i < 50; i++) {
      createConfetti();
    }

    // Save score to Firebase
    const playerNumber = playerNumberSelect.value;
    saveScoreToDatabase(playerNumber, score, "challenge-2");
    
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

  // Restart game
  startGame();
});

scoreboardButton.addEventListener('click', () => {
  alert('Not implemented yet! Will implement later, maybe...\nFor now just "Return to Base" and access the scoreboard throught circle icon.');
});

function calculateScore(timeLeft) {
  // If timeLeft is 25 or more, the score is always 500
  if (timeLeft >= 25) return 500;
  
  // If timeLeft is between 1 and 24, the score decreases by 10 each second
  if (timeLeft > 0) return 240 + (timeLeft * 10);

  // If timeLeft is 0, score is 0
  return 0;
}

// Function to update the player's score and bestScore in Firebase
function saveScoreToDatabase(playerNumber, score, challengeName) {
  const playerId = `player${playerNumber.padStart(3, '0')}`;
  const playerName = `Player ${playerNumber}`;
  const playerRef = ref(database, `leaderboards/${challengeName}/${playerId}`);

  console.log(`Saving score to database: Player ID: ${playerId}, Player Name: ${playerName}, Challenge Name: ${challengeName}`);

  // Retrieve current player data from Firebase
  get(playerRef).then((snapshot) => {
      if (snapshot.exists()) {
          const playerData = snapshot.val();
          const bestScore = playerData.bestScore || 0; // Default to 0 if not set

          // Determine if bestScore should be updated
          const newBestScore = score > bestScore ? score : bestScore;

          // Update the score and bestScore if necessary
          set(playerRef, {
              player: playerName,
              score: score,
              bestScore: newBestScore
          }).then(() => {
              console.log(`Player "${playerName}" score updated to ${score}, best score is ${newBestScore}`);
          }).catch((error) => {
              console.error("Error updating score:", error);
          });

      } else {
          // If player doesn't exist, create a new player with initial bestScore
          set(playerRef, {
              player: playerName,
              score: score,
              bestScore: score
          }).then(() => {
              console.log(`New player "${playerName}" created with score ${score} and bestScore ${score}`);
          }).catch((error) => {
              console.error(`Error creating new player "${playerName}":`, error);
          });
      }
  }).catch((error) => {
      console.error(`Error checking player "${playerName}":`, error);
  });
}