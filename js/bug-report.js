import { getPlayerNumber } from '/challenges/common/js/player-input.js';

// Get modal elements
const reportBugModal = document.getElementById("report-bug-modal");
const openModalButton = document.getElementById("bug-icon");
const closeModalButton = document.getElementById("close-modal");
const playerNumberElement = document.getElementById("player-number-display");
const playerNumberInput = document.getElementById("player-number");
const bugIcon = document.getElementById('bug-icon');
const menuReportBug = document.getElementById('menuReportBug');

const overlayBug = document.createElement('div');
overlayBug.classList.add('overlay');
document.body.appendChild(overlayBug);

menuReportBug.addEventListener('click', (event) => {
    // Start the bugs animation
    startBugs();
    
    // Get viewport dimensions
    const maxWidth = window.innerWidth - bugIcon.offsetWidth;
    const maxHeight = window.innerHeight - bugIcon.offsetHeight;
    
    // Generate random X and Y
    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);
    
    // Position the bug icon
    bugIcon.style.left = `${randomX}px`;
    bugIcon.style.top = `${randomY}px`;   

    bugIcon.style.display = "block";
});

// Open the modal
openModalButton.addEventListener("click", function(event) {
    event.preventDefault();
    
    reportBugModal.style.display = "flex";
    overlayBug.style.display = isPanelVisible = "block";

    const playerNumber = getPlayerNumber();
    playerNumberElement.textContent = `Player ${playerNumber}`;

    playerNumberInput.value = `Player ${playerNumber}`;
});

// Close the modal
closeModalButton.addEventListener("click", function() {
    reportBugModal.style.display = "none";
    overlayBug.style.display = isPanelVisible = "none";
});

// Define movement directions: up, down, left, right
const directions = ['up', 'down', 'left', 'right'];

// Get the window dimensions
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

// Function to move the bug icon randomly
function moveBugIcon() {

    // Get the current position of the bug icon
    let currentX = bugIcon.offsetLeft;
    let currentY = bugIcon.offsetTop;

    // Define movement step size
    const stepSize = 10;  // You can adjust this value for larger/smaller steps

    // Randomly choose a direction
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];

    // Determine the new position based on the randomly chosen direction
    if (randomDirection === 'up') {
        currentY -= stepSize;  // Move up
    } else if (randomDirection === 'down') {
        currentY += stepSize;  // Move down
    } else if (randomDirection === 'left') {
        currentX -= stepSize;  // Move left
    } else if (randomDirection === 'right') {
        currentX += stepSize;  // Move right
    }

    // Ensure the bug stays within the horizontal bounds (do not exit the screen)
    if (currentX < 0) currentX = 0;  // Prevent going off the left
    if (currentX > windowWidth - bugIcon.offsetWidth) currentX = windowWidth - bugIcon.offsetWidth;  // Prevent going off the right

    // Ensure the bug stays within the vertical bounds (do not exit the screen)
    if (currentY < 0) currentY = 0;  // Prevent going above the screen
    if (currentY > windowHeight - bugIcon.offsetHeight) currentY = windowHeight - bugIcon.offsetHeight;  // Prevent going below the screen

    // Apply the new position
    bugIcon.style.left = currentX + 'px';
    bugIcon.style.top = currentY + 'px';
}

// Function to start the bug movement when hovering over the icon
function startMovingBug() {
    // Start moving the bug immediately when hovering
    moveBugIcon();
console.log("startMovingBug");
    // Set an interval to move the bug icon every 200ms
    setInterval(moveBugIcon, 200); // Adjust the interval as needed (200ms in this case)
}

// Event listener to move the bug icon on hover (entering the icon area)
bugIcon.addEventListener('mouseenter', startMovingBug);

// Ensure bug icon is always on top for clickability (increase z-index)
bugIcon.style.position = 'absolute';
bugIcon.style.zIndex = '9999';  // Set z-index to make sure it's always on top of other elements