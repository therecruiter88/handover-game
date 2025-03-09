function createConfetti() {
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