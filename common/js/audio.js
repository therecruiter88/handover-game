document.addEventListener("DOMContentLoaded", function () {
    // Create audio objects for hover and click sounds
    const hoverSound = new Audio("../../common/assets/audio/mouse_hover.wav");
    const clickSound = new Audio("../../common/assets/audio/mouse_click.wav");

    // Get the elements to add sound effects
    const elements = document.querySelectorAll(".sound-efx");

    elements.forEach(element => {
        // Check if the element is disabled or has the 'disabled' class
        if (element.disabled || element.classList.contains('disabled')) {
            return; // Skip the rest of the code if the element is disabled
        }

        // Play sound on hover
        element.addEventListener("mouseenter", () => {
            hoverSound.currentTime = 0; // Reset sound to start
            hoverSound.play();
        });

        // Play sound on click
        element.addEventListener("click", () => {
            clickSound.currentTime = 0; // Reset sound to start
            clickSound.play();
        });
    });
});