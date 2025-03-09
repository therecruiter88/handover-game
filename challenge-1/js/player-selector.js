const playerOptions = document.querySelectorAll('.player-option');

// Add player selection functionality
let selectedShape = null;

playerOptions.forEach(option => {
  option.addEventListener('click', () => {
    // Remove selected class from all options
    playerOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Add selected class to clicked option
    option.classList.add('selected');
    
    // Store selected shape
    selectedShape = option.getAttribute('data-shape');
    
    // Enable start button
    startGameBtn.classList.add('enabled');
    startGameBtn.disabled = false;
  });
});