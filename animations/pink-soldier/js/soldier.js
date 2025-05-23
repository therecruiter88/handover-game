const soldier = document.getElementById('soldier');
const clickMe = document.getElementById("click-me")
const dialog = document.getElementById('dialog');
const messageElement = document.getElementById('message');

/* Click me action*/
/*document.addEventListener("DOMContentLoaded", function () {
    const soldier = document.querySelector('.soldier');
    const clickMe = document.querySelector('.click-me');
  
    // Function to update click-me position
    function updateClickMePosition() {
        const soldierRect = soldier.getBoundingClientRect(); // Get the position of soldier
        const soldierLeft = soldierRect.left;
      
        // Adjust clickMe position to be below the soldier
        clickMe.style.left = `${soldierLeft + (soldierRect.width / 2) - (clickMe.offsetWidth - 5 / 2)}px`;
        clickMe.style.top = `${soldierRect.bottom - 30}px`; // 10px below soldier
    }

    // Call function on page load and whenever soldier moves
    updateClickMePosition(); 
    
    // For smoother adjustments during animations:
    soldier.addEventListener("animationiteration", updateClickMePosition);
});*/

document.addEventListener('DOMContentLoaded', function () {
    const soldier = document.getElementById('soldier');
    let soldierContainer = document.getElementById('soldier-container');

    // Define the message for the dialog
    //const message1 = "Player, you thought discovering the secret was the challenge? (laughs) \n Oh, you’re just getting started! \n Relax, this next game won’t be too hard...(giggle) but let’s find out, shall we? \n To proceed just click on the circle icon near the music controls...";
    const message = "Oh no! There's a bomb right beside me, and it’s about to explode! 💣💥 What should I do?! Do I run? Do I hide? Or… do YOU have a plan? 🤔 Maybe there’s a way to stop it—or maybe… you just want to see if detonating this thing unlocks something far more dangerous… or exciting?! 🚀 I hope you make the right choice… for all of us! 😨";

    // Replace \n with <br> for line breaks
    messageElement.innerHTML = message.replace(/\n/g, '<br>');

    // Function to check if soldierContainer is available
    function waitForSoldierContainer() {
        if (soldierContainer) {
            // Once soldierContainer is found, stop the interval and proceed
            clearInterval(checkInterval);

            let soldierRect; // To keep the position updated

            // Function to create the "Over here!" text and animation
            function createOverHereText() {
                if (!soldierContainer) {
                    console.error("soldier-container element is missing!");
                    return;
                }
            
                // Create a unique ID for the new text element
                const uniqueId = `over-here-${Date.now()}`;
            
                const overHereText = document.createElement('div');
                overHereText.textContent = 'Over here!';
                overHereText.classList.add('over-here');
                overHereText.id = uniqueId; // Assign the unique ID
                soldierContainer.appendChild(overHereText);
            
                // Position near the head
                updatePosition(overHereText);
            
                // Remove the element after the animation is completed (4 seconds)
                setTimeout(() => {
                    const textToRemove = document.getElementById(uniqueId);
                    if (textToRemove) {
                        textToRemove.remove();
                    }
                }, 4000);
            }

            // Function to update the position of "Over here!" text based on soldier's position
            function updatePosition(overHereText) {
                soldierRect = soldier.getBoundingClientRect();
                const containerRect = soldierContainer.getBoundingClientRect();
                const headTopOffset = soldierRect.top - containerRect.top;
                const headLeftOffset = soldierRect.left - containerRect.left;

                overHereText.style.left = `${headLeftOffset + soldierRect.width * (-0.5)}px`;
                overHereText.style.top = `${headTopOffset - soldierRect.height * (-4.7)}px`; // Just above the head
            }

            // Function to handle the jump event and trigger "Over here!" animation
            function onJump(event) {
                if (event.animationName === 'jump') {
                    //console.log("Is jumping");
                    createOverHereText(); // Create the "Over here!" text on jump
                }
            }

            // Check if the browser supports animations
            if (soldier.style.animation !== undefined) {

                // Create first animation of text
                setTimeout(() => {
                    createOverHereText(); // Create the "Over here!" text on jump
                }, 800);

                // Listen for the animation iteration event to detect a jump and trigger "Over here!" animation
                
                soldier.addEventListener('animationiteration', onJump);

                // Observer to keep the "Over here!" text position updated while soldier moves
                const observer = new MutationObserver(() => {
                    const overHereTexts = document.querySelectorAll('.over-here');
                    overHereTexts.forEach((overHereText) => {
                        updatePosition(overHereText);
                    });
                });

                // Observe changes in the soldier container's attributes and subtree (for movement detection)
                const containerObserver = new MutationObserver(() => {
                    soldierContainer = document.getElementById('soldier-container');
                    if (soldierContainer) {
                        observer.observe(soldierContainer, {
                            attributes: true,
                            subtree: true
                        });
                    }
                });

                containerObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });

            } else {
                console.warn("The browser does not support animation");
            }

        }
    }

    // Poll every 100ms to check if the soldierContainer is available in the DOM
    const checkInterval = setInterval(function() {
        soldierContainer = document.getElementById('soldier-container');
        waitForSoldierContainer();
    }, 100);

});

// Add a click event to the soldier
soldier.addEventListener('click', () => {
    // Temporarily make the dialog visible to get its dimensions
    dialog.style.display = "block";
    dialog.style.opacity = 0; // Initially hide

    // Calculate the correct position above the soldier
    const soldierRect = soldier.getBoundingClientRect();
    const dialogHeight = dialog.offsetHeight; // Get actual height now

    dialog.style.top = `${soldierRect.top - dialogHeight - 10}px`; // 10px gap above head
    dialog.style.left = `${soldierRect.left + soldierRect.width + 250 / 2 - dialog.offsetWidth / 2}px`; // Centered

    // Use opacity for fade-in effect, then show the dialog
    setTimeout(() => {
        dialog.style.opacity = 1; // Fade in
        dialog.classList.add('show');
    }, 100); // Ensure it's after position adjustments

    // Hide the dialog after a few seconds (fade out)
    setTimeout(() => {
        dialog.style.opacity = 0; // Fade out
        setTimeout(() => {
            dialog.classList.remove('show');
            dialog.style.display = "none"; // Fully hide after animation
        }, 300); // Allow time for fade-out
    }, 10000);

    // Hide the click-me button after soldier is clicked
    if (clickMe) clickMe.style.display = "none";
});