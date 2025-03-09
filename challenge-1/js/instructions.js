const instructionsPopup = document.getElementById('instructions-popup');
const instructionsClose = document.getElementById('instructions-close');
const playerSelector = document.getElementById('player-selector');

instructionsClose.addEventListener('click', () => {
    instructionsPopup.style.display = 'none';
    playerSelector.style.display = 'block';
    
    const fadeAudio = setInterval(() => {
      if (storylineSound.volume > 0.1) {
        storylineSound.volume -= 0.1;
      } else {
        storylineSound.pause();
        storylineSound.volume = 0.5;
        clearInterval(fadeAudio);
      }
    }, 200);
});