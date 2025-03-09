// Sound elements
const introSound = document.getElementById('intro-sound');

const introContainer = document.getElementById('intro-container');

// Intro sequence and game initialization
setTimeout(() => {
    introSound.volume = 0.5;
    introSound.play();
  }, 500);