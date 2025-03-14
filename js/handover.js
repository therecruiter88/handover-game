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
});

function toggleMusic() {
    if (music && !music.paused) {
        music.pause();
        musicButton.innerHTML = '<span id="music-icon" class="music-icon">▶️</span> Play Music';
    } else if(music){
        music.play();
        musicButton.innerHTML = '<span id="music-icon" class="music-icon">⏸️</span> Stop Music';
    }
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