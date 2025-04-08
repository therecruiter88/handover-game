const daysPanel = document.getElementById("countdown-days");
const hoursPanel = document.getElementById("countdown-hours");
const minutesPanel = document.getElementById("countdown-minutes");
const secondsPanel = document.getElementById("countdown-seconds");

daysPanel.addEventListener("mouseenter", function() {
    const daysSound = document.getElementById("mc1");
    daysSound.play();
});

hoursPanel.addEventListener("mouseenter", function() {
    const hoursSound = document.getElementById("mc2");
    hoursSound.play();
});

minutesPanel.addEventListener("mouseenter", function() {
    const minutesSound = document.getElementById("mc2");
    minutesSound.play();
});

secondsPanel.addEventListener("mouseenter", function() {
    const secondsSound = document.getElementById("mc3");
    secondsSound.play();
});