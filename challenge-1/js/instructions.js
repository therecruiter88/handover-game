const instructionsPopup = document.getElementById('instructions-popup');
const instructionsClose = document.getElementById('instructions-close');
const playerSelector = document.getElementById('player-selector');

instructionsClose.addEventListener('click', () => {
    instructionsPopup.style.display = 'none';
    playerSelector.style.display = 'block';
});