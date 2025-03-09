// Select the soldier and dialog elements
const soldier = document.getElementById('soldier');
const dialog = document.getElementById('dialog');
const messageElement = document.getElementById('message');
const clickMe = document.getElementById("click-me")

// Define the message for the dialog
const message = "Player, you thought discovering the secret was the challenge? (laughs) \n Oh, you’re just getting started \n Relax, this next game won’t be too hard...(giggle) but let’s find out, shall we? \n To proceed just click on my face near the music controls...";

// Add a click event to the soldier
soldier.addEventListener('click', () => {
    // Replace \n with <br> for line breaks
    messageElement.innerHTML = message.replace(/\n/g, '<br>');

    // Temporarily make the dialog visible to get its dimensions
    dialog.style.display = "block";
    dialog.style.visibility = "hidden"; // Hide it but still allow measuring

    // Calculate the correct position above the soldier
    const soldierRect = soldier.getBoundingClientRect();
    const dialogHeight = dialog.offsetHeight; // Get actual height now

    dialog.style.top = `${soldierRect.top - dialogHeight - 10}px`; // 10px gap above head
    dialog.style.left = `${soldierRect.left + soldierRect.width + 250 / 2 - dialog.offsetWidth / 2}px`; // Centered

    // Now make it fully visible
    dialog.style.visibility = "visible";
    dialog.classList.add('show');

    // Hide the dialog after a few seconds
    setTimeout(() => {
        dialog.classList.remove('show');
        dialog.style.display = "none"; // Fully hide after animation
    }, 10000);

    clickMe.style.display="none"
});