let player;
const videoPanel = document.getElementById('video-panel');
const movieButton = document.getElementById('movie-button');
let justDisplayed = false; // Flag to track if the video panel was just displayed
let isPanelVisible = false;

const overlayVideo = document.createElement('div');

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '315',
        width: '560',
        videoId: 'wU3z6hp1ZYM',
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // Optional: Do something when the player is ready
    console.log('YT Player is ready!');
}

function onPlayerStateChange(event) {
    // Optional: Do something when the player state changes
    if (event.data == YT.PlayerState.ENDED) {
        console.log('Video ended.');
        videoPanel.classList.add('hidden');
        videoPanel.style.display = 'none'; // Hide the panel
        console.log("Video panel dismissed.");
        playMusic();
        isPanelVisible = false;
        overlayVideo.style.display = "none";
        justDisplayed = false; // Reset the flag

    }
}

movieButton.addEventListener('click', () => {
    setTimeout(() => {
        overlayVideo.classList.add('overlay-video');
        document.body.appendChild(overlayVideo);
        isPanelVisible = !isPanelVisible;

        videoPanel.style.display = isPanelVisible ? "block" : "none";
        overlayVideo.style.display = isPanelVisible ? "block" : "none";

        if (videoPanel.classList.contains('hidden')) {
            // If the panel is hidden, display it and stop the music
            videoPanel.classList.remove('hidden');
            videoPanel.style.display = 'block'; // Show the panel
            console.log("Video panel is displayed");
            stopMusic();
            justDisplayed = true; // Set the flag to true
            if (player && typeof player.playVideo === 'function') {
                setTimeout(() => {
                    player.playVideo(); // Wait and start the video automatically
                }, 1000);
            }
        } else {
            // If the panel is displayed, hide it and play the music
            videoPanel.classList.add('hidden');
            videoPanel.style.display = 'none'; // Hide the panel
            console.log("Video panel is not displayed");
            playMusic();
        }
    }, 100);
});

document.addEventListener('click', (event) => {
    // Check if the click occurred on the music button or its children
    let targetElement = event.target;
    while (targetElement) {
        if (targetElement.id === 'muteButton' || targetElement.id === 'volumeIcon') {
            return; // Ignore the click if it's on the music button
        }
        targetElement = targetElement.parentNode;
    }

    if (justDisplayed && videoPanel && !videoPanel.contains(event.target) && event.target !== movieButton) {
        // Click occurred outside the video panel right after it was displayed
        if (player && typeof player.stopVideo === 'function') {
            // Stop the video and start background music
            player.stopVideo();
            playMusic();
        }
        isPanelVisible = false;
        videoPanel.style.display = "none";
        overlayVideo.style.display = "none";
        videoPanel.classList.add('hidden'); // Hide the panel
        justDisplayed = false; // Reset the flag
    }
});

function playMusic() {
    const music = document.getElementById("background-music");
    const volumeIcon = document.getElementById('volumeIcon');
    
    if (music.muted) {
        //console.log("Music is muted");
        music.muted = false;
        volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    }
}

function stopMusic() {
    const music = document.getElementById("background-music");
    const volumeIcon = document.getElementById('volumeIcon');

    if (!music.muted) {
        //console.log("Music is playing");
        music.muted = true;
        volumeIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    }
}