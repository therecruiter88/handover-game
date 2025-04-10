import { getPinkSoldierMessage} from '/js/pink-soldier-messages.js';
import { toggleBackgroundMusic} from '/common/js/audio.js';
import { getPhase3PlayerTiles } from '/js/obfuscator-audio-2.js'
import { getProgressFlag } from '/common/js/progress.js';

const contentContainer = document.querySelector(".content-container");

const challengeTwoItem = document.getElementById("challenge-2-item");
const challengeThreeItem = document.getElementById("challenge-3-item");
const challengeFourItem = document.getElementById("challenge-4-item");
const challengeFiveItem = document.getElementById("challenge-5-item");

// Grab the playerNumber from the URL query parameters
const queryParams = new URLSearchParams(window.location.search);
const playerNumber = queryParams.get('playerNumber');

document.addEventListener("DOMContentLoaded", function () {
    //const circleVideoLink = document.getElementById("circle-video-link");
    /*
    if (circleVideoLink) {
        circleVideoLink.addEventListener("click", function (event) {
            event.preventDefault();
            const decodedURL = atob("aHR0cHM6Ly90aW55dXJsLmNvbS81NmprOG51aw==");
            window.open(decodedURL, "_blank");
        });
    }
    */
    const challengeLink = document.getElementById("handover-link");
    if (challengeLink) {
        challengeLink.addEventListener("click", function (event) {
            event.preventDefault();
            const decodedURL = atob("aHR0cHM6Ly9jb25mbHVlbmNlLms4czIuZ3J1cG9jZ2QuY29tL3BhZ2VzL3ZpZXdwYWdlLmFjdGlvbj9wYWdlSWQ9MTU2ODY0NDAy");
            window.open(decodedURL, "_blank");
        });
    }
});

// Old button
/*function toggleMusic() {
    const musicButton = document.getElementById("music-button");
    const musicIcon = document.getElementById("music-icon");
    if (music && !music.paused) {
        music.pause();
        musicButton.innerHTML = '<span id="music-icon" class="music-icon">▶️</span> Play Music';
    } else if(music){
        music.play();
        musicButton.innerHTML = '<span id="music-icon" class="music-icon">⏸️</span> Stop Music';
    }
}*/

function setupBackgroundMusic(musicSrc) {
    const music = document.getElementById("background-music");
    music.src = musicSrc;
    music.volume = 0.5; // Set volume to 50%
    
    // Start playing music on first user interaction
    const startMusic = () => {
        music.play();
        document.removeEventListener('click', startMusic);
    };
    
    document.addEventListener('click', startMusic);

    const muteButton = document.getElementById('muteButton');
    // Setup mute button functionality
    muteButton.addEventListener('click', () => {
      toggleBackgroundMusic()
    });
}

window.togglePlayersPanel = function( ) {
    const playersList = document.getElementById("players-list");
    if(playersList) playersList.classList.toggle("visible");
};

function updateCountdown() {
    const targetDate = new Date("2025-04-04T18:00:00");
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

/*
document.getElementById('movie-button').addEventListener('click', () => {
    const decodedURL = atob("aHR0cHM6Ly90aW55dXJsLmNvbS81NmprOG51aw==");
    window.open(decodedURL, "_blank");
});
*/

// Select all elements whose id contains 'challenge-'
const challengeElements = document.querySelectorAll('[id*="challenge-"]');

// Loop over each element and attach a click event listener
challengeElements.forEach(element => {
  element.addEventListener('click', async function () {
    const challengeId = element.getAttribute('id');
    const isVaultOpened = await getProgressFlag(playerNumber, 'isVaultOpened');
    const isVaultKeyFound = await getProgressFlag(playerNumber, 'isVaultKeyFound');
    let canRedirect = true;

    if (challengeId === 'challenge-4' && (!isVaultOpened || !isVaultKeyFound)) canRedirect = false;

    if (canRedirect) {
        let url = element.getAttribute('data-url');

        // If playerNumber exists in the URL, append it to the challenge elements
        if (url && playerNumber) {
            // Check if the URL already contains query parameters
            const separator = url.includes('?') ? '&' : '?';
            // Append playerNumber query parameter to the URL
            url = url + separator + 'playerNumber=' + playerNumber;

            const clickChallengeSound = new Audio("/common/assets/audio/mouse_click_challenge.wav");
            clickChallengeSound.currentTime = 0; // Reset sound to start
            clickChallengeSound.play().catch((error) => console.error("Challenge click audio playback error:", error));

            setTimeout(() => {
                window.location.href = url;
            }, 1000);

        }
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
    // When player puts the wrong handover.html without query parameters on the url directy, applies this failsafe
    const urlParams = new URLSearchParams(window.location.search);
    const hasPlayerNumber = urlParams.has('playerNumber');
    const hasBombExploded = urlParams.has('bombExploded');
    if (!hasPlayerNumber && !hasBombExploded) window.location.href = "index.html";

    // Changed to new netflix challenges slider
    //updatedChallengesFabIcon();
    disableAllChallengesBeforeBombExploded();
    updateAshesContainerVisibility(false);

    const bombExploded = getProgressFlag(playerNumber, 'bombExploded');
    
    if (bombExploded) {

        // Force play new music
        setupBackgroundMusic("/assets/audio/sg_theme_song_2.mp3");
        const music = document.getElementById("background-music");
        const volumeIcon = document.getElementById('volumeIcon');
        console.log("aqui");
        if (music) music.muted = false;
        if (volumeIcon) volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';

        updateAshesContainerVisibility(true)
        hideBombAfterExplosion();

        // Update pink soldier message
        const message = getPinkSoldierMessage("enigmasIntro");
        messageElement.innerHTML = message.replace(/\n/g, '<br>'); // Replace \n with <br> for line breaks

        enableChallengesAfterBombExploded();
        getPhase3PlayerTiles();
        updateVaultImage();
        updateChallenge4();

    } else {
        setupBackgroundMusic("/assets/audio/sg_theme_song.mp3");
    }
});

function updatedChallengesFabIcon() {
    // List of face images
    const faceImages = [
        "/assets/img/circle_face.png",
        "/assets/img/triangle_face.png",
        "/assets/img/square_face.png"
    ];
    
    // Function to get a random face image
    function getRandomFace() {
        return faceImages[Math.floor(Math.random() * faceImages.length)];
    }
    
    // Set initial random image in the center panel
    const imageElement = document.getElementById("fab-image");
    if (imageElement) imageElement.src = getRandomFace();
    
    // Function to change the fab face every 5 seconds
    function changeFaces() {
        if (!imageElement) return;
    
        setTimeout(() => {
            imageElement.src = getRandomFace(); // Assign new random image
            imageElement.style.opacity = "1"; // Fade in
        }, 500); // Wait for fade-out before changing
    }
    
    // If on handover.html, start changing faces every 5 seconds
    if (window.location.pathname.includes("handover.html")) setInterval(changeFaces, 5000);    
}

function updateAshesContainerVisibility(show) {
    const ashesContainer = document.getElementById('canvascontainer');
    if (!ashesContainer) return;

    ashesContainer.style.display = show ? '' : 'none';
}

function hideBombAfterExplosion() {
    const bombContainer = document.getElementById('bomb-container');
    const canvasContainer = document.getElementById('three-canvas');

    if (bombContainer) {
        bombContainer.classList.add('hidden');
        canvasContainer.classList.add('hidden');
        bombContainer.classList.remove('visible');
        canvasContainer.classList.remove('visible');
        bombContainer.style.display = 'none';
    }
}

function disableAllChallengesBeforeBombExploded() {
    if (challengeTwoItem) challengeTwoItem.classList.add('hidden');
    if (challengeThreeItem) challengeThreeItem.classList.add('hidden');
    if (challengeFourItem) challengeFourItem.classList.add('hidden');
    if (challengeFiveItem) challengeFiveItem.classList.add('hidden');
}

function enableChallengesAfterBombExploded() {
   if (challengeTwoItem) challengeTwoItem.classList.remove('hidden');
   if (challengeThreeItem) challengeThreeItem.classList.remove('hidden');
}

async function updateVaultImage() {
    const isVaultOpened = await getProgressFlag(playerNumber, 'isVaultOpened');
    const isVaultKeyFound = await getProgressFlag(playerNumber, 'isVaultKeyFound');

    const vaultElement = document.getElementById('vault');

    // If the vault is opened and the key is found, change the background image accordingly
    if (isVaultOpened) {
        // Update pink soldier message
        const message = getPinkSoldierMessage("fourthChallengeIntro");
        messageElement.innerHTML = message.replace(/\n/g, '<br>'); // Replace \n with <br> for line breaks
        if (isVaultKeyFound) {
            // If both flags are true, set the "open" image with key
            vaultElement.classList.add("opened-no-key");
        } else {
            // If the vault is opened but no key is found, set the regular opened image
            vaultElement.classList.add("opened");
        }
    } else {
        // If the vault is not opened, set the "closed" image
        vaultElement.classList.add("vault-closed");
    }
}

async function updateChallenge4() {
    const isChallenge4Unlocked = await getProgressFlag(playerNumber, 'isChallenge4Unlocked');

    // Check if the vault is opened but the key is not found
    if (isChallenge4Unlocked) {
        // Change cover
        const challenge4Cover = document.getElementById("challenge-4-cover");
        challenge4Cover.src = "/assets/img/covers/challenge-4.png";
    }
}