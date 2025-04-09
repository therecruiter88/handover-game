import { getProgressFlag, setProgressFlag } from '/common/js/progress.js';

const menuChallenges = document.getElementById('menuChallenges');
const sliderContainer = document.getElementById("challenges-slider-container");
const challenge4Cover = document.getElementById("challenge-4");

const overlayChallengesSlider = document.createElement('div');
overlayChallengesSlider.classList.add('overlay');

let isChallengesSliderPanelVisible = false;

document.body.appendChild(overlayChallengesSlider);

// Grab the playerNumber from the URL query parameters
const queryParams = new URLSearchParams(window.location.search);
const playerNumber = queryParams.get('playerNumber');

challenge4Cover.addEventListener("mouseenter", async (event) => {
    const isVaultKeyFound = await getProgressFlag(playerNumber, 'isVaultKeyFound');
    const isChallenge4Unlocked = await getProgressFlag(playerNumber, 'isChallenge4Unlocked');

    if (!isVaultKeyFound) {
      // Player hasn't found the key yet
      challenge4Cover.style.cursor = 'not-allowed';
    } else if (!isChallenge4Unlocked) {
      // Player has the key but challenge not yet unlocked
      challenge4Cover.style.cursor = 'url("/assets/cursors/golden-key.cur") 16 16, auto';
    } else {
      // Key found and challenge unlocked
      challenge4Cover.style.cursor = 'url("/assets/cursors/sg-pointer.png") 16 16, auto';
    }
  });

challenge4Cover.addEventListener("click", async (event) => {
    // Wait for the flags to be fetched from the database
    const isVaultKeyFound = await getProgressFlag(playerNumber, 'isVaultKeyFound');
  
    // Check if the vault is opened but the key is not found
    if (isVaultKeyFound) {
      await setProgressFlag(playerNumber, 'isChallenge4Unlocked', true);
      // Change cover
      const challenge4Cover = document.getElementById("challenge-4-cover");
      challenge4Cover.src = "/assets/img/covers/challenge-4.png";
    }
  });

function adjustSliderKeyframes() {
    const sliderItems = document.querySelectorAll('.challenges-slider-item');
    const totalItems = sliderItems.length;
    
    let percentage = 100 / totalItems;
    let keyframes = '';

    for (let i = 0; i < totalItems; i++) {
        keyframes += `${(i * percentage)}% { transform: translateX(-${i * percentage}%); }\n`;
    }

    // Add the final keyframe to reset the animation
    keyframes += `100% { transform: translateX(0); }`;

    // Apply the dynamic keyframes to the CSS rule
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
        @keyframes slide {
            ${keyframes}
        }
    `, styleSheet.cssRules.length);
}

// Call this function once the DOM is ready
adjustSliderKeyframes();

// Event listener to toggle the Players Disharged panel visibility
menuChallenges.addEventListener('click', (event) => {
    toggleSlider();
});

// Toggle the visibility of the slider panel
function toggleSlider() {
	isChallengesSliderPanelVisible = !isChallengesSliderPanelVisible;
	overlayChallengesSlider.style.display = isChallengesSliderPanelVisible ? "block" : "none";
    sliderContainer.classList.toggle("open");  // Add/remove 'open' class to toggle slider visibility
}
		
// Move the slider to the left or right
let currentOffset = 0;

// Move the slider to the left or right
function moveSlider(direction) {
	console.log("Moving slider", direction);
    const slider = document.getElementById('challenges-slider');
    const itemWidth = document.querySelector('.challenges-slider-item').offsetWidth + 10; // 10px is the margin-right

    // Reverse the direction by multiplying it by -1
    currentOffset += direction * itemWidth * -1;  // Change direction logic

    // Ensure the slider loops correctly (when reaching the end, go back to the start)
    const maxOffset = -(itemWidth * (slider.children.length - 3)); // Maximum offset when 3 items are visible

    if (currentOffset > 0) {
        currentOffset = maxOffset; // Loop to the last item
    } else if (currentOffset < maxOffset) {
        currentOffset = 0; // Loop back to the first item
    }

    slider.style.transform = `translateX(${currentOffset}px)`;
}

// Event listener to close the cover slider panel when clicking outside of it
document.addEventListener('click', (event) => {
	if (isChallengesSliderPanelVisible && !sliderContainer.contains(event.target) && event.target !== menuChallenges) {
        isChallengesSliderPanelVisible = false;
        sliderContainer.classList.toggle("open");  // Add/remove 'open' class to toggle slider visibility
		overlayChallengesSlider.style.display = "none";
    }
});

