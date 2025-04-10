const instructionsPopup = document.getElementById('instructions-popup');
const instructionsClose = document.getElementById('instructions-close');
const playerSelector = document.getElementById('player-selector');

// Check if the instructionsClose button exists before adding the event listener
if (instructionsClose) {
    instructionsClose.addEventListener('click', () => {
        instructionsPopup.style.display = 'none';
        playerSelector.style.display = 'block';
    });
}