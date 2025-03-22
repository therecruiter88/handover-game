// Sound elements
const storylineSound = document.getElementById('storyline-sound');
const storyContainer = document.getElementById('story-container');
const storyText = document.getElementById('story-text');
const continueBtn = document.getElementById('continue-btn');

const storyTitles = ["Storyline", "Challenge"];

// Story text
const storylineText = [
  "The handover was going fine for Player 136...until VIC went rogue, rejecting every processing without reason, RabbitMQ clogged, messages stuck in a purgatory of retries, and the Pipeline Guardian activated its failsafe: the Compliance Sentinel! Armed with precision lasers, it is ready to decommision any player out of sync!",
  "Advance through the pipeline when processing is allowed to distribute the hotfix correctly and end this madness. Stop when a validation check is in progress. Any unauthorized movement will trigger an immediate rollback...and termination. Reach the end before the time runs out, or be stuck in the handover phase forever! Will you do it in 45 seconds?!"
];

function startStoryline() {
  introContainer.style.display = 'none';
  storyContainer.style.display = 'flex';
  document.getElementById('story-title').textContent = storyTitles[0];

  let storyStep = 0;
  let charIndex = 0;
  let currentParagraph = document.createElement('p');
  storyText.innerHTML = ''; // Clear any existing content
  storyText.appendChild(currentParagraph);

  let typingInterval;

  // Function to start typing the current storyline step
  function typeStoryline() {
    typingInterval = setInterval(() => {
      if (charIndex < storylineText[storyStep].length) {
        currentParagraph.textContent += storylineText[storyStep][charIndex];
        charIndex++;
      } else {
        // Text complete, show continue button
        clearInterval(typingInterval);
        continueBtn.style.display = 'block';
      }
    }, 50);
  }

  // Function to skip typing and show the full text instantly
  function skipTyping() {
    clearInterval(typingInterval); // Stop the typing animation
    currentParagraph.textContent = storylineText[storyStep]; // Show the full text
    continueBtn.style.display = 'block'; // Show the continue button
  }

  // Start typing the first storyline step
  typeStoryline();

  // Add event listener to skip typing when the spacebar is pressed
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault(); // Prevent default spacebar behavior (e.g., scrolling)
      skipTyping();
    }
  });

  continueBtn.addEventListener('click', () => {
    storyStep++;

    if (storyStep < storylineText.length) {
      // Move to the next story step
      document.getElementById('story-title').textContent = storyTitles[storyStep];
      storyText.innerHTML = '';
      currentParagraph = document.createElement('p');
      storyText.appendChild(currentParagraph);
      charIndex = 0;
      continueBtn.style.display = 'none';

      typeStoryline(); // Start typing the next storyline step
    } else {
      // Move to instructions
      storyContainer.style.display = 'none';
      instructionsPopup.style.display = 'block';
    }
  });
}