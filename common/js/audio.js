const music = document.getElementById("background-music");

document.addEventListener("DOMContentLoaded", function () {
    // Create audio objects for hover and click sounds
    const hoverSound = new Audio("/common/assets/audio/mouse_hover.wav");
    const clickSound = new Audio("/common/assets/audio/mouse_click.wav");

    // Event delegation for hover and focus
    document.addEventListener("mouseenter", (event) => {
        if (event.target && event.target.classList && event.target.classList.contains("sound-efx") && !event.target.disabled) {
            hoverSound.currentTime = 0; // Reset sound to start
            hoverSound.play();
        }
    }, true); // Use capture phase to handle focusable elements

    document.addEventListener("focus", (event) => {
        if (event.target.classList.contains("sound-efx") && !event.target.disabled) {
            hoverSound.currentTime = 0; // Reset sound to start
            hoverSound.play();
        }
    }, true); // Use capture phase to handle focusable elements

    // Event delegation for click
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("sound-efx") && !event.target.disabled) {
            clickSound.currentTime = 0; // Reset sound to start
            clickSound.play();
        }
    });
});