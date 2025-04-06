const menuChallenges = document.getElementById('menuChallenges');
const sliderContainer = document.getElementById("challenges-slider-container");
const overlayChallengesSlider = document.createElement('div');
overlayChallengesSlider.classList.add('overlay');
document.body.appendChild(overlayChallengesSlider);
let isChallengesSliderPanelVisible = false;

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

// Event listener to close the leaderboard panel when clicking outside of it
document.addEventListener('click', (event) => {
	if (isChallengesSliderPanelVisible && !sliderContainer.contains(event.target) && event.target !== menuChallenges) {
        isChallengesSliderPanelVisible = false;
        sliderContainer.classList.toggle("open");  // Add/remove 'open' class to toggle slider visibility
		overlayChallengesSlider.style.display = "none";
    }
});