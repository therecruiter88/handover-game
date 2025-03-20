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

                overHereText.style.left = `${headLeftOffset + soldierRect.width * 0.5}px`;
                overHereText.style.top = `${headTopOffset - soldierRect.height * 0.2}px`; // Just above the head
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
    // Define the message for the dialog
    //const message1 = "Player, you thought discovering the secret was the challenge? (laughs) \n Oh, you’re just getting started! \n Relax, this next game won’t be too hard...(giggle) but let’s find out, shall we? \n To proceed just click on the circle icon near the music controls...";
    const message = "Oh no! There's a bomb right beside me, and it’s about to explode! 💣💥 What should I do?! Do I run? Do I hide? Or… do YOU have a plan? 🤔 Maybe there’s a way to stop it—or maybe… you just want to see what secrets will it unveil?! I hope you make the right choice… for all of us! 😨";

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