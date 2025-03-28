const music = document.getElementById("background-music");

document.addEventListener("DOMContentLoaded", function () {
    // Create audio objects for hover and click sounds
    const hoverSound = new Audio("/common/assets/audio/mouse_hover.wav");
    const clickSound = new Audio("/common/assets/audio/mouse_click.wav");
    const clickChallengeSound = new Audio("/common/assets/audio/mouse_click_challenge.wav");

    // Event delegation for hover and focus
    document.addEventListener(
        "mouseenter",
        (event) => {
            if (
                event.target &&
                event.target.classList &&
                event.target.classList.contains("sound-efx") &&
                !event.target.disabled
            ) {
                hoverSound.currentTime = 0; // Reset sound to start
                hoverSound.play().catch((error) => console.error("Audio playback error:", error));
            }
        },
        true
    );

    document.addEventListener(
        "focus",
        (event) => {
            const targetElement = event.target.closest(".sound-efx");
            //console.log("Element focused:", targetElement); // Debugging log
            if (targetElement && !targetElement.disabled) {
                hoverSound.currentTime = 0; // Reset sound to start
                hoverSound.play().catch((error) => console.error("Audio playback error:", error));
            }
        },
        true
    );

    // Event delegation for click
    document.addEventListener(
        "click", 
        (event) => {
            const targetElement = event.target.closest(".sound-efx");
            if (targetElement && !targetElement.disabled) {
                //console.log("Element clicked:", targetElement);
        
                const url = targetElement.getAttribute("data-url");

                if (url) {
                    clickChallengeSound.currentTime = 0; // Reset sound to start
                    clickChallengeSound.play().catch((error) => console.error("Audio playback error:", error));

                    // Handle navigation if the element has a data-url attribute
                    if (url) {
                        event.preventDefault(); // Prevent immediate navigation
                        setTimeout(() => {
                            window.location.href = url;
                        }, 300);
                    }
                } else {
                    clickSound.currentTime = 0; // Reset sound to start
                    clickSound.play().catch((error) => console.error("Audio playback error:", error));
                }


            }
        });
});