const music = document.getElementById("background-music");

document.addEventListener("DOMContentLoaded", function () {
    // Create audio objects for hover and click sounds
    const hoverSound = new Audio("../../common/assets/audio/mouse_hover.wav");
    const clickSound = new Audio("../../common/assets/audio/mouse_click.wav");

    // Get the elements to add sound effects
    const soundEfxElements = document.querySelectorAll(".sound-efx");

    soundEfxElements.forEach(element => {
        // Play sound on hover
        element.addEventListener("mouseenter", () => {
            if (!element.disabled) { // Check if the element is NOT disabled
                // Play your sound effect here
                hoverSound.currentTime = 0; // Reset sound to start
                hoverSound.play();
            }
        });

        element.addEventListener("focus", () => {
            if (!element.disabled) { // Check if the element is NOT disabled
                // Play your sound effect here
                hoverSound.currentTime = 0; // Reset sound to start
                hoverSound.play();
            }
        });

        // Play sound on click
        element.addEventListener("click", () => {
            if (!element.disabled) { // Check if the element is NOT disabled
                // Play your sound effect here
                clickSound.currentTime = 0; // Reset sound to start
                clickSound.play();
            }
        });
    });
});