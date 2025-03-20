const contentContainer = document.querySelector(".content-container");
const musicButton = document.getElementById("music-button");
const musicIcon = document.getElementById("music-icon");

document.addEventListener("DOMContentLoaded", function () {
    const circleVideoLink = document.getElementById("circle-video-link");
    const challengeLink = document.getElementById("handover-link");

    if (circleVideoLink) {
        circleVideoLink.addEventListener("click", function (event) {
            event.preventDefault();
            const decodedURL = atob("aHR0cHM6Ly90aW55dXJsLmNvbS81NmprOG51aw==");
            window.open(decodedURL, "_blank");
        });
    }

    if (challengeLink) {
        challengeLink.addEventListener("click", function (event) {
            event.preventDefault();
            const decodedURL = atob("aHR0cHM6Ly9jb25mbHVlbmNlLms4czIuZ3J1cG9jZ2QuY29tL3BhZ2VzL3ZpZXdwYWdlLmFjdGlvbj9wYWdlSWQ9MTU2ODY0NDAy");
            window.open(decodedURL, "_blank");
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // List of face images
    const faceImages = [
        "./assets/img/circle_face.png",
        "./assets/img/triangle_face.png",
        "./assets/img/square_face.png"
    ];

    // Function to get a random face image
    function getRandomFace() {
        return faceImages[Math.floor(Math.random() * faceImages.length)];
    }

    // Set initial random image in the center panel
    const imageElement = document.getElementById("fab-image");
    if (imageElement) {
        imageElement.src = getRandomFace();
    }

    // Function to change the fab face every 5 seconds
    function changeFaces() {
        if (!imageElement) return;

        setTimeout(() => {
            imageElement.src = getRandomFace(); // Assign new random image
            imageElement.style.opacity = "1"; // Fade in
        }, 500); // Wait for fade-out before changing
    }

    // If on handover.html, start changing faces every 5 seconds
    if (window.location.pathname.includes("handover.html")) {
        setInterval(changeFaces, 5000);
    }

    setupBackgroundMusic();
});

// Old button
/*
function toggleMusic() {
    if (music && !music.paused) {
        music.pause();
        musicButton.innerHTML = '<span id="music-icon" class="music-icon">▶️</span> Play Music';
    } else if(music){
        music.play();
        musicButton.innerHTML = '<span id="music-icon" class="music-icon">⏸️</span> Stop Music';
    }
}*/

function setupBackgroundMusic() {
    const muteButton = document.getElementById('muteButton');
    const volumeIcon = document.getElementById('volumeIcon');
    music.volume = 0.5; // Set volume to 50%
    
    // Start playing music on first user interaction
    const startMusic = () => {
      music.play();
      document.removeEventListener('click', startMusic);
    };
    
    document.addEventListener('click', startMusic);

    // Setup mute button functionality
    muteButton.addEventListener('click', () => {
      if (music.muted) {
        music.muted = false;
        volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
      } else {
        music.muted = true;
        volumeIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
      }
    });
}

function togglePlayersPanel() {
    const playersList = document.getElementById("players-list");
    playersList.classList.toggle("visible");
}

function updateCountdown() {
    const targetDate = new Date("2025-04-04T19:00:00");
    const now = new Date();
    const difference = targetDate - now;
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    if (difference > 0) {
        const days = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0');
        const hours = String(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const seconds = String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0');

        if (daysElement) daysElement.innerText = days;
        if (hoursElement) hoursElement.innerText = hours;
        if (minutesElement) minutesElement.innerText = minutes;
        if (secondsElement) secondsElement.innerText = seconds;
    }
}

if (window.location.pathname.endsWith("handover.html")) {
    setInterval(updateCountdown, 1000);
    contentContainer.classList.add("visible");
}