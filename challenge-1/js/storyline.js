// Sound elements
const storylineSound = document.getElementById('storyline-sound');
const storyContainer = document.getElementById('story-container');
const storyText = document.getElementById('story-text');
const continueBtn = document.getElementById('continue-btn');

const storyTitles = ["Storyline", "Challenge"];

// Story text
const storylineText = [
    "Today was meant to be a simple farewell pizza party for Player 297. But something went horribly wrong. Dark forces have unleashed an unstoppable plague of pineapple pizzas, threatening to take over the planet and ruining the party...",
    "What was once a celebration has become a mission, a battle for survival. To save Player 297 farewell party and stop the invasion, you must destroy every mutant pizza before it's too late! You have 30 seconds to do it, so...good luck...i guess..."
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