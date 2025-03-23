// Sound elements
const introSound = document.getElementById('intro-sound');

const introContainer = document.getElementById('intro-container');

// Intro sequence and game initialization
//setTimeout(() => {
//    introSound.volume = 0.5;
//    introSound.play();
//  }, 500);

function startIntro() {
  document.getElementById('player-name-prompt').style.display = 'none';
  document.getElementById('intro-container').style.display = 'flex';

  storylineSound.volume = 0.5;
  storylineSound.play();
  storylineSound.loop = true;

  // Play intro sound here instead of intro.js
  //introSound.volume = 0.5;
  //introSound.play();

  // Wait for intro animation to complete before starting storyline
  setTimeout(() => {
    // After the intro animation, start the storyline
    startStoryline();
  }, 4000); // 4000ms = 4 seconds, matching the duration of your logo reveal animation
}