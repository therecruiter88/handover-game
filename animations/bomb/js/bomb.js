document.addEventListener("DOMContentLoaded", function () {
    const bomb = document.getElementById("bomb");
    const countdown = document.getElementById("countdown");
    const countdownSound = document.getElementById("countdown-sound");
    const explosionSound = document.getElementById("explosion-sound");

    // Add a custom event for when the bomb explodes
    const bombExplodedEvent = new CustomEvent('bombExploded');

    bomb.addEventListener("click", function () {
        let timeLeft = 10;
        countdown.style.display = "block";
        countdown.textContent = timeLeft;
        const music = document.getElementById("background-music");

        if (music) music.volume = 0.5;
        countdownSound.play();

        let timer = setInterval(() => {
            timeLeft--;
            countdown.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                explode();
            }
        }, 1100);
    });

    function explode() {
        countdown.style.display = "none";
        //bomb.src = "./assets/img/explosion.png";  // Change to explosion image
        bomb.src = "./animations/bomb/assets/img/explosion.png"; // Use this path when integrating
        bomb.classList.add("explosion");

        explosionSound.play();
        
        // Dispatch the custom event when the bomb explodes
        document.dispatchEvent(bombExplodedEvent);

        setTimeout(() => {
            bomb.style.display = "none"; // Hide bomb after explosion
        }, 1100);
    }
});
