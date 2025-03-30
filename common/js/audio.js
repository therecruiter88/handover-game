export function toggleBackgroundMusic() {
    const music = document.getElementById("background-music");
    const volumeIcon = document.getElementById('volumeIcon');
    if (music.muted) {
        //console.log("Music is muted");
        music.muted = false;
        volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    } else {
        //console.log("Music is playing");
        music.muted = true;
        volumeIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Create audio objects for hover and click sounds
    const hoverSound = new Audio("/common/assets/audio/mouse_hover.wav");
    const clickSound = new Audio("/common/assets/audio/mouse_click.wav");
    const clickChallengeSound = new Audio("/common/assets/audio/mouse_click_challenge.wav");

    // Event delegation for hover and focus
    document.addEventListener(
        "mouseover",
        (event) => {
            if (
                event.target &&
                event.target.classList &&
                event.target.classList.contains("sound-efx") &&
                !event.target.disabled
            ) {
                hoverSound.currentTime = 0; // Reset sound to start
                hoverSound.play().catch((error) => console.error("Mouse enter audio playback error:", error));
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
                hoverSound.play().catch((error) => console.error("Focus audio playback error:", error));
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
                    clickChallengeSound.play().catch((error) => console.error("Challenge click audio playback error:", error));

                    // Handle navigation if the element has a data-url attribute
                    if (url) {
                        event.preventDefault(); // Prevent immediate navigation
                        setTimeout(() => {
                            window.location.href = url;
                        }, 300);
                    }
                } else {
                    clickSound.currentTime = 0; // Reset sound to start
                    clickSound.play().catch((error) => console.error("Click audio playback error:", error));
                }


            }
        });
});