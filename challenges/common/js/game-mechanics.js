import { getPlayerNumber } from '/challenges/common/js/player-input.js';
import { saveScoreToDatabase } from '/challenges/common/js/score-manager.js';
import { getLives, setLives, getScore, setScore, setGameOver, getTimerInterval } from '/challenges/common/js/game-variables.js';

let lastUpdateTime = Date.now();
let hiddenTime = 0;

export function setupEventListeners({
    playerNumberSelect,
    beginChallengeButton,
    isPlayerNumberValid,
    startIntro,
    storylineText,
    storyTitles,
    homeButton
  }) {
    // Enable the "Begin Challenge" button once a player number is selected
    playerNumberSelect.addEventListener('change', () => {
      beginChallengeButton.disabled = playerNumberSelect.value === '';
    });
  
    // Validate input player number
    playerNumberSelect.addEventListener('input', () => {
      const isValid = playerNumberSelect.value.length === 3;
      beginChallengeButton.disabled = !isValid;
    });
  
    // Start the intro after input player number
    beginChallengeButton.addEventListener('click', () => {
      const selectedPlayerNumber = getPlayerNumber();
  
      if (!isPlayerNumberValid(selectedPlayerNumber)) {
        alert("Invalid player number! \n\n You're trying to mess up the scoreboard... xD");
        return;
      }
  
      setTimeout(() => {
        startIntro(storylineText, storyTitles);
      }, 500);
    });

    homeButton.addEventListener('click', () => {
      redirectToHomePage();
    });
}


function redirectToHomePage() {
  const playerNumber = getPlayerNumber();
  window.location.href = "/handover.html?bombExploded=true&playerNumber=" + playerNumber;
}

export function triggerStartGame(startGameButton, handleShapeSelection) {
    startGameButton.addEventListener('click', () => {

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
  
      if (typeof handleShapeSelection === 'function') {
        handleShapeSelection();
      }
    });
}

export function initializeGameParameters(GAME, startTime){
  setScore(0);

  // Update heart based on lives
  for (let i = 0; i < GAME.hearts.length; i++) {
    GAME.hearts[i].style.display = 'inline';
  }
  
  const reasonEliminated = document.getElementById('reason-eliminated');
  const winScore = document.getElementById('win-score');
  reasonEliminated.innerHTML= "";
  winScore.innerHTML = "";
  setGameOver(false);

  // Restart music from beginning
  GAME.gameStartSound.currentTime = 0;
  GAME.gameStartSound.play();
  GAME.gameStartSound.volume = 0.5;

  // Update UI
  GAME.timerDisplay.textContent = `Time: ${startTime}`;
}

export function startTimer(timerInterval, gameTime, timerDisplay, countdownSound, countdownFastSound, gameId, GAME, options) { 
    countdownFastSound.volume = 0;
    timerInterval = setInterval(() => {
        gameTime--;
        if (gameTime <= 0) {
          gameTime = 0; // Ensure timer doesn't go below 0
          timerDisplay.textContent = `Time: ${gameTime}`;
          endGame(false, gameId, GAME, options);
          return;
        }
        
        playSoundEffectforTimer(gameTime, countdownSound, countdownFastSound);
        timerDisplay.textContent = `Time: ${gameTime}`;
      }, 1000);
  
    return timerInterval;
}

export function startWaveTimer(options) {
  const {
    waveDuration = 30,
    getWaveStartTime,
    waveIntroDelay = 3000,
    timerDisplay,
    countdownSound,
    countdownFastSound,
    onWaveComplete,
    isPaused = false
  } = options;

  const resolveWaveStartTime = typeof getWaveStartTime === "function"
    ? getWaveStartTime
    : () => 0; // fallback if not provided

  let waveTime = waveDuration;
  let timerStarted = false;

  const waveTimerInterval = setInterval(() => {
    if (typeof isPaused === "function" ? isPaused() : isPaused) return;

    // Only start counting after intro delay
    if (Date.now() - resolveWaveStartTime() >= waveIntroDelay) {
      if (!timerStarted) {
        //console.log("Wave timer started!");
        timerStarted = true;
      }

      if (timerStarted) {
        //console.log("Wave time left:", waveTime);
        waveTime--;
        if (waveTime <= 0) {
          //console.log("Wave time is up!");
          waveTime = 0;
          clearInterval(getTimerInterval());
          timerDisplay.textContent = `Time: ${waveDuration}`;
          if (onWaveComplete) onWaveComplete();
          return;
        }

        playSoundEffectforTimer(waveTime, countdownSound, countdownFastSound);
        timerDisplay.textContent = `Time: ${waveTime}`;
      }
    }
  }, 1000);

  return waveTimerInterval;
}

function playSoundEffectforTimer(gameTime, countdownSound, countdownFastSound) {
  // Play sound effects when time is running low
  if (gameTime <= 5) {
    // For 5 seconds and below, play the countdown every quarter second
    countdownFastSound.currentTime = 0;
    countdownFastSound.volume = 0.7;
    countdownFastSound.play();
        
    // Add quarter-second intervals for the last 5 seconds
    if (gameTime > 0) {
      setTimeout(() => {
        countdownFastSound.currentTime = 0;
        countdownFastSound.volume = 0.5;
        countdownFastSound.play();
      }, 250);
          
      setTimeout(() => {
        countdownFastSound.currentTime = 0;
        countdownFastSound.volume = 0.5;
        countdownFastSound.play();
      }, 500);
          
      setTimeout(() => {
        countdownFastSound.currentTime = 0;
        countdownFastSound.volume = 0.5;
        countdownFastSound.play();
      }, 750);
    }
  } else if (gameTime <= 10) {
    countdownFastSound.currentTime = 0;
    countdownFastSound.volume = 0.5;
    countdownFastSound.play();
        
    // Add half-second counter for the last 10 seconds
    if (gameTime > 0) {
      setTimeout(() => {
        countdownFastSound.currentTime = 0;
        countdownFastSound.volume = 0.5;
        countdownFastSound.play();
      }, 500);
    }
  } else {
    countdownSound.currentTime = 0;
    countdownFastSound.volume = 0.1;
    countdownSound.play();
  }
}

export function endGame(isVictory, challengeId, GAME, options) {
    // Prevent further execution if already over
    setGameOver(true);
  
    // Clear general game intervals
    clearInterval(getTimerInterval());

    // Clear challenge-specific intervals
    if (options.clearIntervals) {
      options.clearIntervals.filter(Boolean).forEach(clearInterval);
    }
  
    // Remove challenge-specific keyboard event listeners
    if (options.removeEventListeners) {
      options.removeEventListeners.forEach(({ event, handler }) =>
        document.removeEventListener(event, handler)
      );
    }
  
    // Stop all sounds
    GAME.countdownSound.pause();
    GAME.countdownFastSound.pause();
    GAME.gameStartSound.pause();
  
    // Victory sequence
    if (isVictory) {
      const gameCompletion = document.getElementById('game-completion');
      const reasonEliminated = document.getElementById('reason-eliminated');
      const winScore = document.getElementById('win-score');
      const celebration = document.getElementById('celebration');
      reasonEliminated.innerHTML = "";
      winScore.innerHTML = `You achieved a final score of "${getScore()}" points!`;
      celebration.style.display = 'flex';
      GAME.victorySound.play();
  
      // Create confetti
      for (let i = 0; i < 50; i++) {
        createConfetti();
      }
  
      // Save score to Firebase
      const playerNumber = getPlayerNumber();
      saveScoreToDatabase(playerNumber, getScore(), challengeId);
  
      // Show game completion after a delay
      setTimeout(() => {
        celebration.style.display = 'none';
        gameCompletion.style.display = 'block';
      }, 5000);
    } else {
      // Game over sequence
      GAME.gameOverElement.style.display = 'flex';
      GAME.eliminationSound.play();
      loseLife(GAME);
      checkIfPlayerIsOutOfLives(GAME, challengeId);
    }
}

export function loseLife(GAME) {
    setLives(getLives() - 1);
    updateHeartsDisplay(GAME.hearts, getLives());
}

function checkIfPlayerIsOutOfLives(GAME, challengeId) {
    if (getLives() <= 0) {
      const reasonEliminated = document.getElementById('reason-eliminated');
      const winScore = document.getElementById('win-score');
      reasonEliminated.innerHTML = "Oh no! You have failed this mission!";
      winScore.innerHTML = "";
      GAME.retryButton.classList.add('hidden');
  
      // Save score to Firebase
      const playerNumber = getPlayerNumber();
      saveScoreToDatabase(playerNumber, getScore(), challengeId);
  
      // Redirect to the handover page after 5 seconds
      setTimeout(() => {
        window.location.href = "/handover.html?bombExploded=true&playerNumber=" + playerNumber;
      }, 5000);
    }
}

function updateHeartsDisplay(hearts, lives) {
  for (let i = 0; i < hearts.length; i++) {
    if (i < lives) {
      hearts[i].src = '/challenges/common/assets/img/heart_full.png';
      hearts[i].alt = 'Full Heart';
    } else {
      hearts[i].src = '/challenges/common/assets/img/heart_empty.png';
      hearts[i].alt = 'Empty Heart';
    }
  }
}

function createConfetti() {
    const gameContainer = document.getElementById('game-container');
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * gameContainer.offsetWidth}px`;
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.animationDuration = `${3 + Math.random() * 2}s`;
    gameContainer.appendChild(confetti);
    
    // Remove confetti after animation
    setTimeout(() => {
      if (gameContainer.contains(confetti)) {
        gameContainer.removeChild(confetti);
      }
    }, 5000);
}
