const music = document.getElementById("background-music");
const musicButton = document.getElementById("music-button");
const musicIcon = document.getElementById("music-icon");
const contentContainer = document.querySelector(".content-container");
window.onload = showMobileMessage;

document.addEventListener("contextmenu", (event) => event.preventDefault());

setInterval(() => {
    if (window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200) {
        document.body.innerHTML = "DevTools access denied!";
    }
}, 1000);

document.addEventListener("keydown", (event) => {
    if (event.key === "F12" || 
        (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "J")) || 
        (event.ctrlKey && event.key === "U")) {
        event.preventDefault();
    }
});

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Mobile|Opera Mini/i.test(navigator.userAgent);
}
  
function showMobileMessage() {
    const mobileMessageElement = document.getElementById("mobile-message");
    const tokenContainerElement = document.getElementById("token");
    const tokenInput = document.getElementById("token-input");
    
    if (isMobileDevice()) {
        if (mobileMessageElement) mobileMessageElement.className = "mobile-message";
        if (tokenContainerElement) tokenContainerElement.className = "hidden";
    } else {
        if (tokenContainerElement) tokenContainerElement.className = "token-container";
        if (mobileMessageElement) mobileMessageElement.className = "hidden";
        if (tokenInput) tokenInput.focus();
    }
}
  
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

async function calculateHash(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

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

if (window.location.pathname.endsWith("handover.html")) {
    setInterval(updateCountdown, 1000);
    contentContainer.classList.add("visible");
}