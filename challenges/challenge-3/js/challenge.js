import { startIntro } from '/challenges/common/js/storyline.js';
import { setupEventListeners, triggerStartGame, initializeGameParameters, startTimer, loseLife, endGame } from '/challenges/common/js/game-mechanics.js';
import { showPlayerNumberInput, isPlayerNumberValid } from '/challenges/common/js/player-input.js';
import * as GAME from '/challenges/common/js/game-variables.js';
import { getLives, getScore, setScore, isGameOver, getTimerInterval, setTimerInterval } from '/challenges/common/js/game-variables.js';

const gameId = "challenge-3";

const storyTitles = ["Storyline", "Challenge"];

// Specific storyline
const storylineText = [
  //"Just after escaping the clutches of the dreaded Compliance Sentinel, you find yourself staring at a long, seemingly fragile bridge...the potential path to salvation! But as soon as you step on it, its flaws become painfully clear, and all you can think about is survival!",
  //"The challenge seems straightforward, but the bridge? It’s anything but predictable. One wrong step, one miscalculation, and the entire database could come crashing down. Can you make it across before time runs out, or will you fall into the depths of oblivion? The clock is ticking."
  //"After narrowly escaping the clutches of the dreaded Compliance Sentinel, you breathe a sigh of relief. But your celebration is short-lived. The hotfix was deployed to production...but someone forgot to TEST!!! Now, the database is on the verge of collapse, and the only thing standing between you and salvation is a long, fragile bridge..",
  //"Help Player 77, the database master, cross the bridge before time runs out, or risk losing all the data. One wrong move could send the entire database crashing into the abyss. Will you make it to the other side and stabilize the system, or will you fall into the depths of chaos? The clock is ticking...TICK...TOCK...DON'T DROP!"
  "Player 77, the legendary database master, thought the worst was over after escaping the clutches of the dreaded Compliance Sentinel. But now, a new nightmare looms — a bridge so fragile it feels like it was designed by an intern on their first day! Beneath it lies the abyss of chaos, where corrupted tables and cascading failures await.",
  "Your mission? Cross this treacherous glass bridge before the clock hits zero. But beware! One wrong step, and the entire database will implode into oblivion. The bridge creaks, groans, and mocks your every move. Can you outwit its unpredictability and stabilize the system? Or will you plummet into the depths of despair? TICK...TOCK...DON'T DROP!"
];

// Specific game elements
const scoreDisplay = document.getElementById('score-display');

// Specific game sounds
const glassBreakSound = document.getElementById('glass-break-sound');
const stepSound = document.getElementById('step-sound');

// Specific game mechanics variables
let gameInterval;
let startTime = 15;
let playerXOrigin = 180;
let playerYOrigin = 310;
let playerX;
let playerY;
let currentRow = 0;
let glassPanels = [];
let maxRows = 8;
let deductedPoints = 25;
let isPlayerResetting = false; // Tracks whether the player is being reset

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
        <rect x="5" y="5" width="20" height="30" fill="#FFD700" />
        <circle cx="15" cy="13" r="7" fill="black" />
        <circle cx="15" cy="13" r="3" fill="white" />
        <rect x="8" y="35" width="14" height="20" fill="#FFD700" />
        <rect x="0" y="30" width="80" height="8" fill="#FFD700" />
      `;
    } else if (selectedShape === 'square') {
      playerSvg.innerHTML = `
        <rect x="5" y="5" width="20" height="30" fill="#FFD700" />
        <circle cx="15" cy="13" r="7" fill="black" />
        <rect x="11" y="9" width="8" height="8" fill="white" />
        <rect x="8" y="35" width="14" height="20" fill="#FFD700" />
        <rect x="0" y="30" width="80" height="8" fill="#FFD700" />
      `;
    } else if (selectedShape === 'triangle') {
      playerSvg.innerHTML = `
        <rect x="5" y="5" width="20" height="30" fill="#FFD700" />
        <circle cx="15" cy="13" r="7" fill="black" />
        <polygon points="15,8 10,16 20,16" fill="white" />
        <rect x="8" y="35" width="14" height="20" fill="#FFD700" />
        <rect x="0" y="30" width="80" height="8" fill="#FFD700" />
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

  currentRow = 0;
  playerX = playerXOrigin;
  playerY = playerYOrigin;

  // Position player
  GAME.player.style.left = `${playerX}px`;
  GAME.player.style.bottom = `${playerY}px`;

  // Update UI
  scoreDisplay.textContent = `Score: ${getScore()}`;

  const existingPathMarkers = document.querySelectorAll('.path-marker');
  existingPathMarkers.forEach(marker => marker.remove());

  // Clear any existing glass panels
  const existingPanels = document.querySelectorAll('.glass-tile');
  existingPanels.forEach(panel => {
    GAME.gameContainer.removeChild(panel);
  });

  // Create glass bridge
  createGlassBridge();

  // Setup keyboard controls
  document.addEventListener('keydown', handleKeyDown);
}

function updateGame() {
  if (isGameOver()) return;
}

function createGlassBridge() {
  glassPanels = [];
  
  // Create rows of glass panels (two panels per row)
  for (let row = 0; row < maxRows; row++) {
    const rowPanels = [];
    
    // Determine which panel in this row is safe (0 = left, 1 = right)
    const safePanel = Math.floor(Math.random() * 2);
    //console.log(`Row ${row}: Safe panel is ${safePanel}`);
    
    for (let col = 0; col < 2; col++) {
      const panelElement = document.createElement('div');
      panelElement.className = 'glass-tile';
      
      // Position the panel
      const panelX = 230 + (col * 80);
      const panelY = 300 - (row * 40);
      
      panelElement.style.left = `${panelX}px`;
      panelElement.style.bottom = `${panelY}px`;
      
      // Add click event listener to the panel
      panelElement.addEventListener('click', () => {
        // Only respond if player is at the current row and not eliminated
        if (row === currentRow && !isGameOver()) {
          stepOnPanel(row, col);
        }
      });
      
      // Save panel data
      rowPanels.push({
        element: panelElement,
        isSafe: col === safePanel,
        x: panelX,
        y: panelY,
        revealed: false
      });
      
      GAME.gameContainer.appendChild(panelElement);
    }
    
    glassPanels.push(rowPanels);
  }
}

function stepOnPanel(row, col) {
  const panel = glassPanels[row][col];
  
  if (panel.isSafe) {
    //console.log(panel.revealed);
    // Increase score only if player did not step the glass
    if (!panel.revealed) {
      setScore(getScore() + 50);
      scoreDisplay.textContent = `Score: ${getScore()}`;
      
      // Safe panel
      panel.revealed = true;
      panel.element.classList.add('revealed');

      // Add path marker
      const pathMarker = document.createElement('div');
      pathMarker.className = 'path-marker';
      pathMarker.style.left = `${panel.x}px`;
      pathMarker.style.bottom = `${panel.y + 30}px`;
      GAME.gameContainer.appendChild(pathMarker);
    }
    
    // Play step sound
    stepSound.currentTime = 0;
    stepSound.play();
    
    // Move player to this panel
    playerX = panel.x + 10; // Center player on panel
    playerY = panel.y + 10; // Position player in the middle of the panel
    GAME.player.style.left = `${playerX}px`;
    GAME.player.style.bottom = `${playerY}px`;
    
    // Update current position
    currentRow++;
    
    // Check if player reached the end
    if (currentRow >= maxRows) {
      // Extract the time from the timer display
      const timeLeftText = GAME.timerDisplay.textContent;
      const timeLeft = parseInt(timeLeftText.replace("Time: ", ""), 10);

      setScore(calculateScore(timeLeft));
      gameOver(true);
    }
  } else {
    setTimeout(() => {
      // Move player to this panel
      playerX = panel.x + 10; // Center player on panel
      playerY = panel.y + 10; // Position player in the middle of the panel
      GAME.player.style.left = `${playerX}px`;
      GAME.player.style.bottom = `${playerY}px`;
    }, 500);

    // Unsafe panel - break the glass and lose a life
    panel.element.classList.add('broken');
    
    // Play glass break sound
    glassBreakSound.currentTime = 0;
    glassBreakSound.play();

    // Update score
    let actualScore = getScore();
    if (actualScore > deductedPoints) setScore(actualScore - deductedPoints);

    scoreDisplay.textContent = `Score: ${getScore()}`;
    
    // Create breaking glass effect
    const breakEffect = document.createElement('div');
    breakEffect.className = 'glass-breaking';
    breakEffect.style.left = `${panel.x}px`;
    breakEffect.style.bottom = `${panel.y}px`;
    GAME.gameContainer.appendChild(breakEffect);
    
    // Remove break effect after animation
    setTimeout(() => {
      if (GAME.gameContainer.contains(breakEffect)) {
        GAME.gameContainer.removeChild(breakEffect);
      }
    }, 500);
    
    playerFalls();
    loseLife(GAME, gameId);
    if (getLives() <= 0) gameOver(false);
  }
}

function playerFalls() {
  // Player falling animation
  GAME.player.style.animation = 'playerFall 1s forwards';
  
  // Temporarily disable arrow key events
  isPlayerResetting = true;
      
  // Reset player position after a short delay
  setTimeout(() => {
    // Reset player animation
    GAME.player.style.animation = '';
        
    // Reset player position
    playerX = playerXOrigin;
    playerY = playerYOrigin;
    GAME.player.style.left = `${playerX}px`;
    GAME.player.style.bottom = `${playerY}px`;
        
    // Reset current position
    currentRow = 0;
        
    // Re-enable arrow key events
    isPlayerResetting = false;
  }, 1000); // Wait 1 second for the reset animation to complete
}

// Game key controls
function handleKeyDown(e) {
  if (isGameOver() || isPlayerResetting) return; // Prevent actions if the game is over or the player is resetting

  if (isPlayerResetting) {
    GAME.player.classList.add('player-resetting');
  } else {
    GAME.player.classList.remove('player-resetting');
  }

  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const col = e.key === 'ArrowLeft' ? 0 : 1;

    // Only allow stepping on panels in the current row
    if (currentRow < maxRows) stepOnPanel(currentRow, col);
  }
}

function calculateScore(timeLeft) {
  let victoryBonusPoints = 100;
  let bonusScoreMultiplier = 10;
  let minimumBonusTimeThreshold = 5;
  console.log("Victory bonus: +" + victoryBonusPoints);
  if (timeLeft >= minimumBonusTimeThreshold && timeLeft <= startTime) {
    // Calculate the time difference and apply the multiplier
    const timeDifference = timeLeft - minimumBonusTimeThreshold;
    const bonusScore = timeDifference * bonusScoreMultiplier;
    console.log("Bonus score: +" + bonusScore);
    return getScore() + victoryBonusPoints + bonusScore;
  }
  return getScore() + victoryBonusPoints;
}

function gameOver(isVictory) {
  endGame(isVictory, gameId, GAME, getGameOptions());
}

function getGameOptions() {
  return {
    clearIntervals: [gameInterval],
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
