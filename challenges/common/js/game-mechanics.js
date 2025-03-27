export function setupEventListeners({
    playerNumberSelect,
    playerNumberInput,
    beginChallengeBtn,
    isPlayerNumberValid,
    startIntro,
    storylineText,
    storyTitles,
    homeButton
  }) {
    // Enable the "Begin Challenge" button once a player number is selected
    playerNumberSelect.addEventListener('change', () => {
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
        startIntro(storylineText, storyTitles);
      }, 500);
    });

    homeButton.addEventListener('click', () => {
        window.location.href = '/handover.html?challengeCompleted=true';
    });
}

export function triggerStartGame(startGameBtn, handleShapeSelection) {
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
  
      if (typeof handleShapeSelection === 'function') {
        handleShapeSelection();
      }
    });
}

export function resetGameElements(gameOver) {
  // Reset game elements
  gameOver.style.display = 'none';
  
  // Clear existing targets and bullets
  targets.forEach(target => {
    gameContainer.removeChild(target.element);
  });
  bullets.forEach(bullet => {
    gameContainer.removeChild(bullet.element);
  });
}

export function createConfetti() {
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